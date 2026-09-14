import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { contratarStyles as styles } from '../src/Styles';

export default function Contratar() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Contratar Ajudantes</Text>

      <TextInput style={styles.searchInput} placeholder="Buscar por profissão ou nome..." />
      
      <ScrollView style={{paddingHorizontal: 16}}>
        <View style={styles.linhaFiltros}>
          <Text style={styles.filtroAtivo}>Todos</Text>
          <Text style={styles.filtro}>Eletricistas</Text>
          <Text style={styles.filtro}>Pedreiros</Text>
          <Text style={styles.filtro}>Pintor</Text>
        </View>

      
        <View style={styles.card}>
          <View style={styles.avatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.nome}>Carlos Mendes</Text>
            <Text style={styles.profissao}>Pedreiro • ★ 4.7</Text>
            <Text style={styles.descricao}>São Paulo, SP - 8 anos de experiência</Text>
          </View>
          <TouchableOpacity style={styles.verPerfilBotao} onPress={chat}>
            <Text style={styles.verPerfilTexto}>Ver perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.nome}>Helena Hills</Text>
            <Text style={styles.profissao}>Pintora • ★ 4.7</Text>
            <Text style={styles.descricao}>São Paulo, SP - 8 anos de experiência</Text>
          </View>
          <TouchableOpacity style={styles.verPerfilBotao} onPress={chat}>
            <Text style={styles.verPerfilTexto}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone} source={require('../assets/gerenciar.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={mapa}>
          <Image style={styles.footerIcone} source={require('../assets/Bussola.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={contratar}>
          <Image style={styles.footerIcone1} source={require('../assets/Trabalho.png')}/>
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