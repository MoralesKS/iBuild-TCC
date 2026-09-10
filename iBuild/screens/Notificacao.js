import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { notificacoesStyles as styles } from '../src/Styles';

export default function Notificacoes() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

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