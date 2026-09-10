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