import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation, produtos } from '../src/Functions';
import { usuario } from '../src/Usuario';

export default function Perfil() {
  const navigation = useNavigation();
  const { home, mapa, contratar, gerenciar, chat, anunciar } = useAppNavigation();

  // Dados de exemplo: por enquanto todos os produtos aparecem como "itens à venda"
  // e os favoritos são os mesmos em outra ordem. Quando tiver backend ou Context
  // de anúncios/favoritos, é só trocar essas duas linhas.
  const itensAVenda = produtos;
  const favoritos = [...produtos].reverse();

  function abrirProduto(produto) {
    navigation.navigate('Produto', { produto });
  }

  // Função simples (não um componente) pra não repetir o mesmo JSX nas duas listas
  function renderizarLista(lista) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lista.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            style={styles.produtoCard}
            onPress={() => abrirProduto(produto)}
          >
            <Image style={styles.produtoImagem} source={produto.imagem} />
            <Text style={styles.produtoNome} numberOfLines={1}>{produto.nome}</Text>
            <Text style={styles.produtoPreco}>{produto.preco} / un.</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.titulo}>Meu Perfil</Text>
        <TouchableOpacity
          style={styles.botaoConfig}
          onPress={() => alert('Tela em construção, aguardando orçamento')}
        >
          <Image style={styles.iconeConfig} source={require('../assets/icones/configuracoes.png')}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Foto e dados principais */}
        <View style={styles.perfilRow}>
          <View style={styles.avatarWrapper}>
            <Image style={styles.avatar} source={usuario.foto} />
            <View style={styles.editarBadge}>
              <Text style={styles.editarTexto}>✎</Text>
            </View>
          </View>
          <View>
            <Text style={styles.nome}>{usuario.nome}</Text>
            <Text style={styles.profissao}>{usuario.profissao}</Text>
            <View style={styles.localRow}>
              <Image style={styles.iconePequeno} source={require('../assets/icones/localizacao.png')}/>
              <Text style={styles.localTexto}>{usuario.cidade}</Text>
            </View>
          </View>
        </View>

        {/* Contato */}
        <View style={styles.contatoRow}>
          <View style={styles.contatoItem}>
            <Image style={styles.contatoIcone} source={require('../assets/icones/telefone.png')}/>
            <Text style={styles.contatoTexto}>{usuario.telefone}</Text>
          </View>
          <View style={styles.contatoItem}>
            <Image style={styles.contatoIcone} source={require('../assets/icones/email.png')}/>
            <Text style={styles.contatoTexto}>{usuario.email}</Text>
          </View>
        </View>

        <Text style={styles.bio}>{usuario.bio}</Text>

        {/* Estatísticas — Produtos e Favoritos vêm das listas, não são números fixos */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValor}>{itensAVenda.length}</Text>
            <Text style={styles.statLabel}>Produtos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValor}>{favoritos.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValor}>{usuario.avaliacoes}</Text>
            <Text style={styles.statLabel}>Avaliações</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValor}>
              <Text style={styles.estrela}>★ </Text>{usuario.notaMedia}
            </Text>
            <Text style={styles.statLabel}>Nota média</Text>
          </View>
        </View>

        {/* Botão pra anunciar */}
        <TouchableOpacity style={styles.anunciarCard} onPress={anunciar}>
          <Image style={styles.anunciarIcone} source={require('../assets/icones/anuncio.png')}/>
          <View style={styles.anunciarInfo}>
            <Text style={styles.anunciarTitulo}>Anunciar produtos ou materiais</Text>
            <Text style={styles.anunciarSub}>Divulgue seus produtos e alcance mais clientes</Text>
          </View>
          <Text style={styles.setaDireita}>{'>'}</Text>
        </TouchableOpacity>

        <View style={styles.divisor} />

        {/* Itens à venda */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Itens a venda</Text>
          <TouchableOpacity>
            <Text style={styles.verTodos}>Ver todos {'>'}</Text>
          </TouchableOpacity>
        </View>
        {renderizarLista(itensAVenda)}

        {/* Favoritos */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Favoritos</Text>
          <TouchableOpacity>
            <Text style={styles.verTodos}>Ver todos {'>'}</Text>
          </TouchableOpacity>
        </View>
        {renderizarLista(favoritos)}

      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
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

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone1} source={require('../assets/Perfil.png')}/>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoConfig: {
    position: 'absolute',
    right: 16,
  },
  iconeConfig: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  perfilRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  editarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editarTexto: {
    fontSize: 12,
    color: '#000000',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  profissao: {
    fontSize: 13,
    color: '#828282',
    marginTop: 2,
  },
  localRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconePequeno: {
    width: 14,
    height: 14,
    tintColor: '#828282',
    marginRight: 4,
  },
  localTexto: {
    fontSize: 12,
    color: '#000000',
  },
  contatoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contatoIcone: {
    width: 18,
    height: 18,
    tintColor: '#000000',
    marginRight: 6,
  },
  contatoTexto: {
    fontSize: 13,
    color: '#000000',
  },
  bio: {
    fontSize: 13,
    color: '#000000',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  estrela: {
    color: '#F5A623',
  },
  statLabel: {
    fontSize: 11,
    color: '#828282',
  },
  anunciarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F57C00',
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  anunciarIcone: {
    width: 32,
    height: 32,
    tintColor: '#F57C00',
    marginRight: 12,
  },
  anunciarInfo: {
    flex: 1,
  },
  anunciarTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  anunciarSub: {
    fontSize: 11,
    color: '#828282',
    marginTop: 2,
  },
  setaDireita: {
    fontSize: 16,
    color: '#828282',
  },
  divisor: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  verTodos: {
    fontSize: 12,
    color: '#F57C00',
  },
  produtoCard: {
    width: 90,
    marginRight: 12,
    marginBottom: 12,
  },
  produtoImagem: {
    width: 90,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    resizeMode: 'cover',
  },
  produtoNome: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
    marginTop: 4,
  },
  produtoPreco: {
    fontSize: 10,
    color: '#828282',
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