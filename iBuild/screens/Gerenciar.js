import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Gerenciar() {
  const categorias = ['Tijolo', 'Cimento', 'Areia', 'Madeira', 'Telha', 'Ferro'];
  const produtos = ['Cimento Caue', 'Tijolo Cerâmico', 'Areia Fina', 'Vergalhão'];
  const navigation = useNavigation();

  function home(){
    navigation.navigate('Home')
  }
  function mapa(){
    navigation.navigate('Mapa')
  }
  function contratar(){
    navigation.navigate('Contratar')
  }
  function carrinho(){
    navigation.navigate('Carrinho')
  }
  function gerenciar(){
    navigation.navigate('Gerenciar')
  }
  function perfil(){
    alert('Tela em construção, aguardando orçamento')
  }
  function chat(){
    alert('Tela em construção, aguardando orçamento')
  }

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <TextInput style={styles.busca} placeholder="Buscar" placeholderTextColor="#828282" />

        <View style={styles.acoesRapidasRow}>
          <TouchableOpacity style={styles.acaoRapida}>
            <Text style={styles.acaoRapidaTexto}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Text style={styles.acaoRapidaTexto}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Text style={styles.acaoRapidaTexto}>Verificados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerAnuncio}>Anúncio</Text>
          <Text style={styles.bannerTitulo}>O MIX DE{'\n'}PRODUTOS{'\n'}IDEAL PARA SEU{'\n'}MATERIAL DE{'\n'}CONSTRUÇÃO</Text>
        </View>

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Categorias</Text>
          <Text style={styles.secaoSeta}>{'>'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoriaItem}>
              <View style={styles.categoriaIcone}>
                {/* ICONE: {cat} */}
              </View>
              <Text style={styles.categoriaTexto}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Produtos */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Geral</Text>
          <Text style={styles.secaoSeta}>{'>'}</Text>
        </View>

        <ScrollView horizontal>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard}>
              <View style={styles.produtoImagem}>
                {/* IMAGEM: {produto} */}
              </View>
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto}</Text>
              <Text style={styles.produtoPreco}>$10,99</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard}>
              <View style={styles.produtoImagem}>
                {/* IMAGEM: {produto} */}
              </View>
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto}</Text>
              <Text style={styles.produtoPreco}>$10,99</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard}>
              <View style={styles.produtoImagem}>
                {/* IMAGEM: {produto} */}
              </View>
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto}</Text>
              <Text style={styles.produtoPreco}>$10,99</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
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
    marginBottom: '10%',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: '10%',
  },
  busca: {
    backgroundColor: '#F5F5F5',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#000000',
  },
  acoesRapidasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  acaoRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: 104,
    height: 32,
    borderColor: 'gray',
    borderRadius: 8,
    justifyContent: 'center'
  },
  acaoRapidaTexto: {
    fontSize: 13,
    color: '#000000',
    marginLeft: 4,
  },
  banner: {
    backgroundColor: '#F57C00',
    borderRadius: 12,
    height: 120,
    marginTop: 16,
    padding: 16,
    justifyContent: 'center',
  },
  bannerAnuncio: {
    color: '#FFFFFF',
    fontSize: 10,
    marginBottom: 4,
  },
  bannerTitulo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  secaoTitulo: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  secaoSeta: {
    color: '#828282',
    fontSize: 15,
  },
  categoriaItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoriaIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  categoriaTexto: {
    fontSize: 12,
    color: '#000000',
    marginTop: 6,
  },
  produtoCard: {
    width: 110,
    marginRight: 12,
    marginBottom: 16,
  },
  produtoImagem: {
    width: 110,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  produtoMarca: {
    fontSize: 10,
    color: '#828282',
    marginTop: 6,
  },
  produtoNome: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  produtoPreco: {
    fontSize: 13,
    color: '#000000',
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
