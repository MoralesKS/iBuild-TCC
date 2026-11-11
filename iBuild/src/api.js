import { createElement, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase.config';

/* ================================================================== */
/* CONFIGURAÇÃO                                                        */
/* Coloque o IP do seu PC no .env:  EXPO_PUBLIC_API_URL=http://192.168.X.X:3000 */
/* ================================================================== */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.85:3000').trim().replace(/\/+$/, '');
console.log('API_URL =', API_URL);

// true  = mostra os dados de exemplo (Functions.js) junto com os do banco
// false = mostra só o que está no banco
export const MOSTRAR_EXEMPLOS = true;

/* ------------------------------------------------------------------ */
/* Chamada HTTP                                                        */
/* ------------------------------------------------------------------ */
async function req(metodo, caminho, corpo) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), 10000);
  try {
    const resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      const erro = new Error(dados.erro || `Erro ${resposta.status}`);
      erro.status = resposta.status;
      throw erro;
    }
    return dados;
  }  catch (e) {
    if (e.status) throw e; // erro vindo da própria API (400, 404, 409...)
    // qualquer outra falha (timeout, cancelado, sem rede) = o celular não alcançou a API
    throw new Error(`Não consegui falar com a API (${API_URL}). Confira se ela está ligada no PC, se o IP está certo e se o celular está no mesmo Wi-Fi.`);
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Conversores: transformam o que vem da API no formato que as telas   */
/* já usam (o mesmo dos arrays de exemplo do Functions.js)             */
/* ------------------------------------------------------------------ */
const dinheiro = (n) => 'R$ ' + Number(n || 0).toFixed(2).replace('.', ',');

const IMG_PERFIL = require('../assets/Perfil.png');
const IMG_OBRA = require('../assets/gerenciar.png');

// imagem guardada na API (o cabeçalho evita a página de aviso do ngrok)
const imagemDoServidor = (url) => ({ uri: API_URL + url, headers: { 'ngrok-skip-browser-warning': 'true' } });
const urlFoto = (f) => (f ? imagemDoServidor(f.url) : null);

const produtoApp = (a) => ({
  id: 'db-' + a.id,
  idAnuncio: a.id,
  nome: a.nome,
  tipo: a.tipo,
  vendedor: a.vendedor,
  idVendedor: a.idVendedor,
  localizacao: a.localizacao || '',
  local: a.localizacao || 'Local não informado',
  contato: a.contato || '',
  descricao: a.descricao || 'Sem descrição.',
  preco: dinheiro(a.preco),
  precoNumero: a.preco,
  quantidade: a.quantidade,
  unidade: a.unidade,
  estado: a.estado,
  disponibilidade: a.disponibilidade,
  imagem: urlFoto(a.capa),                                            // foto da capa
  fotos: (a.fotos || []).map((f) => ({ id: f.id, imagem: urlFoto(f) })), // fotos extras
  avaliacao: 0,
  numAvaliacoes: 0,
  especificacoes: { material: a.tipo, cor: '—', dimensoes: '—', quantidade: `${a.quantidade} ${a.unidade || 'un.'}` },
});

const lojaApp = (l) => ({ ...l, id: 'db-' + l.id, imagem: l.foto ? imagemDoServidor(l.foto) : null });

const profissionalApp = (p) => ({
  id: 'db-' + p.id,
  idProfissional: p.id,
  idUsuario: p.idUsuario,
  nome: p.nome,
  categoria: p.categoria,
  avaliacao: p.avaliacao,
  cidade: p.cidade,
  experiencia: p.experiencia,
  imagem: IMG_PERFIL,
});

const obraApp = (o) => ({
  ...o,
  doBanco: true,
  idProprietario: o.idProprietario,
  logradouro: o.logradouro || o.endereco,
  imagem: IMG_OBRA,
  orcamentoNumero: Number(o.orcamento || 0),
  orcamento: dinheiro(o.orcamento),
  equipe: { ...o.equipe, horasTrabalhadas: `${o.equipe.horasTrabalhadas}h` },
});

const ROTULO_PERFIL = { pessoa_fisica: 'Cliente', autonomo: 'Autônomo', loja: 'Loja' };
const usuarioApp = (u) => ({
  ...u,
  profissao: u.profissao || ROTULO_PERFIL[u.tipoPerfil],
  temFoto: !!u.foto,
  fotoLoja: u.fotoLoja ? imagemDoServidor(u.fotoLoja) : null,
  foto: u.foto ? imagemDoServidor(u.foto) : IMG_PERFIL,
});

const notificacaoApp = (n) => ({
  ...n,
  quando: n.data ? `${n.data.slice(8, 10)}/${n.data.slice(5, 7)} ${n.data.slice(11, 16)}` : '',
});

/* ------------------------------------------------------------------ */
/* Funções que as telas chamam                                         */
/* ------------------------------------------------------------------ */
export const api = {
  ping: () => req('GET', '/'),
  usuarioPorUid: (uid) => req('GET', `/usuarios/firebase/${uid}`).then(usuarioApp),
  criarUsuario: (dados) => req('POST', '/usuarios', dados).then(usuarioApp),
  usuario: (id) => req('GET', `/usuarios/${id}`).then(usuarioApp),
  atualizarUsuario: (id, dados) => req('PATCH', `/usuarios/${id}`, dados).then(usuarioApp),
  enviarFotoLoja: (id, base64, ext) => req('PUT', `/usuarios/${id}/foto-loja`, { base64, ext }).then(usuarioApp),
  enviarFoto: (id, base64, ext) => req('PUT', `/usuarios/${id}/foto`, { base64, ext }).then(usuarioApp),

  produtos: (vendedor) => req('GET', '/anuncios' + (vendedor ? `?vendedor=${vendedor}` : '')).then((l) => l.map(produtoApp)),
  produto: (id) => req('GET', `/anuncios/${id}`).then(produtoApp),
  anunciar: (dados) => req('POST', '/anuncios', dados),
  atualizarAnuncio: (id, dados) => req('PATCH', `/anuncios/${id}`, dados).then(produtoApp),
  excluirAnuncio: (id, usuario) => req('DELETE', `/anuncios/${id}`, { id_usuario: usuario }),
  fazerPedido: (idComprador, itens) => req('POST', '/pedidos', { id_comprador: idComprador, itens }),

  lojas: () => req('GET', '/lojas').then((l) => l.map(lojaApp)),
  profissionais: () => req('GET', '/profissionais').then((l) => l.map(profissionalApp)),

  obras: (usuario) => req('GET', `/obras?usuario=${usuario}`).then((l) => l.map(obraApp)),
  obrasParticipando: (usuario) => req('GET', `/obras/participando?usuario=${usuario}`).then((l) => l.map(obraApp)),
  obra: (id, usuario) => req('GET', `/obras/${id}?usuario=${usuario || ''}`).then(obraApp),
  criarObra: (dados) => req('POST', '/obras', dados),
  atualizarObra: (id, dados) => req('PATCH', `/obras/${id}`, dados).then(obraApp),
  excluirObra: (id, usuario) => req('DELETE', `/obras/${id}?usuario=${usuario}`),
  criarObrasExemplo: (usuario) => req('POST', `/obras/exemplo/${usuario}`),
  marcarTarefa: (id, feito, usuario) => req('PATCH', `/tarefas/${id}`, { feito, id_usuario: usuario }),
  novaTarefa: (idObra, texto, usuario) => req('POST', `/obras/${idObra}/tarefas`, { texto, id_usuario: usuario }),
  adicionarProfissional: (idObra, idProfissional, funcao, usuario) =>
    req('POST', `/obras/${idObra}/profissionais`, { id_profissional: idProfissional, funcao, id_usuario: usuario }).then(obraApp),

  removerProfissional: (idObra, idProfissional, usuario) =>
    req('DELETE', `/obras/${idObra}/profissionais/${idProfissional}`, { id_usuario: usuario }).then(obraApp),

  notificacoes: (usuario) => req('GET', `/notificacoes?usuario=${usuario}`).then((l) => l.map(notificacaoApp)),
  lerNotificacoes: (usuario) => req('POST', '/notificacoes/lidas', { usuario }),
};

/* ------------------------------------------------------------------ */
/* Cadastro: cria a conta no Firebase (login) e o perfil no banco      */
/* ------------------------------------------------------------------ */
let cadastroEmAndamento = false;

// Traduz os erros do Firebase para português
export function traduzirErroFirebase(e) {
  const codigo = e && e.code;
  if (codigo === 'auth/email-already-in-use') return 'Este e-mail já tem conta. Use "Entrar". (Se o cadastro deu erro antes, entre com este e-mail: o perfil é criado automaticamente.)';
  if (codigo === 'auth/invalid-email') return 'E-mail inválido.';
  if (codigo === 'auth/weak-password') return 'A senha precisa ter pelo menos 6 caracteres.';
  if (codigo === 'auth/invalid-credential' || codigo === 'auth/wrong-password' || codigo === 'auth/user-not-found') return 'E-mail ou senha incorretos.';
  if (codigo === 'auth/network-request-failed') return 'Sem internet. Confira a conexão do celular.';
  if (codigo === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
  return (e && e.message) || 'Erro desconhecido.';
}

export async function cadastrarUsuario(email, senha, dados, recarregarUsuario) {
  // 1) confere se a API responde ANTES de criar a conta (evita conta "pela metade")
  await api.ping();

  cadastroEmAndamento = true;
  try {
    let credencial;
    try {
      credencial = await createUserWithEmailAndPassword(auth, email, senha);
    } catch (e) {
      throw new Error(traduzirErroFirebase(e));
    }
    try {
      await api.criarUsuario({ ...dados, email, firebase_uid: credencial.user.uid });
    } catch (e) {
      // 2) se o banco falhar, desfaz a conta do Firebase para você poder tentar de novo
      try { await credencial.user.delete(); } catch (_) {}
      throw new Error('Não consegui salvar o perfil no banco, então a conta não foi criada. Tente de novo. (' + e.message + ')');
    }
    await recarregarUsuario();
  } finally {
    cadastroEmAndamento = false;
  }
}

/* ------------------------------------------------------------------ */
/* Logout                                                              */
/* ------------------------------------------------------------------ */
export const sair = () => signOut(auth);

/* ------------------------------------------------------------------ */
/* Usuário logado (perfil do banco) disponível em qualquer tela        */
/* ------------------------------------------------------------------ */
const UsuarioContext = createContext({ usuario: null, carregando: true, recarregarUsuario: async () => null });
export const useUsuario = () => useContext(UsuarioContext);

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async (usuarioFirebase) => {
    if (!usuarioFirebase) {
      setUsuario(null);
      setCarregando(false);
      return null;
    }
    try {
      let u;
      try {
        u = await api.usuarioPorUid(usuarioFirebase.uid);
      } catch (e) {
        if (e.status !== 404) throw e;
        if (cadastroEmAndamento) return null; // o cadastro vai criar o perfil e recarregar
        // conta antiga do Firebase sem perfil no banco: cria um perfil básico
        u = await api.criarUsuario({
          firebase_uid: usuarioFirebase.uid,
          email: usuarioFirebase.email,
          nome: (usuarioFirebase.email || 'usuario').split('@')[0],
          tipo_perfil: 'pessoa_fisica',
        });
      }
      setUsuario(u);
      return u;
    } catch (e) {
      console.log('Erro ao carregar usuário:', e.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => onAuthStateChanged(auth, (fb) => { setCarregando(true); carregar(fb); }), [carregar]);

  const recarregarUsuario = useCallback(() => carregar(auth.currentUser), [carregar]);

  return createElement(UsuarioContext.Provider, { value: { usuario, carregando, recarregarUsuario } }, children);
}

/* ------------------------------------------------------------------ */
/* Localização                                                         */
/* ------------------------------------------------------------------ */
// Endereço (texto) -> coordenadas. Se não achar, usa o GPS do celular.
// fallbackGps: se não achar o endereço, usa o GPS do celular (use false para só aceitar o endereço digitado)
export async function coordenadasDoEndereco(texto, { fallbackGps = true } = {}) {
  try {
    const r = await Location.geocodeAsync(texto);
    if (r.length) return { latitude: r[0].latitude, longitude: r[0].longitude, aproximada: false };
  } catch (e) {}
  if (!fallbackGps) return null;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const p = await Location.getCurrentPositionAsync({});
      return { latitude: p.coords.latitude, longitude: p.coords.longitude, aproximada: true };
    }
  } catch (e) {}
  return null;
}

// Distância em km entre dois pontos {latitude, longitude}
export function distanciaKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/* ------------------------------------------------------------------ */
/* Telefone                                                            */
/* ------------------------------------------------------------------ */
export function formatarTelefone(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export function telefoneValido(texto) {
  const n = texto.replace(/\D/g, '');
  if (n.length !== 11) return false;
  const ddd = Number(n.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (n[2] !== '9') return false;
  if (/^(\d)\1+$/.test(n)) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Fotos: abre a galeria e devolve [{ uri, base64, ext }]              */
/* ------------------------------------------------------------------ */
export async function escolherImagens({ multiplo = false, limite = 1, aspecto = [4, 3] } = {}) {
  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: multiplo,
    selectionLimit: limite,
    allowsEditing: !multiplo,   // só a foto única (capa) pode ser recortada
    aspect: aspecto,
    quality: 0.5,
    base64: true,
  });
  if (r.canceled) return [];
  return r.assets.map((a) => ({
    uri: a.uri,
    base64: a.base64,
    ext: (a.uri.split('?')[0].split('.').pop() || 'jpg').toLowerCase(),
  }));
}

/* ------------------------------------------------------------------ */
/* Anúncio: confere o formulário ANTES de enviar. Devolve a lista de   */
/* problemas; lista vazia = pode publicar.                             */
/* ------------------------------------------------------------------ */
export function validarAnuncio(f) {
  const erros = [];

  const nome = f.nome.trim();
  if (nome.length < 3 || !/[A-Za-zÀ-ÿ]/.test(nome)) erros.push('• Nome do produto inválido (mínimo 3 caracteres, com letras).');
  if (!f.categoria) erros.push('• Escolha uma categoria.');

  const preco = f.preco.trim().replace(/\s/g, '');
  if (preco === '') erros.push('• Informe o preço.');
  else if (preco.startsWith('-')) erros.push('• O preço não pode ser negativo.');
  else if (!/^\d+([.,]\d{1,2})?$/.test(preco)) erros.push('• Preço inválido. Use só números e vírgula para os centavos (ex.: 12,50).');
  else {
    const valor = Number(preco.replace(',', '.'));
    if (valor === 0) erros.push('• O preço deve ser maior que zero.');
    else if (valor > 99999999.99) erros.push('• O preço é alto demais.');
  }

  const qtd = f.quantidade.trim();
  if (qtd === '') erros.push('• Informe a quantidade.');
  else if (qtd.startsWith('-')) erros.push('• A quantidade não pode ser negativa.');
  else if (/[.,]/.test(qtd)) erros.push('• A quantidade deve ser um número inteiro (sem vírgula nem ponto).');
  else if (!/^\d+$/.test(qtd)) erros.push('• Quantidade inválida. Use só números.');
  else if (Number(qtd) < 1) erros.push('• A quantidade deve ser pelo menos 1.');
  else if (Number(qtd) > 99999999) erros.push('• A quantidade é alta demais.');

  if (!f.unidade) erros.push('• Escolha a unidade.');

  const local = f.localizacao.trim();
  if (local.length < 3 || !/[A-Za-zÀ-ÿ]/.test(local)) erros.push('• Informe a localização do produto (cidade ou endereço).');
  if (!telefoneValido(f.contato)) erros.push('• Informe um celular de contato válido, com DDD.');
  if (!f.temCapa) erros.push('• Adicione a foto da capa.');
  return erros;
}

// "12,50" -> 12.5   (use só depois de validarAnuncio)
export const paraNumero = (texto) => Number(texto.trim().replace(',', '.'));

/* ------------------------------------------------------------------ */
/* Versão da API: avisa se o server.js do PC está desatualizado        */
/* ------------------------------------------------------------------ */
export const VERSAO_API_MINIMA = 3;

export async function conferirApi() {
  const info = await api.ping();
  if (!info || (info.versao || 0) < VERSAO_API_MINIMA) {
    throw new Error('A API do PC está desatualizada (sem as novidades de fotos/loja). Substitua o server.js da pasta ibuild-api pelo novo e reinicie com npm start.');
  }
}
