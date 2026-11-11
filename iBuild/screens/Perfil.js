import { useCallback, useState } from 'react';
import { listarFavoritos, alternarFavorito } from '../src/Favoritos';
import { Text, View, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAppNavigation } from '../src/Functions';
import { api, sair, useUsuario } from '../src/api';
import FotoProduto from '../src/FotoProduto';
import BarraInferior from '../src/BarraInferior';
import { garantirConversa } from './Chat1';
import { useAreaSegura } from '../src/responsivo';

// Autônomos de exemplo (do Functions.js) não existem no banco: monta um perfil só de leitura
function perfilDoExemplo(p) {
  return {
    idUsuario: null,
    idProfissional: null,
    tipoPerfil: 'autonomo',
    exemplo: true,
    nome: p.nome,
    profissao: p.categoria,
    email: '',
    telefone: '',
    cidade: p.cidade || '',
    bio: p.experiencia ? `Experiência: ${p.experiencia}.` : '',
    foto: p.imagem,
    avaliacoes: 0,
    notaMedia: p.avaliacao ?? 0,
  };
}

export default function Perfil() {
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();
  const route = useRoute();
  const { contratar, anunciar } = useAppNavigation();
  const { usuario: usuarioLogado } = useUsuario();

  // Rota "Perfil" = meu perfil. Rota "PerfilAutonomo" = perfil de outra pessoa:
  //   { usuarioId }    -> usuário do banco
  //   { profissional } -> autônomo de exemplo
  const idParam = route.params?.usuarioId;
  const exemplo = route.params?.profissional;
  const visitando = !!(idParam || exemplo);
  const ehProprio = !visitando || (!!idParam && idParam === usuarioLogado?.idUsuario);

  const [outro, setOutro] = useState(null);
  const [itensAVenda, setItensAVenda] = useState([]);
  const [minhasObras, setMinhasObras] = useState([]);
  const [escolhendoObra, setEscolhendoObra] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  const usuario = ehProprio ? usuarioLogado : exemplo ? perfilDoExemplo(exemplo) : outro;


  useFocusEffect(
    useCallback(() => {
      const id = ehProprio ? usuarioLogado?.idUsuario : idParam;
      if (!ehProprio && idParam) {
        setOutro((atual) => (atual && atual.idUsuario === idParam ? atual : null));
        api.usuario(idParam).then(setOutro).catch((e) => console.log(e.message));
      }
      if (ehProprio && id) listarFavoritos(id).then(setFavoritos);
      if (id) {
        api.produtos(id).then((l) => setItensAVenda(l || [])).catch(() => {});
      } else {
        setItensAVenda([]);
      }
      if (!ehProprio && usuarioLogado) {
        api.obras(usuarioLogado.idUsuario).then((l) => setMinhasObras(l || [])).catch(() => {});
      }
    }, [idParam, usuarioLogado, ehProprio])
  );

  function abrirProduto(produto) {
    navigation.navigate('Produto', { produto });
  }

  // Abre (ou cria) a conversa com esta pessoa
  function chamarNoChat() {
    const id = garantirConversa({
      id: usuario.idUsuario ? `u-${usuario.idUsuario}` : `ex-${usuario.nome}`,
      nome: usuario.nome,
      status: usuario.profissao || 'Online',
      saudacao: `Olá! Sou ${usuario.nome}${usuario.profissao ? ', ' + usuario.profissao : ''}. Como posso ajudar na sua obra?`,
      padrao: 'Entendi! Me envie mais detalhes do serviço para eu te passar um orçamento.',
    });
    navigation.navigate('Chat 2', { conversaId: id });
  }

  async function adicionarNaObra(obra) {
    try {
      await api.adicionarProfissional(obra.id, usuario.idProfissional, usuario.profissao, usuarioLogado?.idUsuario);
      alert(`${usuario.nome} foi adicionado à obra ${obra.nome}`);
      setEscolhendoObra(false);
    } catch (e) {
      alert(e.message);
    }
  }

  function confirmarSaida() {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await sair();
            navigation.navigate('Login');
          } catch (e) {
            alert(e.message);
          }
        },
      },
    ]);
  }

  // Função simples (não um componente) pra não repetir o mesmo JSX nas duas listas
  function renderizarLista(lista, permiteRemover = false) {
    if (lista.length === 0) {
      return <Text style={styles.listaVazia}>Nada por aqui ainda.</Text>;
    }
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lista.map((produto) => (
          <View key={produto.id} style={styles.produtoCard}>
            <TouchableOpacity onPress={() => abrirProduto(produto)}>
              <FotoProduto style={styles.produtoImagem} source={produto.imagem} />
              <Text style={styles.produtoNome} numberOfLines={1}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>{produto.preco} / un.</Text>
            </TouchableOpacity>
            {permiteRemover && (
              <TouchableOpacity onPress={async () => {
                await alternarFavorito(usuarioLogado?.idUsuario, produto);
                setFavoritos((listaAtual) => listaAtual.filter((item) => String(item.id) !== String(produto.id)));
              }}>
                <Text style={{ color: '#C62828', fontSize: 11, marginTop: 6 }}>♥ Remover dos favoritos</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    );
  }

  if (!usuario) {
    return (
      <View style={[styles.container, areaSegura, areaSegura]}>
        <Text style={styles.titulo}>Perfil</Text>
        <Text style={styles.listaVazia}>Carregando perfil...</Text>
        <BarraInferior ativo="perfil" />
      </View>
    );
  }

  const ehLoja = usuario.tipoPerfil === 'loja';

  return (
    <View style={[styles.container, areaSegura, areaSegura]}>

      <View style={styles.headerRow}>
        {!ehProprio && (
          <TouchableOpacity style={styles.botaoVoltar} onPress={contratar}>
            <Text style={styles.setaVoltar}>{'<'}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.titulo}>{ehProprio ? 'Meu Perfil' : 'Perfil'}</Text>
        {ehProprio && (
          <TouchableOpacity
            style={styles.botaoConfig}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Image style={styles.iconeConfig} source={require('../assets/icones/configuracoes.png')}/>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Foto e dados principais */}
        <View style={styles.perfilRow}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            disabled={!ehProprio}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <FotoProduto style={styles.avatar} source={usuario.foto} />
            {ehProprio && (
              <View style={styles.editarBadge}>
                <Text style={styles.editarTexto}>✎</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{usuario.nome}</Text>
            <Text style={styles.profissao}>{usuario.profissao}</Text>
            {!!usuario.cidade && (
              <View style={styles.localRow}>
                <Image style={styles.iconePequeno} source={require('../assets/icones/localizacao.png')}/>
                <Text style={styles.localTexto}>{usuario.cidade}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contato */}
        {(!!usuario.telefone || !!usuario.email) && (
          <View style={styles.contatoRow}>
            {!!usuario.telefone && (
              <View style={styles.contatoItem}>
                <Image style={styles.contatoIcone} source={require('../assets/icones/telefone.png')}/>
                <Text style={styles.contatoTexto}>{usuario.telefone}</Text>
              </View>
            )}
            {!!usuario.email && (
              <View style={styles.contatoItem}>
                <Image style={styles.contatoIcone} source={require('../assets/icones/email.png')}/>
                <Text style={styles.contatoTexto}>{usuario.email}</Text>
              </View>
            )}
          </View>
        )}

        {!!usuario.bio && <Text style={styles.bio}>{usuario.bio}</Text>}

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          {(ehProprio || itensAVenda.length > 0) && (
            <View style={styles.statItem}>
              <Text style={styles.statValor}>{itensAVenda.length}</Text>
              <Text style={styles.statLabel}>Produtos</Text>
            </View>
          )}
          {ehProprio && (
            <View style={styles.statItem}>
              <Text style={styles.statValor}>{favoritos.length}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          )}
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

        {/* Perfil de outra pessoa: chat */}
        {!ehProprio && (
          <TouchableOpacity style={styles.chatBotao} onPress={chamarNoChat}>
            <Text style={styles.chatTexto}>Chamar no chat</Text>
          </TouchableOpacity>
        )}

        {/* Meu perfil: botão pra anunciar */}
        {ehProprio && (
          <TouchableOpacity style={styles.anunciarCard} onPress={anunciar}>
            <Image style={styles.anunciarIcone} source={require('../assets/icones/anuncio.png')}/>
            <View style={styles.anunciarInfo}>
              <Text style={styles.anunciarTitulo}>Anunciar produtos ou materiais</Text>
              <Text style={styles.anunciarSub}>Divulgue seus produtos e alcance mais clientes</Text>
            </View>
            <Text style={styles.setaDireita}>{'>'}</Text>
          </TouchableOpacity>
        )}

        {/* Meu perfil de loja: atalho para o card do Mapa */}
        {ehProprio && ehLoja && (
          <TouchableOpacity style={styles.anunciarCard} onPress={() => navigation.navigate('Configuracoes')}>
            <Image style={styles.anunciarIcone} source={require('../assets/icones/localizacao.png')}/>
            <View style={styles.anunciarInfo}>
              <Text style={styles.anunciarTitulo}>Editar card da loja no Mapa</Text>
              <Text style={styles.anunciarSub}>Foto, nome e endereço que os clientes veem</Text>
            </View>
            <Text style={styles.setaDireita}>{'>'}</Text>
          </TouchableOpacity>
        )}

        {/* Perfil de um autônomo do banco: adicionar a uma obra */}
        {!ehProprio && !!usuario.idProfissional && (
          <View>
            <TouchableOpacity style={styles.anunciarCard} onPress={() => setEscolhendoObra((v) => !v)}>
              <View style={styles.anunciarInfo}>
                <Text style={styles.anunciarTitulo}>Adicionar a uma obra</Text>
                <Text style={styles.anunciarSub}>Escolha em qual das suas obras ele vai trabalhar</Text>
              </View>
              <Text style={styles.setaDireita}>{escolhendoObra ? '⌃' : '⌄'}</Text>
            </TouchableOpacity>

            {escolhendoObra && (
              minhasObras.length === 0 ? (
                <Text style={styles.listaVazia}>Você ainda não tem obras. Crie uma na tela Gerenciar.</Text>
              ) : (
                minhasObras.map((obra) => (
                  <TouchableOpacity
                    key={obra.id}
                    style={styles.obraOpcao}
                    onPress={() => adicionarNaObra(obra)}
                  >
                    <Text style={styles.obraOpcaoNome}>{obra.nome}</Text>
                    <Text style={styles.obraOpcaoSub}>{obra.tipo} • {obra.endereco}</Text>
                  </TouchableOpacity>
                ))
              )
            )}
          </View>
        )}

        {!!usuario.exemplo && (
          <Text style={styles.listaVazia}>Profissional de exemplo: só aparecem aqui os dados básicos dele.</Text>
        )}

        {(ehProprio || itensAVenda.length > 0) && (
          <>
            <View style={styles.divisor} />
            <View style={styles.secaoHeader}>
              <Text style={styles.secaoTitulo}>Itens a venda</Text>
            </View>
            {renderizarLista(itensAVenda)}
          </>
        )}

        {/* Favoritos (só no meu perfil) */}
        {ehProprio && (
          <>
            <View style={styles.secaoHeader}>
              <Text style={styles.secaoTitulo}>Favoritos</Text>
            </View>
            {renderizarLista(favoritos, true)}
          </>
        )}

        {/* Logout (só no meu perfil) */}
        {ehProprio && (
          <TouchableOpacity style={styles.sairBotao} onPress={confirmarSaida}>
            <Text style={styles.sairTexto}>Sair da conta</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <BarraInferior ativo="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  chatBotao: {
    borderWidth: 1,
    borderColor: '#277D2C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  chatTexto: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 13,
  },
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
  botaoVoltar: {
    position: 'absolute',
    left: 16,
  },
  setaVoltar: {
    fontSize: 20,
    color: '#000000',
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  obraOpcao: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  obraOpcaoNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  obraOpcaoSub: {
    fontSize: 11,
    color: '#828282',
    marginTop: 2,
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
  listaVazia: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    marginVertical: 12,
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
  sairBotao: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  sairTexto: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});