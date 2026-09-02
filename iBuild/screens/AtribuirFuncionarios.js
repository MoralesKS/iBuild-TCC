import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Funcionarios() {
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

      <Text style={styles.titulo}>Contratar funcionários</Text>
      <Text style={styles.subtitulo}>Encontre profissionais para sua obra</Text>

      <TouchableOpacity style={styles.contratarBotao} onPress={contratar}>
        <Text style={styles.contratarTexto}>+ Contratar funcionários</Text>
      </TouchableOpacity>

      <Text style={styles.tituloSecao}>Funcionários na obra</Text>

      <ScrollView>
        <View style={[styles.card, styles.cardDestaque]}>
          <View style={styles.avatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.nome}>Helena Hills</Text>
            <Text style={styles.cargo}>Mestre de obras</Text>
          </View>
          <TouchableOpacity style={styles.conversarBotao} onPress={chat}>
            <Text style={styles.conversarTexto}>Conversar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.nome}>Helena Hills</Text>
            <Text style={styles.cargo}>Pedreiro</Text>
          </View>
          <TouchableOpacity style={styles.conversarBotao} onPress={chat}>
            <Text style={styles.conversarTexto}>Conversar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.nome}>Helena Hills</Text>
            <Text style={styles.cargo}>Eletricista</Text>
          </View>
          <TouchableOpacity style={styles.conversarBotao} onPress={chat}>
            <Text style={styles.conversarTexto}>Conversar</Text>
          </TouchableOpacity>
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
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 16,
  },
  contratarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contratarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardDestaque: {
    backgroundColor: '#FDECD2',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cargo: {
    fontSize: 12,
    color: '#F57C00',
  },
  conversarBotao: {
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  conversarTexto: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: 'bold',
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