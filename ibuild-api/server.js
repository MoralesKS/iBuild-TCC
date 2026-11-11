require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ibuild',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // DECIMAL vira número
  dateStrings: true,    // DATE/DATETIME viram texto 'AAAA-MM-DD ...'
  charset: 'utf8mb4',
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '30mb' }));   // fotos chegam em base64
app.use((req, res, next) => { console.log(new Date().toLocaleTimeString(), req.method, req.url); next(); });

// pasta onde ficam as fotos enviadas (servida em /uploads/arquivo.jpg)
const PASTA_UPLOADS = path.join(__dirname, 'uploads');
fs.mkdirSync(PASTA_UPLOADS, { recursive: true });
app.use('/uploads', express.static(PASTA_UPLOADS));

/* ---------- utilidades ---------- */
const q = async (sql, params = [], conn = pool) => (await conn.query(sql, params))[0];
const h = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ erro: e.message });
  });
const dataBR = (d) => {
  if (!d) return null;
  const [dia, mes, ano] = String(d).split('/');
  return ano ? `${ano}-${mes}-${dia}` : null;
};
const fmtData = (d) => (d ? String(d).slice(0, 10).split('-').reverse().join('/') : '—');
const notificar = (conn, idUsuario, tipo, titulo, mensagem) =>
  q(
    'INSERT INTO notificacoes (id_usuario, tipo, titulo, mensagem) VALUES (?,?,?,?)',
    [idUsuario, tipo, titulo, mensagem],
    conn
  );

// versao: o app confere se a API do PC está atualizada (sem isso, ele avisa)
const VERSAO_API = 3;
app.get('/', (req, res) => res.json({ ok: true, api: 'iBuild', versao: VERSAO_API }));

/* ================================================================== */
/* USUÁRIOS                                                            */
/* ================================================================== */
// acha a especialidade cujo nome aparece no texto digitado (ex.: "Pedreiro de obra" -> Pedreiro)
async function acharEspecialidade(texto, conn = pool) {
  let esp = await q(
    "SELECT id_especialidade FROM especialidades WHERE ? LIKE CONCAT('%', nome, '%') AND nome <> 'Outros' ORDER BY LENGTH(nome) DESC LIMIT 1",
    [texto || ''], conn
  );
  if (!esp.length) esp = await q("SELECT id_especialidade FROM especialidades WHERE nome = 'Outros'", [], conn);
  return esp.length ? esp[0].id_especialidade : null;
}
async function carregarUsuario(campo, valor) {
  // "campo" só recebe 'id_usuario' ou 'firebase_uid' (valores fixos do código)
  const [u] = await q(
    `SELECT u.id_usuario, u.tipo_perfil, u.nome, u.razao_social, u.email, u.telefone, u.cidade, u.bio,
            u.foto_perfil, u.foto_loja, p.id_profissional, p.profissao,
            (SELECT COUNT(*) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS avaliacoes,
            (SELECT COALESCE(ROUND(AVG(a.nota), 1), 0) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS nota_media
       FROM usuarios u
       LEFT JOIN profissionais p ON p.id_usuario = u.id_usuario
      WHERE u.${campo} = ?`,
    [valor]
  );
  if (!u) return null;
  // Loja: endereço do card do Mapa
  let endereco = null;
  if (u.tipo_perfil === 'loja') {
    const [e] = await q('SELECT logradouro, numero, bairro, cidade, estado, latitude, longitude FROM enderecos WHERE id_usuario = ? AND principal = 1 LIMIT 1', [u.id_usuario]);
    if (e) {
      endereco = {
        logradouro: [e.logradouro, e.numero].filter(Boolean).join(', '),
        bairro: e.bairro || '', cidade: e.cidade || '', estado: e.estado || '',
        latitude: e.latitude, longitude: e.longitude,
      };
    }
  }
  return {
    idUsuario: u.id_usuario,
    idProfissional: u.id_profissional || null,
    tipoPerfil: u.tipo_perfil,
    nome: u.tipo_perfil === 'loja' && u.razao_social ? u.razao_social : u.nome,
    nomePessoa: u.nome,
    razaoSocial: u.razao_social || '',
    foto: u.foto_perfil || null,
    fotoLoja: u.foto_loja || null,
    endereco,
    profissao: u.profissao || null,
    email: u.email,
    telefone: u.telefone || '',
    cidade: u.cidade || '',
    bio: u.bio || '',
    avaliacoes: u.avaliacoes,
    notaMedia: u.nota_media,
  };
}

app.get('/usuarios/firebase/:uid', h(async (req, res) => {
  const u = await carregarUsuario('firebase_uid', req.params.uid);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(u);
}));

app.get('/usuarios/:id', h(async (req, res) => {
  const u = await carregarUsuario('id_usuario', req.params.id);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(u);
}));

