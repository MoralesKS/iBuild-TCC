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
    alert('Tela em construção, aguardando orçamento');
  }
  function chat() {
    alert('Tela em construção, aguardando orçamento');
  }

  return { home, detalheProdutos, mapa, contratar, carrinho, gerenciar, detalhesObra, perfil, chat };
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
export const produtos = [
  {
    id: 'prod-cimento-caue',
    nome: 'Cimento Caue',
    tipo: 'Cimento e Argamassa',
    imagem: require('../assets/produtos/cimento.jpg'),
    preco: 'R$ 8,99',
    avaliacao: '4,6',
    numAvaliacoes: '98',
    vendedor: 'Loja 12',
    local: 'São Paulo, SP',
    descricao: 'Cimento de alta resistência, ideal para estruturas e alvenaria.',
    especificacoes: {
      material: 'Cimento Portland',
      cor: 'Cinza',
      dimensoes: 'Saco de 50kg',
      quantidade: '1 unidade',
    },
  },
  {
    id: 'prod-tijolo-ceramico',
    nome: 'Tijolo Cerâmico',
    tipo: 'Tijolos e Blocos',
    imagem: require('../assets/produtos/tijolo.jpg'),
    preco: 'R$ 1,20',
    avaliacao: '4,8',
    numAvaliacoes: '126',
    vendedor: 'Loja 67',
    local: 'Osasco, SP',
    descricao: 'Tijolo cerâmico maciço, ótimo para vedação e alvenaria estrutural.',
    especificacoes: {
      material: 'Cerâmico',
      cor: 'Terracota',
      dimensoes: '9 x 14 x 19 cm',
      quantidade: '10 unidades',
    },
  },
  {
    id: 'prod-areia-fina',
    nome: 'Areia Fina',
    tipo: 'Areia e Agregados',
    imagem: require('../assets/produtos/areia.jpg'),
    preco: 'R$ 10,99',
    avaliacao: '4,5',
    numAvaliacoes: '54',
    vendedor: 'Loja 5',
    local: 'Campinas, SP',
    descricao: 'Areia fina lavada, ideal para reboco e acabamentos.',
    especificacoes: {
      material: 'Areia lavada',
      cor: 'Bege claro',
      dimensoes: 'Saco de 20kg',
      quantidade: '1 unidade',
    },
  },
  {
    id: 'prod-vergalhao',
    nome: 'Vergalhão',
    tipo: 'Ferro e Aço',
    imagem: require('../assets/produtos/vergalhao.jpg'),
    preco: 'R$ 24,50',
    avaliacao: '4,9',
    numAvaliacoes: '31',
    vendedor: 'Loja 30',
    local: 'Guarulhos, SP',
    descricao: 'Vergalhão de aço CA-50, essencial para estruturas de concreto armado.',
    especificacoes: {
      material: 'Aço CA-50',
      cor: 'Metálico',
      dimensoes: '12mm x 12m',
      quantidade: '1 unidade',
    },
  },
];


