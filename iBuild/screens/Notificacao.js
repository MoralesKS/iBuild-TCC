import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Notificacoes() {
  const navigation = useNavigation();

  function home(){
    navigation.navigate('Home');
  }
  function mapa(){
    navigation.navigate('Mapa');
  }
  function contratar(){
    navigation.navigate('Contratar');
  }
  function carrinho(){
    navigation.navigate('Carrinho');
  }
  function gerenciar(){
    navigation.navigate('Gerenciar');
  }
  function perfil(){
    alert('Tela em construção, aguardando orçamento');
  }
  function chat(){
    alert('Tela em construção, aguardando orçamento');
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Notificações</Text>
      <Text style={styles.subtitulo}>Acompanhe compras, recibos e atualizações de obra</Text>

      <TextInput style={styles.searchInput} placeholder="Buscar" />

      <View style={styles.linhaFiltros}>
        <Text style={styles.filtroAtivo}>Todas</Text>
        <Text style={styles.filtro}>Compras</Text>
        <Text style={styles.filtro}>Recibos</Text>
        <Text style={styles.filtro}>Obra</Text>
      </View>

      <Text style={styles.grupoTitulo}>Hoje</Text>
      <ScrollView>
        <View style={styles.notificacaoCard}>
          <Text style={styles.notificacaoTitulo}>Compra confirmada</Text>
          <Text style={styles.notificacaoDescricao}>Sua compra de cimento foi confirmada</Text>
        </View>
        <View style={styles.notificacaoCard}>
          <Text style={styles.notificacaoTitulo}>Recibo disponível</Text>
          <Text style={styles.notificacaoDescricao}>O recibo da sua compra já está disponível</Text>
        </View>
        <View style={styles.notificacaoCard}>
          <Text style={styles.notificacaoTitulo}>Material entregue</Text>
          <Text style={styles.notificacaoDescricao}>O material foi entregue na obra Residencial Aurora</Text>
        </View>
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone1} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone} source={require('../assets/gerenciar.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={mapa}>
          <Image style={styles.footerIcone} source={require('../assets/Bussola.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={contratar}>
          <Image style={styles.footerIcone} source={require('../assets/Trabalho.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={chat}>
          <Image style={styles.footerIcone} source={require('../assets/Chat.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={perfil}>
          <Image style={styles.footerIcone} source={require('../assets/Perfil.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  linhaFiltros: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  filtroAtivo: {
    color: '#F57C00',
    fontWeight: 'bold',
    marginRight: 16,
  },
  filtro: {
    color: '#828282',
    marginRight: 16,
  },
  grupoTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  notificacaoCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificacaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
  },
  notificacaoDescricao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});