app.post('/usuarios', h(async (req, res) => {
  const b = req.body;
  if (!b.email || !b.nome) return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios' });

  const existente = await q('SELECT id_usuario FROM usuarios WHERE firebase_uid = ? OR email = ?', [b.firebase_uid || null, b.email]);
  if (existente.length) {
    if (b.firebase_uid) await q('UPDATE usuarios SET firebase_uid = ? WHERE id_usuario = ?', [b.firebase_uid, existente[0].id_usuario]);
    return res.json(await carregarUsuario('id_usuario', existente[0].id_usuario));
  }

  const tipo = ['pessoa_fisica', 'autonomo', 'loja'].includes(b.tipo_perfil) ? b.tipo_perfil : 'pessoa_fisica';
  const conn = await pool.getConnection();
  let id;
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      `INSERT INTO usuarios (firebase_uid, tipo_perfil, nome, email, telefone, cpf, cnpj, razao_social, data_nascimento, cidade)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [b.firebase_uid || null, tipo, b.nome, b.email, b.telefone || null, b.cpf || null, b.cnpj || null,
       b.razao_social || null, dataBR(b.data_nascimento), b.cidade || (b.endereco && b.endereco.cidade) || null]
    );
    id = r.insertId;

    if (tipo === 'autonomo') {
      const [p] = await conn.query('INSERT INTO profissionais (id_usuario, profissao, descricao) VALUES (?,?,?)', [id, b.profissao || null, b.profissao || null]);
      const idEsp = await acharEspecialidade(b.profissao, conn);
      if (idEsp) await conn.query('INSERT INTO profissional_especialidade (id_profissional, id_especialidade) VALUES (?,?)', [p.insertId, idEsp]);
    }

    if (tipo === 'loja' && b.endereco) {
      const e = b.endereco;
      await conn.query(
        `INSERT INTO enderecos (id_usuario, nome_endereco, logradouro, numero, bairro, cidade, estado, latitude, longitude, principal)
         VALUES (?,?,?,?,?,?,?,?,?,1)`,
        [id, 'Loja', e.logradouro || null, e.numero || null, e.bairro || null, e.cidade || null, e.estado || null, e.latitude ?? null, e.longitude ?? null]
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    if (e.code === 'ER_DUP_ENTRY') {
      const u = await carregarUsuario('firebase_uid', b.firebase_uid);
      if (u) return res.json(u);
    }
    throw e;
  } finally {
    conn.release();
  }
  res.status(201).json(await carregarUsuario('id_usuario', id));
}));

// Editar perfil (tela Configurações)
app.patch('/usuarios/:id', h(async (req, res) => {
  const b = req.body;
  const [atual] = await q('SELECT id_usuario, tipo_perfil FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  if (!atual) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const campos = [];
  const valores = [];
  const mudar = (coluna, valor) => { if (valor !== undefined) { campos.push(`${coluna} = ?`); valores.push(valor === '' ? null : valor); } };
  if (b.nome !== undefined && String(b.nome).trim() === '') return res.status(400).json({ erro: 'O nome não pode ficar vazio' });
  mudar('nome', b.nome !== undefined ? String(b.nome).trim() : undefined);
  mudar('razao_social', b.razao_social);
  mudar('telefone', b.telefone);
  mudar('cidade', b.cidade);
  mudar('bio', b.bio);
  // Loja: confere o endereço do card do Mapa ANTES de gravar qualquer coisa
  let enderecoLoja = null;
  if (atual.tipo_perfil === 'loja' && b.endereco) {
    const e = b.endereco;
    const logradouro = String(e.logradouro || '').trim();
    const cidade = String(e.cidade || '').trim();
    const estado = String(e.estado || '').trim().toUpperCase();
    const lat = e.latitude == null ? null : Number(e.latitude);
    const lng = e.longitude == null ? null : Number(e.longitude);
    if (logradouro.length < 3 || cidade.length < 2 || !/^[A-Z]{2}$/.test(estado)) return res.status(400).json({ erro: 'Endereço da loja incompleto (rua e número, cidade e UF).' });
    if ((lat != null && !Number.isFinite(lat)) || (lng != null && !Number.isFinite(lng))) return res.status(400).json({ erro: 'Localização da loja inválida.' });
    enderecoLoja = { logradouro, bairro: String(e.bairro || '').trim() || null, cidade, estado, lat, lng };
  }

  if (campos.length) await q(`UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`, [...valores, atual.id_usuario]);

  if (enderecoLoja) {
    const x = enderecoLoja;
    const [existente] = await q('SELECT id_endereco FROM enderecos WHERE id_usuario = ? AND principal = 1 LIMIT 1', [atual.id_usuario]);
    if (existente) {
      await q('UPDATE enderecos SET logradouro = ?, numero = NULL, bairro = ?, cidade = ?, estado = ?, latitude = ?, longitude = ? WHERE id_endereco = ?',
        [x.logradouro, x.bairro, x.cidade, x.estado, x.lat, x.lng, existente.id_endereco]);
    } else {
      await q("INSERT INTO enderecos (id_usuario, nome_endereco, logradouro, bairro, cidade, estado, latitude, longitude, principal) VALUES (?, 'Loja', ?,?,?,?,?,?, 1)",
        [atual.id_usuario, x.logradouro, x.bairro, x.cidade, x.estado, x.lat, x.lng]);
    }
    await q('UPDATE usuarios SET cidade = ? WHERE id_usuario = ?', [x.cidade, atual.id_usuario]);
  }

  if (atual.tipo_perfil === 'autonomo' && b.profissao !== undefined) {
    const [p] = await q('SELECT id_profissional FROM profissionais WHERE id_usuario = ?', [atual.id_usuario]);
    if (p) {
      await q('UPDATE profissionais SET profissao = ?, descricao = ? WHERE id_profissional = ?', [b.profissao || null, b.profissao || null, p.id_profissional]);
      await q('DELETE FROM profissional_especialidade WHERE id_profissional = ?', [p.id_profissional]);
      const idEsp = await acharEspecialidade(b.profissao);
      if (idEsp) await q('INSERT INTO profissional_especialidade (id_profissional, id_especialidade) VALUES (?,?)', [p.id_profissional, idEsp]);
    }
  }
  res.json(await carregarUsuario('id_usuario', atual.id_usuario));
}));

// Foto de perfil: o app manda a imagem em base64
app.put('/usuarios/:id/foto', h(async (req, res) => {
  const { base64, ext } = req.body;
  if (!base64) return res.status(400).json({ erro: 'Imagem não enviada' });
  const [u] = await q('SELECT id_usuario, foto_perfil FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const extensao = ['jpg', 'jpeg', 'png', 'webp'].includes(String(ext).toLowerCase()) ? String(ext).toLowerCase() : 'jpg';
  const arquivo = `perfil-${u.id_usuario}-${Date.now()}.${extensao}`;
  fs.writeFileSync(path.join(PASTA_UPLOADS, arquivo), Buffer.from(base64, 'base64'));

  // apaga a foto antiga
  if (u.foto_perfil && u.foto_perfil.startsWith('/uploads/')) {
    fs.unlink(path.join(PASTA_UPLOADS, path.basename(u.foto_perfil)), () => {});
  }
  await q('UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?', [`/uploads/${arquivo}`, u.id_usuario]);
  res.json(await carregarUsuario('id_usuario', u.id_usuario));
}));

// Foto do card da loja (aparece no Mapa)
app.put('/usuarios/:id/foto-loja', h(async (req, res) => {
  const { base64, ext } = req.body;
  if (!base64) return res.status(400).json({ erro: 'Imagem não enviada' });
  const [u] = await q('SELECT id_usuario, tipo_perfil, foto_loja FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
  if (u.tipo_perfil !== 'loja') return res.status(403).json({ erro: 'Só contas de loja têm card no Mapa.' });
  const url = salvarImagem(base64, ext, `loja-${u.id_usuario}`);
  apagarImagem(u.foto_loja);
  await q('UPDATE usuarios SET foto_loja = ? WHERE id_usuario = ?', [url, u.id_usuario]);
  res.json(await carregarUsuario('id_usuario', u.id_usuario));
}));

/* ================================================================== */
/* ANÚNCIOS (produtos)                                                 */
/* ================================================================== */
const MAX_FOTOS_EXTRAS = 4;
const ESTADO_BANCO = { Novo: 'novo', Seminovo: 'bom', Usado: 'regular' };

function salvarImagem(base64, ext, prefixo) {
  const extensao = ['jpg', 'jpeg', 'png', 'webp'].includes(String(ext).toLowerCase()) ? String(ext).toLowerCase() : 'jpg';
  const arquivo = `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${extensao}`;
  fs.writeFileSync(path.join(PASTA_UPLOADS, arquivo), Buffer.from(base64, 'base64'));
  console.log('Foto salva:', arquivo);
  return `/uploads/${arquivo}`;
}
function apagarImagem(url) {
  if (url && url.startsWith('/uploads/')) fs.unlink(path.join(PASTA_UPLOADS, path.basename(url)), () => {});
}

// Regras do anúncio (o app também confere, mas o servidor é quem garante)
function validarAnuncio(b) {
  const erros = [];
  const nome = String(b.titulo == null ? '' : b.titulo).trim();
  if (nome.length < 3 || !/[A-Za-zÀ-ÿ]/.test(nome)) erros.push('Nome do produto inválido (mínimo 3 caracteres, com letras).');
  if (nome.length > 150) erros.push('Nome do produto muito longo (máximo 150 caracteres).');
  if (!String(b.categoria || '').trim()) erros.push('Escolha uma categoria.');

  if (b.preco == null || b.preco === '') erros.push('Informe o preço.');
  else {
    const preco = Number(b.preco);
    if (!Number.isFinite(preco)) erros.push('Preço inválido.');
    else if (preco < 0) erros.push('O preço não pode ser negativo.');
    else if (preco === 0) erros.push('O preço deve ser maior que zero.');
    else if (preco > 99999999.99 || Math.abs(Math.round(preco * 100) - preco * 100) > 1e-6) erros.push('Preço inválido (máximo de 2 casas decimais).');
  }

  if (b.quantidade == null || b.quantidade === '') erros.push('Informe a quantidade.');
  else {
    const qtd = Number(b.quantidade);
    if (!Number.isFinite(qtd)) erros.push('Quantidade inválida.');
    else if (qtd < 0) erros.push('A quantidade não pode ser negativa.');
    else if (!Number.isInteger(qtd)) erros.push('A quantidade deve ser um número inteiro.');
    else if (qtd === 0) erros.push('A quantidade deve ser pelo menos 1.');
    else if (qtd > 99999999) erros.push('Quantidade alta demais.');
  }

  if (!String(b.unidade || '').trim()) erros.push('Escolha a unidade.');
  if (String(b.descricao || '').length > 200) erros.push('A descrição pode ter no máximo 200 caracteres.');

  const local = String(b.localizacao || '').trim();
  if (local.length < 3 || !/[A-Za-zÀ-ÿ]/.test(local)) erros.push('Informe a localização do produto.');

  const tel = String(b.contato || '').replace(/\D/g, '');
  if (tel.length !== 11 || Number(tel.slice(0, 2)) < 11 || tel[2] !== '9' || /^(\d)\1+$/.test(tel)) erros.push('Informe um celular de contato válido, com DDD.');
  return erros;
}

async function idCategoria(nome, conn = pool) {
  const nomeCat = (nome || 'Outros').trim();
  await q('INSERT IGNORE INTO categorias_materiais (nome) VALUES (?)', [nomeCat], conn);
  const [cat] = await q('SELECT id_categoria FROM categorias_materiais WHERE nome = ?', [nomeCat], conn);
  return cat.id_categoria;
}

// "where" só recebe condições fixas do código
async function montarAnuncios(where, params) {
  const rows = await q(
    `SELECT a.id_anuncio, a.titulo, c.nome AS categoria, u.id_usuario AS id_vendedor,
            COALESCE(u.razao_social, u.nome) AS vendedor, u.cidade, u.telefone, a.localizacao, a.contato,
            a.descricao, a.preco_unitario, a.unidade, a.quantidade, a.estado_material, a.disponibilidade
       FROM anuncios a
       JOIN categorias_materiais c ON c.id_categoria = a.id_categoria
       JOIN usuarios u ON u.id_usuario = a.id_vendedor
      WHERE ${where}
      ORDER BY a.data_publicacao DESC, a.id_anuncio DESC`,
    params
  );
  if (!rows.length) return [];
  const fotos = await q(
    'SELECT id_foto, id_anuncio, url_foto, principal FROM fotos_anuncio WHERE id_anuncio IN (?) ORDER BY principal DESC, ordem, id_foto',
    [rows.map((r) => r.id_anuncio)]
  );
  return rows.map((r) => {
    const f = fotos.filter((x) => x.id_anuncio === r.id_anuncio);
    const capa = f.find((x) => x.principal);
    return {
      id: r.id_anuncio, nome: r.titulo, tipo: r.categoria, idVendedor: r.id_vendedor, vendedor: r.vendedor,
      localizacao: r.localizacao || r.cidade || '', contato: r.contato || r.telefone || '',
      descricao: r.descricao || '', preco: r.preco_unitario, unidade: r.unidade, quantidade: r.quantidade,
      estado: r.estado_material, disponibilidade: r.disponibilidade,
      capa: capa ? { id: capa.id_foto, url: capa.url_foto } : null,
      fotos: f.filter((x) => !x.principal).map((x) => ({ id: x.id_foto, url: x.url_foto })),
    };
  });
}

app.post('/anuncios', h(async (req, res) => {
  const b = req.body;
  if (!b.id_vendedor) return res.status(400).json({ erro: 'Vendedor não informado' });

  const erros = validarAnuncio(b);
  if (!b.foto_capa || !b.foto_capa.base64) erros.push('Adicione a foto da capa.');
  const extras = Array.isArray(b.fotos) ? b.fotos.filter((f) => f && f.base64) : [];
  if (extras.length > MAX_FOTOS_EXTRAS) erros.push(`Envie no máximo ${MAX_FOTOS_EXTRAS} fotos extras.`);
  if (erros.length) return res.status(400).json({ erro: erros.join(' ') });

  const salvas = [];
  const conn = await pool.getConnection();
  let id;
  try {
    await conn.beginTransaction();
    const idCat = await idCategoria(b.categoria, conn);
    const [r] = await conn.query(
      `INSERT INTO anuncios (id_vendedor, id_categoria, titulo, descricao, quantidade, unidade, preco_unitario,
                             estado_material, disponibilidade, localizacao, contato, status_curadoria)
       VALUES (?,?,?,?,?,?,?,?,?,?,?, 'aprovado')`,
      [b.id_vendedor, idCat, String(b.titulo).trim(), b.descricao || null, Number(b.quantidade), b.unidade,
       Number(b.preco), ESTADO_BANCO[b.estado] || 'bom', b.disponibilidade === 'Entregar' ? 'entrega' : 'retirada',
       String(b.localizacao).trim(), b.contato]
    );
    id = r.insertId;

    const capa = salvarImagem(b.foto_capa.base64, b.foto_capa.ext, `anuncio-${id}-capa`);
    salvas.push(capa);
    await conn.query('INSERT INTO fotos_anuncio (id_anuncio, url_foto, ordem, principal) VALUES (?,?,1,1)', [id, capa]);
    for (let i = 0; i < extras.length; i++) {
      const url = salvarImagem(extras[i].base64, extras[i].ext, `anuncio-${id}`);
      salvas.push(url);
      await conn.query('INSERT INTO fotos_anuncio (id_anuncio, url_foto, ordem, principal) VALUES (?,?,?,0)', [id, url, i + 2]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    salvas.forEach(apagarImagem);
    throw e;
  } finally {
    conn.release();
  }
  await notificar(pool, b.id_vendedor, 'sistema', 'Anúncio publicado', `Seu anúncio "${String(b.titulo).trim()}" já está no ar.`);
  res.status(201).json({ id });
}));

app.get('/anuncios', h(async (req, res) => {
  const where = ["a.status = 'ativo'", "a.status_curadoria = 'aprovado'"];
  const params = [];
  if (req.query.vendedor) { where.push('a.id_vendedor = ?'); params.push(req.query.vendedor); }
  res.json(await montarAnuncios(where.join(' AND '), params));
}));

app.get('/anuncios/:id', h(async (req, res) => {
  const [anuncio] = await montarAnuncios("a.status <> 'removido' AND a.id_anuncio = ?", [req.params.id]);
  if (!anuncio) return res.status(404).json({ erro: 'Anúncio não encontrado' });
  res.json(anuncio);
}));

// Editar anúncio (só quem publicou). Fotos: foto_capa (nova), fotos (novas extras), remover_fotos (ids)
app.patch('/anuncios/:id', h(async (req, res) => {
  const b = req.body;
  const [atual] = await q("SELECT id_anuncio, id_vendedor FROM anuncios WHERE id_anuncio = ? AND status <> 'removido'", [req.params.id]);
  if (!atual) return res.status(404).json({ erro: 'Anúncio não encontrado' });
  if (Number(b.id_usuario) !== atual.id_vendedor) return res.status(403).json({ erro: 'Só quem publicou o anúncio pode editá-lo.' });

  const erros = validarAnuncio(b);
  const novas = Array.isArray(b.fotos) ? b.fotos.filter((f) => f && f.base64) : [];
  const remover = (Array.isArray(b.remover_fotos) ? b.remover_fotos : []).map(Number);
  const existentes = await q('SELECT id_foto, url_foto, principal FROM fotos_anuncio WHERE id_anuncio = ?', [atual.id_anuncio]);
  const extrasMantidas = existentes.filter((f) => !f.principal && !remover.includes(f.id_foto)).length;
  if (extrasMantidas + novas.length > MAX_FOTOS_EXTRAS) erros.push(`O anúncio pode ter no máximo ${MAX_FOTOS_EXTRAS} fotos extras.`);
  const temCapa = existentes.some((f) => f.principal) || (b.foto_capa && b.foto_capa.base64);
  if (!temCapa) erros.push('Adicione a foto da capa.');
  if (erros.length) return res.status(400).json({ erro: erros.join(' ') });

  const salvas = [];
  const apagarDepois = [];
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const idCat = await idCategoria(b.categoria, conn);
    await conn.query(
      `UPDATE anuncios SET titulo = ?, id_categoria = ?, descricao = ?, quantidade = ?, unidade = ?, preco_unitario = ?,
              estado_material = ?, disponibilidade = ?, localizacao = ?, contato = ? WHERE id_anuncio = ?`,
      [String(b.titulo).trim(), idCat, b.descricao || null, Number(b.quantidade), b.unidade, Number(b.preco),
       ESTADO_BANCO[b.estado] || 'bom', b.disponibilidade === 'Entregar' ? 'entrega' : 'retirada',
       String(b.localizacao).trim(), b.contato, atual.id_anuncio]
    );

    for (const f of existentes.filter((x) => !x.principal && remover.includes(x.id_foto))) {
      await conn.query('DELETE FROM fotos_anuncio WHERE id_foto = ?', [f.id_foto]);
      apagarDepois.push(f.url_foto);
    }
    if (b.foto_capa && b.foto_capa.base64) {
      for (const f of existentes.filter((x) => x.principal)) {
        await conn.query('DELETE FROM fotos_anuncio WHERE id_foto = ?', [f.id_foto]);
        apagarDepois.push(f.url_foto);
      }
      const capa = salvarImagem(b.foto_capa.base64, b.foto_capa.ext, `anuncio-${atual.id_anuncio}-capa`);
      salvas.push(capa);
      await conn.query('INSERT INTO fotos_anuncio (id_anuncio, url_foto, ordem, principal) VALUES (?,?,1,1)', [atual.id_anuncio, capa]);
    }
    for (let i = 0; i < novas.length; i++) {
      const url = salvarImagem(novas[i].base64, novas[i].ext, `anuncio-${atual.id_anuncio}`);
      salvas.push(url);
      await conn.query('INSERT INTO fotos_anuncio (id_anuncio, url_foto, ordem, principal) VALUES (?,?,?,0)', [atual.id_anuncio, url, 50 + i]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    salvas.forEach(apagarImagem);
    throw e;
  } finally {
    conn.release();
  }
  apagarDepois.forEach(apagarImagem);
  const [anuncio] = await montarAnuncios('a.id_anuncio = ?', [atual.id_anuncio]);
  res.json(anuncio);
}));

/* ================================================================== */
/* PEDIDOS (Carrinho -> "Fazer pedido")                                */
/* ================================================================== */
app.post('/pedidos', h(async (req, res) => {
  const { id_comprador, itens } = req.body;
  if (!id_comprador || !Array.isArray(itens) || !itens.length) return res.status(400).json({ erro: 'Pedido vazio' });

  const anuncios = await q('SELECT id_anuncio, id_vendedor, titulo, preco_unitario FROM anuncios WHERE id_anuncio IN (?)', [itens.map((i) => i.id_anuncio)]);
  if (!anuncios.length) return res.status(400).json({ erro: 'Nenhum produto válido no pedido' });

  const porVendedor = {};
  for (const item of itens) {
    const a = anuncios.find((x) => x.id_anuncio === Number(item.id_anuncio));
    if (!a) continue;
    const qtd = Number(item.quantidade) > 0 ? Number(item.quantidade) : 1;
    (porVendedor[a.id_vendedor] = porVendedor[a.id_vendedor] || []).push({ a, qtd });
  }

  const conn = await pool.getConnection();
  let total = 0;
  const criados = [];
  try {
    await conn.beginTransaction();
    for (const [idVendedor, linhas] of Object.entries(porVendedor)) {
      const valor = linhas.reduce((s, l) => s + l.a.preco_unitario * l.qtd, 0);
      total += valor;
      const [p] = await conn.query(
        "INSERT INTO pedidos (id_comprador, id_vendedor, valor_produtos, taxa_plataforma, valor_total, status) VALUES (?,?,?,0,?, 'pago')",
        [id_comprador, idVendedor, valor, valor]
      );
      for (const l of linhas) {
        await conn.query(
          'INSERT INTO itens_pedido (id_pedido, id_anuncio, quantidade, preco_unitario, subtotal) VALUES (?,?,?,?,?)',
          [p.insertId, l.a.id_anuncio, l.qtd, l.a.preco_unitario, l.a.preco_unitario * l.qtd]
        );
      }
      const txt = `Pedido #${p.insertId} • R$ ${valor.toFixed(2).replace('.', ',')}`;
      await notificar(conn, id_comprador, 'compra', 'Compra confirmada', txt);
      await notificar(conn, id_comprador, 'recibo', 'Recibo disponível', `O recibo do ${txt.toLowerCase()} já está disponível`);
      await notificar(conn, idVendedor, 'compra', 'Novo pedido recebido', txt);
      criados.push(p.insertId);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  res.status(201).json({ pedidos: criados, total });
}));

