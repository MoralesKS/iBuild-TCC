import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { funcionariosStyles as styles } from '../src/Styles';

export default function Funcionarios() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

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