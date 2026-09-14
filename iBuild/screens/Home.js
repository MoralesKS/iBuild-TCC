import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { homeStyles as styles } from '../src/Styles';

export default function Home() {
  const categorias = [
  { nome: 'Tijolo', imagem: require('../assets/produtos/tijolo.jpg') },
  { nome: 'Cimento', imagem: require('../assets/produtos/cimento.jpg') },
  { nome: 'Areia', imagem: require('../assets/produtos/areia.jpg') },
  { nome: 'Madeira', imagem: require('../assets/produtos/madeira.jpg') },
  { nome: 'Telha', imagem: require('../assets/produtos/telha.jpg') },
  { nome: 'Ferro', imagem: require('../assets/produtos/vergalhao.jpg') },
];
const produtos = [
  { nome: 'Cimento Caue', imagem: require('../assets/produtos/cimento.jpg') },
  { nome: 'Tijolo Cerâmico', imagem: require('../assets/produtos/tijolo.jpg') },
  { nome: 'Areia Fina', imagem: require('../assets/produtos/areia.jpg') },
  { nome: 'Vergalhão', imagem: require('../assets/produtos/vergalhao.jpg') },
];
  const { mapa, contratar, carrinho, gerenciar, perfil, chat } = useAppNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <TextInput style={styles.busca} placeholder="Buscar" placeholderTextColor="#828282" />
          <TouchableOpacity onPress={carrinho}>
            <Image source={require('../assets/icones/carrinho.png')} style={styles.botaoHeader} resizeMode='stretch'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Tela em Produção, Aguardando Orçamento!')}>
            <Image source={require('../assets/icones/notificacao-1.png')} style={styles.botaoHeader}/>
          </TouchableOpacity>
        </View>

        <View style={styles.acoesRapidasRow}>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image source={require('../assets/icones/favorito.png')} style={styles.botaoAcaoRapida}/>
            <Text style={styles.acaoRapidaTexto}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image source={require('../assets/icones/historico.png')} style={styles.botaoAcaoRapida}/>
            <Text style={styles.acaoRapidaTexto}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image source={require('../assets/icones/verificados.png')} style={styles.botaoAcaoRapida}/>
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
          {categorias.map((categoria, index) => (
            <TouchableOpacity key={index} style={styles.categoriaItem}>
              <Image source={categoria.imagem} style={styles.categoriaImagem} resizeMode="contain" />
              <Text style={styles.categoriaTexto}>{categoria.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Produtos */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Geral</Text>
          <Text style={styles.secaoSeta}>{'>'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
              <Image source={produto.imagem} style={styles.produtoImagem} resizeMode="contain" />
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>$10,99</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
              <Image source={produto.imagem} style={styles.produtoImagem} resizeMode="contain" />
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>$10,99</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {produtos.map((produto, index) => (
            <TouchableOpacity key={index} style={styles.produtoCard} onPress={carrinho}>
              <Image source={produto.imagem} style={styles.produtoImagem} resizeMode="contain" />
              <Text style={styles.produtoMarca}>Marca</Text>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
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