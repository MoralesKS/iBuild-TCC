import { createElement, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { auth } from '../firebase.config';

/* ================================================================== */
/* CONFIGURAÇÃO                                                        */
/* Coloque o IP do seu PC no .env:  EXPO_PUBLIC_API_URL=http://192.168.X.X:3000 */
/* ================================================================== */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.85:3000';
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
      headers: { 'Content-Type': 'application/json' },
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

const produtoApp = (a) => ({
  id: 'db-' + a.id,
  idAnuncio: a.id,
  nome: a.nome,
  tipo: a.tipo,
  vendedor: a.vendedor,
  idVendedor: a.idVendedor,
  local: a.local || 'Local não informado',
  descricao: a.descricao || 'Sem descrição.',
  preco: dinheiro(a.preco),
  imagem: null,
  avaliacao: 0,
  numAvaliacoes: 0,
  especificacoes: { material: a.tipo, cor: '—', dimensoes: '—', quantidade: `${a.quantidade} ${a.unidade || 'un.'}` },
});

const lojaApp = (l) => ({ ...l, id: 'db-' + l.id, imagem: null });

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
  imagem: IMG_OBRA,
  orcamento: dinheiro(o.orcamento),
  equipe: { ...o.equipe, horasTrabalhadas: `${o.equipe.horasTrabalhadas}h` },
});

const ROTULO_PERFIL = { pessoa_fisica: 'Cliente', autonomo: 'Autônomo', loja: 'Loja' };
const usuarioApp = (u) => ({
  ...u,
  profissao: u.profissao || ROTULO_PERFIL[u.tipoPerfil],
  temFoto: !!u.foto,
  foto: u.foto ? { uri: API_URL + u.foto } : IMG_PERFIL,
});

const notificacaoApp = (n) => ({
  ...n,
  quando: n.data ? `${n.data.slice(8, 10)}/${n.data.slice(5, 7)} ${n.data.slice(11, 16)}` : '',
});

/* ------------------------------------------------------------------ */
/* Funções que as telas chamam                                         */
/* ------------------------------------------------------------------ */
export const api = {
  usuarioPorUid: (uid) => req('GET', `/usuarios/firebase/${uid}`).then(usuarioApp),
  criarUsuario: (dados) => req('POST', '/usuarios', dados).then(usuarioApp),
  usuario: (id) => req('GET', `/usuarios/${id}`).then(usuarioApp),
  atualizarUsuario: (id, dados) => req('PATCH', `/usuarios/${id}`, dados).then(usuarioApp),
  enviarFoto: (id, base64, ext) => req('PUT', `/usuarios/${id}/foto`, { base64, ext }).then(usuarioApp),

  produtos: (vendedor) => req('GET', '/anuncios' + (vendedor ? `?vendedor=${vendedor}` : '')).then((l) => l.map(produtoApp)),
  anunciar: (dados) => req('POST', '/anuncios', dados),
  fazerPedido: (idComprador, itens) => req('POST', '/pedidos', { id_comprador: idComprador, itens }),

  lojas: () => req('GET', '/lojas').then((l) => l.map(lojaApp)),
  profissionais: () => req('GET', '/profissionais').then((l) => l.map(profissionalApp)),

  obras: (usuario) => req('GET', `/obras?usuario=${usuario}`).then((l) => l.map(obraApp)),
  obra: (id) => req('GET', `/obras/${id}`).then(obraApp),
  criarObra: (dados) => req('POST', '/obras', dados),
  criarObrasExemplo: (usuario) => req('POST', `/obras/exemplo/${usuario}`),
  marcarTarefa: (id, feito) => req('PATCH', `/tarefas/${id}`, { feito }),
  novaTarefa: (idObra, texto) => req('POST', `/obras/${idObra}/tarefas`, { texto }),
  adicionarProfissional: (idObra, idProfissional, funcao) =>
    req('POST', `/obras/${idObra}/profissionais`, { id_profissional: idProfissional, funcao }).then(obraApp),

  removerProfissional: (idObra, idProfissional) =>
    req('DELETE', `/obras/${idObra}/profissionais/${idProfissional}`).then(obraApp),

  notificacoes: (usuario) => req('GET', `/notificacoes?usuario=${usuario}`).then((l) => l.map(notificacaoApp)),
  lerNotificacoes: (usuario) => req('POST', '/notificacoes/lidas', { usuario }),
};

/* ------------------------------------------------------------------ */
/* Cadastro: cria a conta no Firebase (login) e o perfil no banco      */
/* ------------------------------------------------------------------ */
let cadastroEmAndamento = false;

export async function cadastrarUsuario(email, senha, dados, recarregarUsuario) {
  cadastroEmAndamento = true;
  try {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha);
    try {
      await api.criarUsuario({ ...dados, email, firebase_uid: credencial.user.uid });
    } catch (e) {
      throw new Error('Conta criada, mas não consegui salvar o perfil no banco: ' + e.message);
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
export async function coordenadasDoEndereco(texto) {
  try {
    const r = await Location.geocodeAsync(texto);
    if (r.length) return { latitude: r[0].latitude, longitude: r[0].longitude, aproximada: false };
  } catch (e) {}
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