/* ================================================================== */
/* LOJAS (Mapa) e PROFISSIONAIS (Contratar)                            */
/* ================================================================== */
app.get('/lojas', h(async (req, res) => {
  const rows = await q(
    `SELECT u.id_usuario, COALESCE(u.razao_social, u.nome) AS nome, u.foto_loja, u.bio, e.logradouro, e.numero, e.bairro, e.cidade,
            e.estado, e.latitude, e.longitude,
            (SELECT COUNT(*) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS num_avaliacoes,
            (SELECT COALESCE(ROUND(AVG(a.nota), 1), 0) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS avaliacao
       FROM usuarios u
       JOIN enderecos e ON e.id_usuario = u.id_usuario AND e.principal = 1
      WHERE u.tipo_perfil = 'loja' AND u.status = 'ativo' AND e.latitude IS NOT NULL AND e.longitude IS NOT NULL`
  );
  res.json(rows.map((r) => ({
    id: r.id_usuario, nome: r.nome,
    endereco: [[r.logradouro, r.numero].filter(Boolean).join(', '), r.bairro, [r.cidade, r.estado].filter(Boolean).join(' - ')].filter(Boolean).join(' • '),
    latitude: r.latitude, longitude: r.longitude, foto: r.foto_loja || null, sobre: r.bio || '', avaliacao: r.avaliacao, numAvaliacoes: r.num_avaliacoes,
  })));
}));

