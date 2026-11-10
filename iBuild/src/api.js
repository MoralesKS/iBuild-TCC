import { createElement, createContext, useContext, useEffect, useRef, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as Location from 'expo-location';
import { auth } from '../firebase.config';
import { VERSAO_DOCUMENTOS } from './documentosLegais';

/* ================================================================== */
/* CONFIGURAÇÃO                                                        */
/* Coloque o IP do seu PC no .env:  EXPO_PUBLIC_API_URL=http://192.168.X.X:3000 */
/* ================================================================== */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.85:3000';

// true  = mostra os dados de exemplo (Functions.js) junto com os do banco
// false = mostra só o que está no banco
export const MOSTRAR_EXEMPLOS = true;

/* ------------------------------------------------------------------ */
/* Chamada HTTP                                                        */
/* ------------------------------------------------------------------ */
async function req(metodo, caminho, corpo, token) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), 10000);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers,
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
  } catch (e) {
    if (e.name === 'AbortError' || e.message === 'Network request failed') {
      throw new Error('Não consegui falar com o servidor. Confira se a API está ligada no PC e se o celular está na mesma rede Wi-Fi.');
    }
    throw e;
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

const ROTULO_PERFIL = { pessoa_fisica: 'Pessoa física', autonomo: 'Autônomo', loja: 'Empresa' };
const usuarioApp = (u) => ({
  ...u,
  rotuloPerfil: ROTULO_PERFIL[u.tipoPerfil],
  foto: u.fotoUrl ? { uri: u.fotoUrl } : IMG_PERFIL,
});

const notificacaoApp = (n) => ({
  ...n,
  quando: n.data ? `${n.data.slice(8, 10)}/${n.data.slice(5, 7)} ${n.data.slice(11, 16)}` : '',
});

/* ------------------------------------------------------------------ */
/* Funções que as telas chamam                                         */
/* ------------------------------------------------------------------ */
export const api = {
  usuarioAtual: (token) => req('GET', '/usuarios/me', undefined, token).then(usuarioApp),
  criarUsuario: (token, dados = {}) => req('POST', '/usuarios', dados, token).then(usuarioApp),
  usuario: (id) => req('GET', `/usuarios/${id}`).then(usuarioApp),

  produtos: (vendedor) => req('GET', '/anuncios' + (vendedor ? `?vendedor=${vendedor}` : '')).then((l) => l.map(produtoApp)),
  anunciar: (dados) => req('POST', '/anuncios', dados),
  fazerPedido: (idComprador, itens) => req('POST', '/pedidos', { id_comprador: idComprador, itens }),

  lojas: () => req('GET', '/lojas').then((l) => l.map(lojaApp)),
  profissionais: () => req('GET', '/profissionais').then((l) => l.map(profissionalApp)),

  obras: (usuario) => req('GET', `/obras?usuario=${usuario}`).then((l) => l.map(obraApp)),
  obra: (id) => req('GET', `/obras/${id}`).then(obraApp),
  criarObrasExemplo: (usuario) => req('POST', `/obras/exemplo/${usuario}`),
  marcarTarefa: (id, feito) => req('PATCH', `/tarefas/${id}`, { feito }),
  novaTarefa: (idObra, texto) => req('POST', `/obras/${idObra}/tarefas`, { texto }),
  adicionarProfissional: (idObra, idProfissional, funcao) =>
    req('POST', `/obras/${idObra}/profissionais`, { id_profissional: idProfissional, funcao }).then(obraApp),

  notificacoes: (usuario) => req('GET', `/notificacoes?usuario=${usuario}`).then((l) => l.map(notificacaoApp)),
  lerNotificacoes: (usuario) => req('POST', '/notificacoes/lidas', { usuario }),
};

/* ------------------------------------------------------------------ */
/* Usuário logado (perfil do banco) disponível em qualquer tela        */
/* ------------------------------------------------------------------ */
const UsuarioContext = createContext(null);
export const useUsuario = () => useContext(UsuarioContext);

export function UsuarioProvider({ children }) {
  const [usuarioFirebase, setUsuarioFirebase] = useState(undefined);
  const [perfil, setPerfil] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const cadastrando = useRef(false);

  useEffect(() => onAuthStateChanged(auth, (usuario) => {
    // O Firebase abre uma sessão ao criar a conta. O cadastro usa essa sessão só para salvar o perfil.
    if (!usuario || !cadastrando.current) setUsuarioFirebase(usuario);
  }), []);

  useEffect(() => {
    setPerfil(null);
    if (!usuarioFirebase) return;

    let ativo = true;
    async function carregarPerfil() {
      try {
        const token = await usuarioFirebase.getIdToken();
        let dados;
        try {
          dados = await api.usuarioAtual(token);
        } catch (erro) {
          if (erro.status !== 404 || !ativo || auth.currentUser?.uid !== usuarioFirebase.uid) throw erro;
          // Contas criadas antes do MySQL precisam de um perfil básico para usar as demais telas.
          dados = await api.criarUsuario(token);
        }
        if (ativo) setPerfil({ uid: usuarioFirebase.uid, dados });
      } catch (erro) {
        if (ativo) setPerfil({ uid: usuarioFirebase.uid, erro: erro.message });
      }
    }
    carregarPerfil();
    return () => { ativo = false; };
  }, [usuarioFirebase, tentativa]);

  async function cadastrarUsuario(email, senha, dados, aceitouDocumentos) {
    if (!aceitouDocumentos) throw new Error('Confirme a leitura da Política de Privacidade e aceite os Termos de Serviço.');
    if (cadastrando.current) throw new Error('O cadastro já está em andamento.');

    cadastrando.current = true;
    let conta;
    try {
      try {
        ({ user: conta } = await createUserWithEmailAndPassword(auth, email, senha));
      } catch (erro) {
        if (erro.code !== 'auth/email-already-in-use') throw erro;
        // Permite repetir um cadastro cujo perfil ainda não foi salvo.
        try {
          ({ user: conta } = await signInWithEmailAndPassword(auth, email, senha));
        } catch (erroLogin) {
          if (['auth/invalid-credential', 'auth/wrong-password'].includes(erroLogin.code)) {
            throw new Error('Este e-mail já está em uso.');
          }
          throw erroLogin;
        }
      }
      await api.criarUsuario(await conta.getIdToken(), { ...dados, versao_documentos: VERSAO_DOCUMENTOS });
    } finally {
      try {
        if (conta && auth.currentUser?.uid === conta.uid) await signOut(auth);
      } finally {
        cadastrando.current = false;
      }
    }
  }

  const perfilAtual = perfil?.uid === usuarioFirebase?.uid ? perfil : null;
  return createElement(UsuarioContext.Provider, {
    value: {
      usuarioFirebase,
      usuario: perfilAtual?.dados ?? null,
      carregando: Boolean(usuarioFirebase && !perfilAtual),
      erroPerfil: perfilAtual?.erro,
      recarregarUsuario: () => setTentativa((atual) => atual + 1),
      cadastrarUsuario,
    },
  }, children);
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
