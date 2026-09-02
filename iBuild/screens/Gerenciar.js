import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Gerenciar() {
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
  function detalhesObra(){
    navigation.navigate('DetalhesObra');
  }

  return (
    <View style={styles.container}>

      <TextInput style={styles.searchInput} placeholder="Pesquisar" />

      <Text style={styles.filtro}>Todas as obras ⌄</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total de Obras</Text>
          <Text style={styles.statValor}>96</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Em andamento</Text>
          <Text style={styles.statValor}>64</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Concluídas</Text>
          <Text style={styles.statValor}>32</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Funcionários</Text>
          <Text style={styles.statValor}>81</Text>
        </View>
      </View>

      <Text style={styles.tituloSecao}>Obras Recentes</Text>
      <ScrollView>
        <View style={styles.obraCard}>
          <Text style={styles.obraNome}>Residencial Aurora</Text>
          <Text style={styles.obraSub}>Construtora Horizonte Ltda.</Text>
          <View style={styles.progressoBarraFundo}>
            <View style={[styles.progressoBarraPreenchida, { width: '78%' }]} />
          </View>
          <Text style={styles.progressoTexto}>78% Concluída</Text>
          <TouchableOpacity style={styles.verDetalhesBotao} onPress={detalhesObra}>
            <Text style={styles.verDetalhesTexto}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.obraCard}>
          <Text style={styles.obraNome}>Centro Comercial</Text>
          <Text style={styles.obraSub}>Construtora Urbanis</Text>
          <View style={styles.progressoBarraFundo}>
            <View style={[styles.progressoBarraPreenchida, { width: '45%', backgroundColor: '#F5A623' }]} />
          </View>
          <Text style={styles.progressoTexto}>45% Concluída</Text>
          <TouchableOpacity style={styles.verDetalhesBotao} onPress={detalhesObra}>
            <Text style={styles.verDetalhesTexto}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone1} source={require('../assets/gerenciar.png')}/>
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
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filtro: {
    marginTop: 12,
    color: '#000000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#828282',
  },
  statValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F57C00',
    marginTop: 6,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  obraCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  obraNome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  obraSub: {
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
  verDetalhesBotao: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  verDetalhesTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
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