{/*Mapa*/}
export const lojas = [
  { id: 1, nome: 'Loja 1', latitude: -23.549, longitude: -46.629, avaliacao: '4,6', numAvaliacoes: '210', endereco: 'Rua A, 100 - São Paulo, SP', distancia: '3,2', imagem: require('../assets/loja.jpg')},
  { id: 2, nome: 'Loja 2', latitude: -23.552, longitude: -46.637, avaliacao: '4,7', numAvaliacoes: '150', endereco: 'Rua B, 250 - São Paulo, SP', distancia: '4,8', imagem: require('../assets/loja2.jpg')},
  { id: 3, nome: 'Loja 3', latitude: -23.5545, longitude: -46.633, avaliacao: '4,5', numAvaliacoes: '92', endereco: 'Av. C, 500 - São Paulo, SP', distancia: '5,1', imagem: require('../assets/loja.jpg')},
  { id: 4, nome: 'Loja 4', latitude: -23.5495, longitude: -46.638, avaliacao: '4,4', numAvaliacoes: '61', endereco: 'Rua D, 80 - São Paulo, SP', distancia: '5,9', imagem: require('../assets/loja2.jpg')},
  { id: 5, nome: 'Loja 5', latitude: -23.548, longitude: -46.6315, avaliacao: '4,9', numAvaliacoes: '304', endereco: 'Rua E, 320 - São Paulo, SP', distancia: '2,4', imagem: require('../assets/loja.jpg')},
  { id: 67, nome: 'Loja 67', latitude: -23.551, longitude: -46.6295, avaliacao: '4,8', numAvaliacoes: '500', endereco: 'Rua D. Pedro, 67 - Osasco, SP', distancia: '6,7', imagem: require('../assets/loja2.jpg')},
];
export function abrirNoGoogleMaps(loja) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${loja.latitude},${loja.longitude}`;
  Linking.openURL(url);
}


{/*Gerenciamento e DetelhesObra*/}
export let totalObras = 2;
export let obrasAndamento = 0;
export let obrasconcluidas = 0;
export let funcionarios = 0;
export let fundacao = 100;
export let estrutura = 70;
export let acabamento = 45;
export let porcentagemTotal = (fundacao + estrutura + acabamento) / 3;

// Dados usados nas telas Gerenciar e DetalhesObra.
// Cada obra tem um "id" único — é ele que usamos pra saber
// QUAL obra foi clicada no "Ver detalhes".
export const obras = [
  {
    id: 'obra-residencial-aurora',
    nome: 'Residencial Aurora',
    construtora: 'Construtora Horizonte Ltda.',
    imagem: require('../assets/Home.png'),
    status: 'andamento', // 'andamento' ou 'concluida'
    endereco: 'Rua das Acacias, 245',
    tipo: 'Residencial',
    responsavel: 'Eng. Carlos Mendes',
    orcamento: 'R$ 2.400.000',
    entrega: '18/08/26',
    etapas: {
      fundacao: 100,
      estrutura: 70,
      acabamento: 45,
    },
    equipe: {
      mestre: 'João Neves',
      funcionariosAtivos: 34,
      horasTrabalhadas: '192h',
      proximaAcao: '14h00',
    },
    proximasAcoes: [
      { id: 1, texto: 'Instalação elétrica do bloco A', feito: false },
      { id: 2, texto: 'Instalação elétrica do bloco B', feito: false },
      { id: 3, texto: 'Instalação elétrica do bloco C', feito: false },
    ],
  },
  {
    id: 'obra-centro-comercial',
    nome: 'Centro Comercial',
    construtora: 'Construtora Urbanis',
    imagem: require('../assets/empresas.png'),
    status: 'andamento',
    endereco: 'Av. Industrial, 900',
    tipo: 'Comercial',
    responsavel: 'Eng. Marina Alves',
    orcamento: 'R$ 5.100.000',
    entrega: '12/11/26',
    etapas: {
      fundacao: 100,
      estrutura: 55,
      acabamento: 10,
    },
    equipe: {
      mestre: 'Pedro Lima',
      funcionariosAtivos: 47,
      horasTrabalhadas: '210h',
      proximaAcao: '09h30',
    },
    proximasAcoes: [
      { id: 1, texto: 'Instalação de vidraças', feito: false },
      { id: 2, texto: 'Pintura externa', feito: false },
    ],
  },
];
// Calcula a % geral de uma obra a partir das 3 etapas — assim o número
// nunca fica "desencontrado" do que está de fato preenchido em etapas.
export function calcularProgresso(obra) {
  const { fundacao, estrutura, acabamento } = obra.etapas;
  return Math.round((fundacao + estrutura + acabamento) / 3);
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
 
export const profissionais = [
  {
    id: 'prof-carlos-mendes',
    nome: 'Carlos Mendes',
    categoria: 'Pedreiro',
    imagem: require('../assets/Perfil.png'),
    avaliacao: '4.7',
    numAvaliacoes: '23',
    cidade: 'São Paulo, SP',
    experiencia: '8 anos de experiência',
  },
  {
    id: 'prof-helena-hills',
    nome: 'Helena Hills',
    categoria: 'Pintor',
    imagem: require('../assets/Perfil.png'),
    avaliacao: '4.7',
    numAvaliacoes: '23',
    cidade: 'São Paulo, SP',
    experiencia: '8 anos de experiência',
  },
  {
    id: 'prof-nebul-anomad',
    nome: 'Nebul Anomad',
    categoria: 'Carpinteiro',
    imagem: require('../assets/Perfil.png'),
    avaliacao: '4.6',
    numAvaliacoes: '18',
    cidade: 'São Paulo, SP',
    experiencia: '6 anos de experiência',
  },
  {
    id: 'prof-luna-voyager',
    nome: 'Luna Voyager',
    categoria: 'Eletricista',
    imagem: require('../assets/Perfil.png'),
    avaliacao: '4.9',
    numAvaliacoes: '31',
    cidade: 'São Paulo, SP',
    experiencia: '10 anos de experiência',
  },
];
