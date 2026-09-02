import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetalhesObra() {
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

      <Text style={styles.titulo}>Detalhes da obra</Text>

      <ScrollView>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoNome}>Residencial Aurora</Text>
          <Text style={styles.resumoSub}>São Paulo • Entrega 18/08/26</Text>
          <View style={styles.progressoBarraFundo}>
            <View style={[styles.progressoBarraPreenchida, { width: '78%' }]} />
          </View>
          <Text style={styles.progressoTexto}>78% Concluída • Em andamento</Text>
        </View>

        <Text style={styles.tituloSecao}>Informações gerais</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>Tipo: Residencial</Text>
          <Text style={styles.infoLinha}>Endereço: Rua das Acacias, 245</Text>
          <Text style={styles.infoLinha}>Responsável técnico: Eng. Carlos Mendes</Text>
          <Text style={styles.infoLinha}>Orçamento: R$ 2.400.000</Text>
        </View>

        <Text style={styles.tituloSecao}>Etapas da Obra</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>Fundação - 100%</Text>
          <Text style={styles.infoLinha}>Estrutura - 70%</Text>
          <Text style={styles.infoLinha}>Acabamento - 45%</Text>
        </View>

        <Text style={styles.tituloSecao}>Equipe</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>Mestre de obras: João Neves</Text>
          <Text style={styles.infoLinha}>Funcionários ativos: 34</Text>
          <Text style={styles.infoLinha}>Horas trabalhadas: 192h</Text>
        </View>

        <Text style={styles.tituloSecao}>Próximas Ações</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>✓ Instalação elétrica do bloco B</Text>
          <Text style={styles.infoLinha}>◻ Instalação elétrica do bloco C</Text>
        </View>

        <TouchableOpacity style={styles.contratarBotao} onPress={contratar}>
          <Text style={styles.contratarTexto}>Contratar funcionários</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  resumoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  resumoNome: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  resumoSub: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 12,
  },
  progressoBarraFundo: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: 6,
    backgroundColor: '#277D2C',
    borderRadius: 3,
  },
  progressoTexto: {
    fontSize: 12,
    marginTop: 8,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  infoLinha: {
    fontSize: 13,
    color: '#000000',
    marginBottom: 8,
  },
  contratarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  contratarTexto: {
    color: '#FFFFFF',
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