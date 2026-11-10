import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppNavigation, produtos } from '../src/Functions';
import { obterConversaDoVendedor, useConversas } from './Chat1';
import { useCarrinho } from '../src/CarrinhoItens';

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { home, mapa, contratar, gerenciar, perfil, chat, carrinho } = useAppNavigation();
  const conversas = useConversas();
  const { adicionarAoCarrinho } = useCarrinho();

  // route.params.produto vem do navigation.navigate('Produto', { produto })
  // lá do Home.js. O "|| produtos[0]" é só um fallback pra tela não quebrar
  // caso você abra ela direto, sem vir de um clique (ex: testando no Storybook).
  const produto = route.params?.produto || produtos[0];

  function abrirVendedor() {
    navigation.navigate('PerfilAutonomo', {
      usuarioId: produto.idVendedor ?? null,
      vendedor: { nome: produto.vendedor, local: produto.local },
    });
  }

  function chamarVendedor() {
    const conversaId = obterConversaDoVendedor(conversas, produto);
    navigation.navigate('Chat 2', { conversaId });
  }

  function comprarAgora() {
    adicionarAoCarrinho(produto);
    carrinho();
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <TouchableOpacity accessibilityLabel="Voltar" onPress={() => navigation.canGoBack() ? navigation.goBack() : home()}>
        <Text style={styles.seta}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Imagem do produto */}
        {produto.imagem ? (
          <Image style={styles.imagemProduto} source={produto.imagem} resizeMode="contain" />
        ) : (
          <View style={[styles.imagemProduto, styles.semImagem]}><Text>Sem imagem</Text></View>
        )}

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
          ★ {produto.avaliacao} ({produto.numAvaliacoes} avaliações)
        </Text>

        {/* Vendedor */}
        <TouchableOpacity style={styles.vendedorCard} onPress={abrirVendedor}>
          <View style={[styles.vendedorIcone, {justifyContent: 'center', alignItems: 'center'}]}>
            <Image style={{height: 25, width: 25, tintColor: '#000000'}} source={require('../assets/empresas.png')}/>
          </View>
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
          <TouchableOpacity style={styles.chatBotao} onPress={chamarVendedor}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
    paddingTop: '10%',
  },
  seta: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 12,
    marginLeft: '5%',
  }, 
  imagemProduto: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  tituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  nomeProduto: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  emEstoque: {
    fontSize: 12,
    color: '#277D2C',
    fontWeight: '500',
  },
  tipoTexto: {
    fontSize: 13,
    color: '#828282',
    marginTop: 2,
  },
  precoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
  },
  preco: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  unidade: {
    fontSize: 13,
    color: '#828282',
  },
  avaliacaoTexto: {
    fontSize: 13,
    color: '#F5A623',
    marginTop: 4,
  },
  vendedorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  vendedorIcone: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  vendedorInfo: {
    flex: 1,
  },
  vendedorNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  vendedorLocal: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  setaDireita: {
    fontSize: 16,
    color: '#828282',
  },
  descricaoTexto: {
    fontSize: 12,
    color: '#828282',
    fontStyle: 'italic',
    marginTop: 16,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8,
  },
  especCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  especLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  especLabel: {
    fontSize: 13,
    color: '#828282',
  },
  especValor: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  botoesRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 8,
  },
  chatBotao: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#277D2C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatTexto: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 13,
  },
  comprarBotao: {
    flex: 1,
    backgroundColor: '#F57C00',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  comprarTexto: {
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