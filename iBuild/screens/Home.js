import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { homeStyles as styles } from '../src/Styles';

export default function Home() {
  const categorias = ['Tijolo', 'Cimento', 'Areia', 'Madeira', 'Telha', 'Ferro'];
  const produtos = ['Cimento Caue', 'Tijolo Cerâmico', 'Areia Fina', 'Vergalhão'];
  const { mapa, contratar, carrinho, gerenciar, perfil, chat } = useAppNavigation();

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
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
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
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
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
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
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
        <TouchableOpacity style={styles.footerItem}>
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