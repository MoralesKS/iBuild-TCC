import { useNavigation } from '@react-navigation/native';

export function useAppNavigation() {
  const navigation = useNavigation();

  function home() {
    navigation.navigate('Home');
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

  return { home, mapa, contratar, carrinho, gerenciar, detalhesObra, perfil, chat };
}

{/*Info Cadastro*/}
export let nome = '';
export let cpf = '';
export let dataNascimento = 0;
export let telefone = 0;
export let profissao = '';
export let cnpj = 0;

{/*Home*/}

{/*Carrinho*/}
export const itens = [
  { marca: 'Marca', nome: 'Areia Fina - Saco', preco: 'R$10,99', quantidade: '02', imagem: require('../assets/produtos/areia.jpg')},
  { marca: 'Marca', nome: 'Tijolo Cerâmico', preco: 'R$8,99', quantidade: '10', imagem: require('../assets/produtos/tijolo.jpg') },
  { marca: 'Marca', nome: 'Cimento Caue', preco: 'R$8,99', quantidade: '04', imagem: require('../assets/produtos/cimento.jpg') },
];

{/*Gerenciamento e DetelhesObra*/}
export let totalObras = 2;
export let obrasAndamento = 0;
export let obrasconcluidas = 0;
export let funcionarios = 0;
export let fundacao = 100;
export let estrutura = 70;
export let acabamento = 45;
export let porcentagemTotal = (fundacao + estrutura + acabamento) / 3;

export function gerenciamentoObras() {
  if (porcentagemTotal < 100){
    obrasAndamento++;
  } else if (porcentagemTotal >= 100){
    obrasAndamento--;
    obrasconcluidas++;
  }
}