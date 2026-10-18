import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation, produtos } from '../src/Functions';
import { perfilStyles as styles } from '../src/Styles';
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