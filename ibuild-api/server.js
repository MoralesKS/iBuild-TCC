require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const firebaseAuth = getAuth(initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'ibuild-daf54',
}));

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
app.use(express.json());

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

app.get('/', (req, res) => res.json({ ok: true, api: 'iBuild' }));

/* ================================================================== */
/* USUÁRIOS                                                            */
/* ================================================================== */
const VERSAO_DOCUMENTOS = '1';
const TIPOS_PERFIL = ['pessoa_fisica', 'autonomo', 'loja'];

async function autenticarUsuario(req, res, next) {
  res.set('Cache-Control', 'no-store');
  const token = req.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return res.status(401).json({ erro: 'Entre na sua conta para continuar.' });

  try {
    req.conta = await firebaseAuth.verifyIdToken(token);
  } catch {
    return res.status(401).json({ erro: 'Não foi possível validar sua sessão. Entre novamente.' });
  }
  next();
}

async function carregarUsuario(campo, valor, privado = false) {
  // "campo" só recebe 'id_usuario' ou 'firebase_uid' (valores fixos do código)
  const [u] = await q(
    `SELECT u.id_usuario, u.firebase_uid, u.tipo_perfil, u.nome, u.razao_social, u.email, u.telefone, u.cidade, u.bio,
            u.cpf, u.cnpj, u.data_nascimento, u.foto_perfil, p.id_profissional, p.profissao,
            (SELECT COUNT(*) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS avaliacoes,
            (SELECT COALESCE(ROUND(AVG(a.nota), 1), 0) FROM avaliacoes a WHERE a.id_avaliado = u.id_usuario AND a.status = 'ativo') AS nota_media
       FROM usuarios u
       LEFT JOIN profissionais p ON p.id_usuario = u.id_usuario
      WHERE u.${campo} = ?`,
    [valor]
  );
  if (!u || (campo === 'firebase_uid' && u.firebase_uid !== valor)) return null;
  if (!privado && u.tipo_perfil === 'pessoa_fisica') return null;
  return {
    idUsuario: u.id_usuario,
    idProfissional: u.id_profissional || null,
    tipoPerfil: u.tipo_perfil,
    nome: u.tipo_perfil === 'loja' && u.razao_social ? u.razao_social : u.nome,
    profissao: u.profissao || null,
    cidade: u.cidade || '',
    bio: u.bio || '',
    fotoUrl: u.foto_perfil,
    avaliacoes: u.avaliacoes,
    notaMedia: u.nota_media,
    ...(privado && {
      email: u.email,
      telefone: u.telefone,
      cpf: u.cpf,
      cnpj: u.cnpj,
      dataNascimento: u.data_nascimento ? fmtData(u.data_nascimento) : null,
      nomeResponsavel: u.tipo_perfil === 'loja' ? u.nome : null,
    }),
  };
}

app.get('/usuarios/me', autenticarUsuario, h(async (req, res) => {
  const u = await carregarUsuario('firebase_uid', req.conta.uid, true);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(u);
}));

app.get('/usuarios/:id', h(async (req, res) => {
  const u = await carregarUsuario('id_usuario', req.params.id);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(u);
}));

