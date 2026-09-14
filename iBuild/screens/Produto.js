import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppNavigation, produtos } from '../src/Functions';
import { detalhesProdutoStyles as styles } from '../src/Styles';
import { useCarrinho } from '../src/CarrinhoItens';

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { home, mapa, contratar, gerenciar, perfil, chat, carrinho } = useAppNavigation();
  const { adicionarAoCarrinho } = useCarrinho();

  // route.params.produto vem do navigation.navigate('Produto', { produto })
  // lá do Home.js. O "|| produtos[0]" é só um fallback pra tela não quebrar
  // caso você abra ela direto, sem vir de um clique (ex: testando no Storybook).
  const produto = route.params?.produto || produtos[0];

  function comprarAgora() {
    adicionarAoCarrinho(produto);
    carrinho();
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <TouchableOpacity onPress={home}>
        <Text style={styles.seta}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Imagem do produto */}
        <View style={styles.imagemWrapper}>
          <Image style={styles.imagemProduto} source={produto.imagem} />
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotAtivo]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Nome e tipo */}
        <View style={styles.tituloRow}>
          <Text style={styles.nomeProduto}>{produto.nome}</Text>
          <Text style={styles.emEstoque}>Em estoque</Text>
        </View>
        <Text style={styles.tipoTexto}>Tipo: {produto.tipo}</Text>

        {/* Preço e avaliação */}
        <View style={styles.precoRow}>
          <Text style={styles.preco}>{produto.preco}</Text>
          <Text style={styles.unidade}> / un</Text>
        </View>
        <Text style={styles.avaliacaoTexto}>
          ★★★★★ {produto.avaliacao} ({produto.numAvaliacoes} avaliações)
        </Text>

        {/* Vendedor */}
        <TouchableOpacity style={styles.vendedorCard}>
          <View style={styles.vendedorIcone} />
          <View style={styles.vendedorInfo}>
            <Text style={styles.vendedorNome}>Vendedor: {produto.vendedor}</Text>
            <Text style={styles.vendedorLocal}>{produto.local}</Text>
          </View>
          <Text style={styles.setaDireita}>{'>'}</Text>
        </TouchableOpacity>

        {/* Descrição */}
        <Text style={styles.descricaoTexto}>{produto.descricao}</Text>

        {/* Especificações */}
        <Text style={styles.tituloSecao}>Especificações</Text>
        <View style={styles.especCard}>
          <View style={styles.especLinha}>
            <Text style={styles.especLabel}>Material:</Text>
            <Text style={styles.especValor}>{produto.especificacoes.material}</Text>
          </View>
          <View style={styles.especLinha}>
            <Text style={styles.especLabel}>Cor:</Text>
            <Text style={styles.especValor}>{produto.especificacoes.cor}</Text>
          </View>
          <View style={styles.especLinha}>
            <Text style={styles.especLabel}>Dimensões:</Text>
            <Text style={styles.especValor}>{produto.especificacoes.dimensoes}</Text>
          </View>
          <View style={styles.especLinha}>
            <Text style={styles.especLabel}>Quantidade:</Text>
            <Text style={styles.especValor}>{produto.especificacoes.quantidade}</Text>
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.botoesRow}>
          <TouchableOpacity style={styles.chatBotao} onPress={chat}>
            <Text style={styles.chatTexto}>Chamar no chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.comprarBotao} onPress={comprarAgora}>
            <Text style={styles.comprarTexto}>Comprar agora</Text>
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