import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import {
  useEffect,
  useState
} from 'react';

import { useNavigation } from '@react-navigation/native';

import {
  buscarAnuncios
} from '../services/api';


export default function Home() {

  const categorias = [
    'Tijolo',
    'Cimento',
    'Areia',
    'Madeira',
    'Telha',
    'Ferro'
  ];


  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const navigation = useNavigation();


  useEffect(() => {

    carregarAnuncios();

  }, []);


  async function carregarAnuncios() {

    try {

      setCarregando(true);
      setErro('');

      const dados =
        await buscarAnuncios();

      if (dados.sucesso) {

        setProdutos(
          dados.anuncios || []
        );

      }

    } catch (error) {

      console.error(
        'Erro ao carregar anúncios:',
        error
      );

      setErro(
        'Não foi possível carregar os materiais.'
      );

    } finally {

      setCarregando(false);

    }

  }


  /*
    Filtra os produtos conforme o usuário
    digita no campo de busca.
  */

  const produtosFiltrados =
    produtos.filter((produto) => {

      const textoBusca =
        busca.trim().toLowerCase();

      if (!textoBusca) {
        return true;
      }

      const titulo =
        produto.titulo?.toLowerCase() || '';

      const categoria =
        produto.categoria?.toLowerCase() || '';

      const vendedor =
        produto.vendedor?.toLowerCase() || '';

      return (
        titulo.includes(textoBusca) ||
        categoria.includes(textoBusca) ||
        vendedor.includes(textoBusca)
      );

    });


  function formatarPreco(valor) {

    const numero =
      Number(valor);

    if (Number.isNaN(numero)) {
      return 'R$ 0,00';
    }

    return (
      'R$ ' +
      numero
        .toFixed(2)
        .replace('.', ',')
    );

  }


  function gerenciar() {
    navigation.navigate('Gerenciar');
  }


  function mapa() {
    navigation.navigate('Mapa');
  }


  function contratar() {
    navigation.navigate('Contratar');
  }


  function carrinho() {
    navigation.navigate('Carrinho');
  }


  function perfil() {
    alert(
      'Tela em construção, aguardando orçamento'
    );
  }


  function chat() {
    alert(
      'Tela em construção, aguardando orçamento'
    );
  }


  return (

    <View style={styles.container}>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >


        {/* BUSCA */}

        <TextInput
          style={styles.busca}
          placeholder="Buscar materiais"
          placeholderTextColor="#828282"
          value={busca}
          onChangeText={setBusca}
        />


        {/* AÇÕES RÁPIDAS */}

        <View style={styles.acoesRapidasRow}>

          <TouchableOpacity
            style={styles.acaoRapida}
          >

            <Text style={styles.acaoRapidaTexto}>
              Favoritos
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.acaoRapida}
          >

            <Text style={styles.acaoRapidaTexto}>
              Histórico
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.acaoRapida}
          >

            <Text style={styles.acaoRapidaTexto}>
              Verificados
            </Text>

          </TouchableOpacity>

        </View>


        {/* BANNER */}

        <View style={styles.banner}>

          <Text style={styles.bannerAnuncio}>
            Anúncio
          </Text>

          <Text style={styles.bannerTitulo}>
            O MIX DE{'\n'}
            PRODUTOS{'\n'}
            IDEAL PARA SEU{'\n'}
            MATERIAL DE{'\n'}
            CONSTRUÇÃO
          </Text>

        </View>


        {/* CATEGORIAS */}

        <View style={styles.secaoHeader}>

          <Text style={styles.secaoTitulo}>
            Categorias
          </Text>

          <Text style={styles.secaoSeta}>
            {'>'}
          </Text>

        </View>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          {categorias.map(
            (categoria, index) => (

              <TouchableOpacity
                key={index}
                style={styles.categoriaItem}
                onPress={() =>
                  setBusca(categoria)
                }
              >

                <View
                  style={styles.categoriaIcone}
                >
                  {/* Ícone da categoria */}
                </View>

                <Text
                  style={styles.categoriaTexto}
                >
                  {categoria}
                </Text>

              </TouchableOpacity>

            )
          )}

        </ScrollView>


        {/* PRODUTOS */}

        <View style={styles.secaoHeader}>

          <Text style={styles.secaoTitulo}>
            Geral
          </Text>

          <Text style={styles.secaoSeta}>
            {'>'}
          </Text>

        </View>


        {/* CARREGANDO */}

        {carregando && (

          <View style={styles.mensagemContainer}>

            <Text style={styles.mensagem}>
              Carregando materiais...
            </Text>

          </View>

        )}


        {/* ERRO */}

        {!carregando && erro !== '' && (

          <View style={styles.mensagemContainer}>

            <Text style={styles.erroTexto}>
              {erro}
            </Text>

            <TouchableOpacity
              style={styles.tentarNovamente}
              onPress={carregarAnuncios}
            >

              <Text
                style={styles.tentarNovamenteTexto}
              >
                Tentar novamente
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* SEM PRODUTOS */}

        {!carregando &&
          erro === '' &&
          produtosFiltrados.length === 0 && (

            <View style={styles.mensagemContainer}>

              <Text style={styles.mensagem}>
                Nenhum material encontrado.
              </Text>

            </View>

          )}


        {/* LISTA DE PRODUTOS */}

        {!carregando &&
          erro === '' &&
          produtosFiltrados.length > 0 && (

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >

              {produtosFiltrados.map(
                (produto) => (

                  <TouchableOpacity
                    key={produto.id_anuncio}
                    style={styles.produtoCard}
                  >

                    <View
                      style={styles.produtoImagem}
                    >

                      <Text
                        style={styles.placeholderImagem}
                      >
                        {produto.categoria
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </Text>

                    </View>


                    <Text
                      style={styles.produtoMarca}
                      numberOfLines={1}
                    >

                      {produto.categoria ||
                        'Material'}

                    </Text>


                    <Text
                      style={styles.produtoNome}
                      numberOfLines={2}
                    >

                      {produto.titulo}

                    </Text>


                    <Text
                      style={styles.produtoPreco}
                    >

                      {formatarPreco(
                        produto.preco_unitario
                      )}

                    </Text>


                    <Text
                      style={styles.produtoQuantidade}
                      numberOfLines={1}
                    >

                      {produto.quantidade}{' '}
                      {produto.unidade}

                    </Text>

                  </TouchableOpacity>

                )
              )}

            </ScrollView>

          )}


        {/* ESPAÇO PARA O FOOTER */}

        <View style={{ height: 30 }} />

      </ScrollView>


      {/* BOTTOM TAB BAR */}

      <View style={styles.footer}>


        <TouchableOpacity
          style={styles.footerItem}
        >

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
    justifyContent: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderImagem: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BDBDBD',
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
    minHeight: 30,
  },

  produtoPreco: {
    fontSize: 13,
    color: '#000000',
    marginTop: 2,
    fontWeight: 'bold',
  },

  produtoQuantidade: {
    fontSize: 10,
    color: '#828282',
    marginTop: 2,
  },

  mensagemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },

  mensagem: {
    color: '#828282',
    fontSize: 13,
  },

  erroTexto: {
    color: '#828282',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },

  tentarNovamente: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  tentarNovamenteTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
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