app.post('/usuarios', autenticarUsuario, h(async (req, res) => {
  const b = req.body || {};
  const { uid, email, email_verified: emailVerificado, name } = req.conta;
  const cadastro = b.tipo_perfil !== undefined;
  const tipo = cadastro ? b.tipo_perfil : 'pessoa_fisica';
  const nome = cadastro ? (typeof b.nome === 'string' ? b.nome.trim() : '') : (name || email?.split('@')[0]);
  if (!email || !nome || !TIPOS_PERFIL.includes(tipo)) {
    return res.status(400).json({ erro: 'Informe um nome, e-mail e tipo de perfil válidos.' });
  }
  if (cadastro && b.versao_documentos !== VERSAO_DOCUMENTOS) {
    return res.status(400).json({ erro: 'Confirme a leitura dos documentos de cadastro.' });
  }

  const [existente] = await q(
    'SELECT id_usuario, firebase_uid FROM usuarios WHERE firebase_uid = ? OR email = ? ORDER BY firebase_uid = ? DESC LIMIT 1',
    [uid, email, uid]
  );
  if (existente) {
    if (cadastro) {
      return res.status(409).json({ erro: 'Já existe uma conta com este e-mail. Entre na sua conta.' });
    }
    if (existente.firebase_uid === uid) {
      return res.json(await carregarUsuario('firebase_uid', uid, true));
    }
    // Um perfil importado só pode ser vinculado por quem confirmou o e-mail no Firebase.
    if (existente.firebase_uid === null && emailVerificado) {
      await q('UPDATE usuarios SET firebase_uid = ? WHERE id_usuario = ? AND firebase_uid IS NULL', [uid, existente.id_usuario]);
      const vinculado = await carregarUsuario('firebase_uid', uid, true);
      if (vinculado) return res.json(vinculado);
    }
    return res.status(409).json({ erro: 'Não foi possível vincular este e-mail a um perfil.' });
  }

  const dados = cadastro ? b : {};
  const conn = await pool.getConnection();
  let id;
  let duplicado = false;
  try {
    await conn.beginTransaction();
    const [r] = await conn.query(
      `INSERT INTO usuarios (firebase_uid, tipo_perfil, nome, email, telefone, cpf, cnpj, razao_social, data_nascimento, cidade)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [uid, tipo, nome, email, dados.telefone || null, dados.cpf || null, dados.cnpj || null,
       dados.razao_social || null, dataBR(dados.data_nascimento), dados.cidade || dados.endereco?.cidade || null]
    );
    id = r.insertId;

    if (cadastro) {
      await q(
        'UPDATE usuarios SET versao_documentos = ?, aceite_documentos_em = CURRENT_TIMESTAMP WHERE id_usuario = ?',
        [VERSAO_DOCUMENTOS, id], conn
      );
    }

    if (tipo === 'autonomo') {
      const [p] = await conn.query('INSERT INTO profissionais (id_usuario, profissao, descricao) VALUES (?,?,?)', [id, b.profissao || null, b.profissao || null]);
      // acha a especialidade cujo nome aparece no texto digitado (ex.: "Pedreiro de obra" -> Pedreiro)
      let esp = await q(
        "SELECT id_especialidade FROM especialidades WHERE ? LIKE CONCAT('%', nome, '%') AND nome <> 'Outros' ORDER BY LENGTH(nome) DESC LIMIT 1",
        [b.profissao || ''], conn
      );
      if (!esp.length) esp = await q("SELECT id_especialidade FROM especialidades WHERE nome = 'Outros'", [], conn);
      if (esp.length) await conn.query('INSERT INTO profissional_especialidade (id_profissional, id_especialidade) VALUES (?,?)', [p.insertId, esp[0].id_especialidade]);
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
    if (e.code !== 'ER_DUP_ENTRY') throw e;
    duplicado = true;
  } finally {
    conn.release();
  }
  if (duplicado) {
    if (!cadastro) {
      const u = await carregarUsuario('firebase_uid', uid, true);
      if (u) return res.json(u);
    }
    return res.status(409).json({ erro: 'Já existe um perfil com os dados informados.' });
  }
  res.status(201).json(await carregarUsuario('id_usuario', id, true));
}));

/* ================================================================== */
/* ANÚNCIOS (produtos)                                                 */
/* ================================================================== */
app.post('/anuncios', h(async (req, res) => {
  const b = req.body;
  if (!b.id_vendedor || !b.titulo || b.preco == null) return res.status(400).json({ erro: 'Dados incompletos' });

  const nomeCat = (b.categoria || 'Outros').trim();
  await q('INSERT IGNORE INTO categorias_materiais (nome) VALUES (?)', [nomeCat]);
  const [cat] = await q('SELECT id_categoria FROM categorias_materiais WHERE nome = ?', [nomeCat]);

  const estado = { Novo: 'novo', Seminovo: 'bom', Usado: 'regular' }[b.estado] || 'bom';
  const quantidade = Number(b.quantidade) > 0 ? Number(b.quantidade) : 1;

  const [r] = await pool.query(
    `INSERT INTO anuncios (id_vendedor, id_categoria, titulo, descricao, quantidade, unidade, preco_unitario,
                           estado_material, disponibilidade, status_curadoria)
     VALUES (?,?,?,?,?,?,?,?,?, 'aprovado')`,
    [b.id_vendedor, cat.id_categoria, b.titulo, b.descricao || null, quantidade, b.unidade || null,
     Number(b.preco), estado, b.disponibilidade === 'Entregar' ? 'entrega' : 'retirada']
  );
  await notificar(pool, b.id_vendedor, 'sistema', 'Anúncio publicado', `Seu anúncio "${b.titulo}" já está no ar.`);
  res.status(201).json({ id: r.insertId });
}));

app.get('/anuncios', h(async (req, res) => {
  const where = ["a.status = 'ativo'", "a.status_curadoria = 'aprovado'"];
  const params = [];
  if (req.query.vendedor) { where.push('a.id_vendedor = ?'); params.push(req.query.vendedor); }
  const rows = await q(
    `SELECT a.id_anuncio, a.titulo, c.nome AS categoria, u.id_usuario AS id_vendedor,
            COALESCE(u.razao_social, u.nome) AS vendedor, u.cidade, a.descricao,
            a.preco_unitario, a.unidade, a.quantidade, a.estado_material, a.disponibilidade
       FROM anuncios a
       JOIN categorias_materiais c ON c.id_categoria = a.id_categoria
       JOIN usuarios u ON u.id_usuario = a.id_vendedor
      WHERE ${where.join(' AND ')}
      ORDER BY a.data_publicacao DESC, a.id_anuncio DESC`,
    params
  );
  res.json(rows.map((r) => ({
    id: r.id_anuncio, nome: r.titulo, tipo: r.categoria, idVendedor: r.id_vendedor, vendedor: r.vendedor,
    local: r.cidade || '', descricao: r.descricao || '', preco: r.preco_unitario, unidade: r.unidade,
    quantidade: r.quantidade, estado: r.estado_material, disponibilidade: r.disponibilidade,
  })));
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
    `SELECT u.id_usuario, COALESCE(u.razao_social, u.nome) AS nome, e.logradouro, e.numero, e.bairro, e.cidade,
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
    latitude: r.latitude, longitude: r.longitude, avaliacao: r.avaliacao, numAvaliacoes: r.num_avaliacoes,
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API iBuild rodando na porta ${PORT}`));