app.get('/profissionais', h(async (req, res) => {
  const rows = await q(
    `SELECT p.id_profissional, u.id_usuario, u.nome, u.cidade, p.profissao, p.experiencia_anos, p.media_avaliacoes,
            (SELECT es.nome FROM profissional_especialidade pe
               JOIN especialidades es ON es.id_especialidade = pe.id_especialidade
              WHERE pe.id_profissional = p.id_profissional LIMIT 1) AS categoria
       FROM profissionais p
       JOIN usuarios u ON u.id_usuario = p.id_usuario
      WHERE u.status = 'ativo'
      ORDER BY u.nome`
  );
  res.json(rows.map((r) => ({
    id: r.id_profissional, idUsuario: r.id_usuario, nome: r.nome, categoria: r.categoria || 'Outros',
    profissao: r.profissao, avaliacao: r.media_avaliacoes, cidade: r.cidade || '—',
    experiencia: `${r.experiencia_anos || 0} anos`,
  })));
}));

/* ================================================================== */
/* OBRAS (Gerenciar / Detalhes)                                        */
/* ================================================================== */
const STATUS_APP = { planejamento: 'andamento', em_andamento: 'andamento', pausada: 'andamento', concluida: 'concluida', cancelada: 'cancelada' };

async function montarObras(where, params) {
  // "where" só recebe condições fixas do código ('o.id_proprietario = ?' ou 'o.id_obra = ?')
  const obras = await q(
    `SELECT o.*, COALESCE(u.razao_social, u.nome) AS construtora,
            CONCAT_WS(', ', NULLIF(CONCAT_WS(' ', e.logradouro, e.numero), ''), e.bairro, e.cidade) AS endereco_txt
       FROM obras o
       JOIN usuarios u ON u.id_usuario = o.id_proprietario
       LEFT JOIN enderecos e ON e.id_endereco = o.id_endereco
      WHERE ${where}
      ORDER BY o.data_criacao DESC, o.id_obra DESC`,
    params
  );
  if (!obras.length) return [];
  const ids = obras.map((o) => o.id_obra);
  const tarefas = await q('SELECT id_tarefa, id_obra, titulo, status FROM tarefas_obra WHERE id_obra IN (?) ORDER BY id_tarefa', [ids]);
  const equipe = await q(
    `SELECT op.id_obra, p.id_profissional, u.id_usuario, u.nome, op.funcao
       FROM obra_profissionais op
       JOIN profissionais p ON p.id_profissional = op.id_profissional
       JOIN usuarios u ON u.id_usuario = p.id_usuario
      WHERE op.id_obra IN (?)`,
    [ids]
  );
  return obras.map((o) => {
    const t = tarefas.filter((x) => x.id_obra === o.id_obra);
    const eq = equipe.filter((x) => x.id_obra === o.id_obra);
    const pendente = t.find((x) => x.status !== 'concluida');
    return {
      id: o.id_obra, nome: o.nome, construtora: o.construtora,
      status: STATUS_APP[o.status] || 'andamento',
      entrega: fmtData(o.data_previsao_fim),
      tipo: o.tipo || '—', endereco: o.endereco_txt || '—',
      responsavel: o.responsavel_tecnico || '—', orcamento: o.orcamento_previsto,
      etapas: { fundacao: o.etapa_fundacao, estrutura: o.etapa_estrutura, acabamento: o.etapa_acabamento },
      equipe: {
        mestre: o.mestre_obras || '—', funcionariosAtivos: eq.length,
        horasTrabalhadas: o.horas_trabalhadas, proximaAcao: pendente ? pendente.titulo : 'Nenhuma',
      },
      proximasAcoes: t.map((x) => ({ id: x.id_tarefa, texto: x.titulo, feito: x.status === 'concluida' })),
      profissionais: eq.map((x) => ({ id: x.id_profissional, idUsuario: x.id_usuario, nome: x.nome, funcao: x.funcao })),
    };
  });
}

