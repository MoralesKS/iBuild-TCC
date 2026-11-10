import { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api, MOSTRAR_EXEMPLOS } from '../src/api';
import { useAppNavigation, categorias, produtos as produtosExemplo } from '../src/Functions';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function Home() {
  const navigation = useNavigation();
  const { mapa, contratar, gerenciar, perfil, chat, carrinho } = useAppNavigation();

  // null = nenhuma categoria selecionada (mostra todos os produtos)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [textoBusca, setTextoBusca] = useState('');

  const [produtosDb, setProdutosDb] = useState([]);
  useFocusEffect(useCallback(() => {
  api.produtos().then(setProdutosDb).catch((e) => console.log(e.message));
  }, []));
  const produtos = [...produtosDb, ...(MOSTRAR_EXEMPLOS ? produtosExemplo : [])];

  // BOTÃO TEMPORÁRIO DE LOGOUT - remover quando a tela final estiver pronta
  function sairDaConta() {
    signOut(auth).catch((error) => {
      alert(error.message);
    });
  }

  function abrirProduto(produto) {
    navigation.navigate('Produto', { produto });
  }

  // Tocar de novo na categoria já ativa desmarca ela (volta a mostrar tudo)
  function alternarCategoria(categoria) {
    setCategoriaSelecionada((atual) => (atual?.id === categoria.id ? null : categoria));
  }

  // Combina os dois filtros: categoria selecionada E texto digitado na busca.
  // Um produto só aparece se passar nos dois ao mesmo tempo.
  const produtosFiltrados = produtos.filter((produto) => {
    const passaCategoria =
      !categoriaSelecionada ||
      produto.tipo.toLowerCase().includes(categoriaSelecionada.nome.toLowerCase());

    const texto = textoBusca.trim().toLowerCase();
    const passaBusca =
      texto === '' ||
      produto.nome.toLowerCase().includes(texto) ||
      produto.tipo.toLowerCase().includes(texto) ||
      produto.vendedor.toLowerCase().includes(texto);

    return passaCategoria && passaBusca;
  });

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TextInput
            style={styles.busca}
            placeholder="Buscar"
            placeholderTextColor="#828282"
            value={textoBusca}
            onChangeText={setTextoBusca}
          />

          <TouchableOpacity onPress={carrinho}>
            <Image
              style={styles.botaoHeader}
              source={require('../assets/icones/carrinho.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Notificação')}>
            <Image
              style={styles.botaoHeader}
              source={require('../assets/icones/notificacao-1.png')}
            />
          </TouchableOpacity>

          {/* BOTÃO TEMPORÁRIO DE LOGOUT - remover quando a tela final estiver pronta */}
          <TouchableOpacity
            onPress={sairDaConta}
            style={{
              backgroundColor: '#F57C00',
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.acoesRapidasRow}>
          <TouchableOpacity style={styles.acaoRapida}>
            <Image
              style={styles.botaoAcaoRapida}
              source={require('../assets/icones/favorito.png')}
            />
            <Text style={styles.acaoRapidaTexto}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoRapida}>
            <Image
              style={styles.botaoAcaoRapida}
              source={require('../assets/icones/historico.png')}
            />
            <Text style={styles.acaoRapidaTexto}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoRapida}>
            <Image
              style={styles.botaoAcaoRapida}
              source={require('../assets/icones/verificados.png')}
            />
            <Text style={styles.acaoRapidaTexto}>Verificados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerAnuncio}>Anúncio</Text>
          <Text style={styles.bannerTitulo}>
            O MIX DE{'\\n'}
            PRODUTOS{'\\n'}
            IDEAL PARA SEU{'\\n'}
            MATERIAL DE{'\\n'}
            CONSTRUÇÃO
          </Text>
        </View>

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Categorias</Text>

          {categoriaSelecionada && (
            <TouchableOpacity onPress={() => setCategoriaSelecionada(null)}>
              <Text style={styles.secaoSeta}>Limpar filtro</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoriaItem,
                categoriaSelecionada?.id === cat.id && styles.categoriaItemAtiva,
              ]}
              onPress={() => alternarCategoria(cat)}
            >
              <Image style={styles.categoriaIcone} source={cat.imagem} />
              <Text style={styles.categoriaTexto}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Produtos — agora usando produtosFiltrados, que respeita a categoria escolhida */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>
            {categoriaSelecionada ? categoriaSelecionada.nome : 'Geral'}
          </Text>

          <Text style={styles.secaoSeta}>{'>'}</Text>
        </View>

        {produtosFiltrados.length === 0 ? (
          <Text style={styles.semResultados}>
            Nenhum produto encontrado nessa categoria.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {produtosFiltrados.map((produto) => (
              <TouchableOpacity
                key={produto.id}
                style={styles.produtoCard}
                onPress={() => abrirProduto(produto)}
              >
                <Image
                  style={styles.produtoImagem}
                  source={produto.imagem}
                />

                <Text style={styles.produtoMarca}>
                  {produto.vendedor}
                </Text>

                <Text style={styles.produtoNome}>
                  {produto.nome}
                </Text>

                <Text style={styles.produtoPreco}>
                  {produto.preco}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Image
            style={styles.footerIcone1}
            source={require('../assets/Home.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={gerenciar}
        >
          <Image
            style={styles.footerIcone}
            source={require('../assets/gerenciar.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={mapa}
        >
          <Image
            style={styles.footerIcone}
            source={require('../assets/Bussola.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={contratar}
        >
          <Image
            style={styles.footerIcone}
            source={require('../assets/Trabalho.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={chat}
        >
          <Image
            style={styles.footerIcone}
            source={require('../assets/Chat.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={perfil}
          accessibilityRole="button"
          accessibilityLabel="Meu perfil"
        >
          <Image
            style={styles.footerIcone}
            source={require('../assets/Perfil.png')}
          />
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
    width: '75%',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#000000',
  },
  botaoHeader: {
    width: 34,
    height: 34,
    marginTop: 10,
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
    justifyContent: 'center',
  },
  botaoAcaoRapida: {
    width: 18,
    height: 18,
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
  semResultados: {
    margin: 8,
  },
});
