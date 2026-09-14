import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation, categorias, produtos } from '../src/Functions';
import { homeStyles as styles } from '../src/Styles';
import Carrinho from './Carrinho';

export default function Home() {
  // useNavigation "puro" aqui porque precisamos passar PARÂMETROS
  // (qual produto foi clicado) — o hook useAppNavigation só sabe
  // navegar pra rotas fixas, sem dados extras.
  const navigation = useNavigation();
  const { mapa, contratar, gerenciar, perfil, chat, carrinho } = useAppNavigation();

  function abrirProduto(produto) {
    navigation.navigate('Produto', { produto });
  }

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <TextInput style={styles.busca} placeholder="Buscar" placeholderTextColor="#828282" />
          <TouchableOpacity onPress={carrinho}>
            <Image style={styles.botaoHeader} source={require('../assets/icones/carrinho.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Tela em construção, aguardando orçamento!')}>
            <Image style={styles.botaoHeader} source={require('../assets/icones/notificacao-1.png')}/>
          </TouchableOpacity>
        </View>

        <View style={styles.acoesRapidasRow}>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image style={styles.botaoAcaoRapida} source={require('../assets/icones/favorito.png')}/>
            <Text style={styles.acaoRapidaTexto}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image style={styles.botaoAcaoRapida} source={require('../assets/icones/historico.png')}/>
            <Text style={styles.acaoRapidaTexto}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image style={styles.botaoAcaoRapida} source={require('../assets/icones/verificados.png')}/>
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
          {categorias.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoriaItem}>
              <Image style={styles.categoriaIcone} source={cat.imagem} />
              <Text style={styles.categoriaTexto}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Produtos */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Geral</Text>
          <Text style={styles.secaoSeta}>{'>'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {produtos.map((produto) => (
            <TouchableOpacity
              key={produto.id}
              style={styles.produtoCard}
              onPress={() => abrirProduto(produto)}
            >
              <Image style={styles.produtoImagem} source={produto.imagem} />
              <Text style={styles.produtoMarca}>{produto.vendedor}</Text>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>{produto.preco}</Text>
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