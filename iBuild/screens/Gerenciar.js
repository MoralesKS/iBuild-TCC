import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { gerenciarStyles as styles } from '../src/Styles';

export default function Gerenciar() {
  const { home, mapa, contratar, gerenciar, perfil, chat, detalhesObra } = useAppNavigation();

  return (
    <View style={styles.container}>

      <TextInput style={styles.searchInput} placeholder="Pesquisar" />

      <TouchableOpacity>
        <Text style={styles.filtro}>Todas as obras ⌄</Text>
      </TouchableOpacity>

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
          <Image style={styles.foto} source={require('../assets/Home.png')}/>
          <View style={{ marginLeft: '10%', width: '60%' }}>
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
        </View>

        <View style={styles.obraCard}>
          <Image style={styles.foto} source={require('../assets/empresas.png')}/>
          <View style={{ marginLeft: '10%', width: '60%' }}>
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