async function criarObra(conn, o) {
  const [e] = await conn.query(
    'INSERT INTO enderecos (id_usuario, nome_endereco, logradouro, cidade) VALUES (?,?,?,?)',
    [o.id_proprietario, 'Obra', o.endereco || 'Endereço não informado', o.cidade || null]
  );
  const et = o.etapas || [0, 0, 0];
  const [r] = await conn.query(
    `INSERT INTO obras (id_proprietario, id_endereco, nome, tipo, responsavel_tecnico, mestre_obras, horas_trabalhadas,
                        orcamento_previsto, data_previsao_fim, status, etapa_fundacao, etapa_estrutura, etapa_acabamento)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [o.id_proprietario, e.insertId, o.nome, o.tipo || null, o.responsavel || null, o.mestre || null, o.horas || 0,
     o.orcamento || 0, o.entrega || null, o.status || 'em_andamento', et[0], et[1], et[2]]
  );
  for (const [titulo, feito] of o.tarefas || []) {
    await conn.query('INSERT INTO tarefas_obra (id_obra, titulo, status, progresso) VALUES (?,?,?,?)',
      [r.insertId, titulo, feito ? 'concluida' : 'pendente', feito ? 100 : 0]);
  }
  return r.insertId;
}

app.get('/obras', h(async (req, res) => {
  if (!req.query.usuario) return res.status(400).json({ erro: 'Informe ?usuario=' });
  res.json(await montarObras('o.id_proprietario = ?', [req.query.usuario]));
}));

app.get('/obras/:id', h(async (req, res) => {
  const [obra] = await montarObras('o.id_obra = ?', [req.params.id]);
  if (!obra) return res.status(404).json({ erro: 'Obra não encontrada' });
  res.json(obra);
}));

app.post('/obras', h(async (req, res) => {
  const b = req.body;
  if (!b.id_proprietario || !b.nome) return res.status(400).json({ erro: 'Dados incompletos' });
  const conn = await pool.getConnection();
  try {
    const id = await criarObra(conn, { ...b, entrega: dataBR(b.entrega) });
    res.status(201).json({ id });
  } finally {
    conn.release();
  }
}));

// Cria 2 obras de exemplo para o usuário (para testar a tela Gerenciar)
app.post('/obras/exemplo/:idUsuario', h(async (req, res) => {
  const dono = req.params.idUsuario;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await criarObra(conn, {
      id_proprietario: dono, nome: 'Residencial Aurora', tipo: 'Residencial', endereco: 'Rua das Flores, 120', cidade: 'São Paulo',
      responsavel: 'Eng. Marina Duarte', mestre: 'João Batista', horas: 320, orcamento: 450000, entrega: '2027-03-15',
      etapas: [100, 70, 20],
      tarefas: [['Concretar laje do 2º andar', 1], ['Instalar tubulação hidráulica', 0], ['Comprar cerâmica do piso', 0]],
    });
    await criarObra(conn, {
      id_proprietario: dono, nome: 'Edifício Horizonte', tipo: 'Comercial', endereco: 'Av. Central, 800', cidade: 'São Paulo',
      responsavel: 'Eng. Paulo Mendes', mestre: 'Carlos Lima', horas: 1200, orcamento: 1200000, entrega: '2026-09-30',
      status: 'concluida', etapas: [100, 100, 100],
      tarefas: [['Vistoria final', 1], ['Entrega das chaves', 1]],
    });
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  res.status(201).json({ ok: true });
}));

app.patch('/tarefas/:id', h(async (req, res) => {
  const feito = !!req.body.feito;
  await q('UPDATE tarefas_obra SET status = ?, progresso = ? WHERE id_tarefa = ?', [feito ? 'concluida' : 'pendente', feito ? 100 : 0, req.params.id]);
  res.json({ ok: true });
}));

app.post('/obras/:id/tarefas', h(async (req, res) => {
  const texto = (req.body.texto || '').trim();
  if (!texto) return res.status(400).json({ erro: 'Texto vazio' });
  const [r] = await pool.query("INSERT INTO tarefas_obra (id_obra, titulo, status, progresso) VALUES (?,?, 'pendente', 0)", [req.params.id, texto]);
  res.status(201).json({ id: r.insertId });
}));

// Adiciona um autônomo a uma obra
app.post('/obras/:id/profissionais', h(async (req, res) => {
  const { id_profissional, funcao } = req.body;
  const [obra] = await q('SELECT id_obra, nome, id_proprietario FROM obras WHERE id_obra = ?', [req.params.id]);
  if (!obra) return res.status(404).json({ erro: 'Obra não encontrada' });
  const [prof] = await q('SELECT p.id_profissional, p.id_usuario, u.nome FROM profissionais p JOIN usuarios u ON u.id_usuario = p.id_usuario WHERE p.id_profissional = ?', [id_profissional]);
  if (!prof) return res.status(404).json({ erro: 'Profissional não encontrado' });

  const [r] = await pool.query('INSERT IGNORE INTO obra_profissionais (id_obra, id_profissional, funcao) VALUES (?,?,?)', [obra.id_obra, prof.id_profissional, funcao || null]);
  if (r.affectedRows === 0) return res.status(409).json({ erro: 'Esse profissional já está nesta obra' });

  await notificar(pool, prof.id_usuario, 'obra', 'Você foi adicionado a uma obra', `Você agora faz parte da obra ${obra.nome}.`);
  await notificar(pool, obra.id_proprietario, 'obra', 'Profissional adicionado', `${prof.nome} foi adicionado à obra ${obra.nome}.`);
  res.json((await montarObras('o.id_obra = ?', [obra.id_obra]))[0]);
}));

// Remove um autônomo da obra
app.delete('/obras/:id/profissionais/:idProf', h(async (req, res) => {
  await q('DELETE FROM obra_profissionais WHERE id_obra = ? AND id_profissional = ?', [req.params.id, req.params.idProf]);
  const [obra] = await montarObras('o.id_obra = ?', [req.params.id]);
  if (!obra) return res.status(404).json({ erro: 'Obra não encontrada' });
  res.json(obra);
}));

/* ================================================================== */
/* NOTIFICAÇÕES                                                        */
/* ================================================================== */
app.get('/notificacoes', h(async (req, res) => {
  if (!req.query.usuario) return res.status(400).json({ erro: 'Informe ?usuario=' });
  const rows = await q('SELECT id_notificacao, tipo, titulo, mensagem, lida, data_criacao FROM notificacoes WHERE id_usuario = ? ORDER BY data_criacao DESC, id_notificacao DESC LIMIT 100', [req.query.usuario]);
  res.json(rows.map((n) => ({ id: n.id_notificacao, tipo: n.tipo, titulo: n.titulo, mensagem: n.mensagem, lida: !!n.lida, data: n.data_criacao })));
}));

app.post('/notificacoes/lidas', h(async (req, res) => {
  await q('UPDATE notificacoes SET lida = 1 WHERE id_usuario = ?', [req.body.usuario]);
  res.json({ ok: true });
}));

/* ---------- iniciar ---------- */
// Ao iniciar: testa o MySQL e avisa se falta rodar a migração
(async () => {
  try {
    await pool.query('SELECT 1');
    const [col] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'firebase_uid'");
    const [col2] = await pool.query("SHOW COLUMNS FROM anuncios LIKE 'localizacao'");
    if (!col.length) console.log('MySQL conectado, mas FALTA rodar o migracao.sql (coluna firebase_uid não existe).');
    else if (!col2.length) console.log('MySQL conectado, mas FALTA rodar o migracao2.sql (anuncios.localizacao / contato).');
    else if (!(await pool.query("SHOW COLUMNS FROM usuarios LIKE 'foto_loja'"))[0].length) console.log('MySQL conectado, mas FALTA rodar o migracao3.sql (usuarios.foto_loja).');
    else console.log('MySQL conectado.');
  } catch (e) {
    console.log('ERRO ao conectar no MySQL:', e.message, '— confira o .env (DB_USER / DB_PASSWORD / DB_NAME) e se o MySQL está ligado.');
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API iBuild rodando na porta ${PORT}`));