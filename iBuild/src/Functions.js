import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

export function useAppNavigation() {
  const navigation = useNavigation();

  function home() {
    navigation.navigate('Home');
  }
  function detalheProdutos() {
    navigation.navigate('Produto');
  }
  function mapa() {
    navigation.navigate('Mapa');
  }
  function contratar() {
    navigation.navigate('Contratar');
  }
  function carrinho() {
    navigation.navigate('Carrinho');
  }
  function gerenciar() {
    navigation.navigate('Gerenciar');
  }
  function detalhesObra() {
    navigation.navigate('DetalhesObra');
  }
  function perfil() { 
    navigation.navigate('Perfil'); 
  }
  function anunciar() { 
    navigation.navigate('Anunciar'); 
  }
  function chat() {
    navigation.navigate('Chat 1');
  }

  return { home, detalheProdutos, mapa, contratar, carrinho, gerenciar, detalhesObra, perfil, anunciar, chat };
}

{/*Home % Carrinho*/}
export const categorias = [
  { id: 'cat-tijolo', nome: 'Tijolo', imagem: require('../assets/produtos/tijolo.jpg') },
  { id: 'cat-cimento', nome: 'Cimento', imagem: require('../assets/produtos/cimento.jpg') },
  { id: 'cat-areia', nome: 'Areia', imagem: require('../assets/produtos/areia.jpg') },
  { id: 'cat-madeira', nome: 'Madeira', imagem: require('../assets/produtos/madeira.jpg') },
  { id: 'cat-telha', nome: 'Telha', imagem: require('../assets/produtos/telha.jpg') },
  { id: 'cat-ferro', nome: 'Ferro', imagem: require('../assets/produtos/vergalhao.jpg') },
];



{/*Mapa*/}

export function abrirNoGoogleMaps(loja) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${loja.latitude},${loja.longitude}`;
  Linking.openURL(url);
}


{/*Gerenciamento e DetelhesObra*/}
// Calcula a % geral de uma obra a partir das 3 etapas — assim o número
// nunca fica "desencontrado" do que está de fato preenchido em etapas.
export function calcularProgresso(obra) {
  const etapas = obra.etapas || {};
  const total = [etapas.fundacao, etapas.estrutura, etapas.acabamento]
    .reduce((soma, valor) => soma + Math.min(100, Math.max(0, Number(valor) || 0)), 0);
  return Math.round(total / 3);
}


{/*Contratar*/}
// Dados usados na tela Contratar.
// "categoria: null" no primeiro item representa o filtro "Todos" —
// null significa "não filtrar por categoria nenhuma".
export const categoriasProfissionais = [
  { label: 'Todos', categoria: null },
  { label: 'Eletricistas', categoria: 'Eletricista' },
  { label: 'Pedreiros', categoria: 'Pedreiro' },
  { label: 'Pintores', categoria: 'Pintor' },
  { label: 'Carpinteiros', categoria: 'Carpinteiro' },
];
