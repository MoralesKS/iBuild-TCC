import { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api, useUsuario } from '../src/api';
import { useAppNavigation } from '../src/Functions';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

const ICONE_PERFIL = require('../assets/Perfil.png');

export default function Perfil({ route }) {
  const ehProprio = route.name === 'Perfil';
  const idPublico = ehProprio ? null : route.params?.usuarioId;
  return <TelaPerfil key={ehProprio ? 'proprio' : idPublico} ehProprio={ehProprio} idPublico={idPublico} />;
}

function TelaPerfil({ ehProprio, idPublico }) {
  const navigation = useNavigation();
  const { home, mapa, contratar, gerenciar, chat, perfil } = useAppNavigation();
  const { usuario: usuarioLogado, usuarioFirebase, carregando, erroPerfil, recarregarUsuario } = useUsuario();
  const [outro, setOutro] = useState(null);
  const [erroPublico, setErroPublico] = useState(false);
  const [itensAVenda, setItensAVenda] = useState(null);
  const [erroAnuncios, setErroAnuncios] = useState(false);
  const [minhasObras, setMinhasObras] = useState([]);
  const [escolhendoObra, setEscolhendoObra] = useState(false);
  const usuario = ehProprio ? usuarioLogado : outro;
  const idUsuarioLogado = usuarioLogado?.idUsuario;
  const idPerfil = ehProprio ? idUsuarioLogado : idPublico;

  useFocusEffect(useCallback(() => {
    if (!idPerfil) return;
    let ativo = true;
    setErroAnuncios(false);
    api.produtos(idPerfil)
      .then((itens) => { if (ativo) setItensAVenda(itens); })
      .catch(() => { if (ativo) setErroAnuncios(true); });

    if (!ehProprio) {
      setErroPublico(false);
      api.usuario(idPerfil)
        .then((dados) => { if (ativo) setOutro(dados); })
        .catch(() => { if (ativo) setErroPublico(true); });
      if (idUsuarioLogado) {
        api.obras(idUsuarioLogado)
          .then((obras) => { if (ativo) setMinhasObras(obras); })
          .catch(() => { if (ativo) setMinhasObras([]); });
      }
    }
    return () => { ativo = false; };
  }, [ehProprio, idPerfil, idUsuarioLogado]));

  async function adicionarNaObra(obra) {
    try {
      await api.adicionarProfissional(obra.id, usuario.idProfissional, usuario.profissao);
      alert(`${usuario.nome} foi adicionado à obra ${obra.nome}`);
      setEscolhendoObra(false);
    } catch (e) { alert(e.message); }
  }

  function abrirProduto(produto) {
    navigation.navigate('Produto', { produto });
  }

  const nome = usuario?.nome || (ehProprio ? usuarioFirebase?.displayName || 'Sua conta' : null);
  const email = ehProprio ? usuarioFirebase?.email || usuario?.email : null;
  const telefone = ehProprio ? usuario?.telefone : null;
  const identificacao = [usuario?.rotuloPerfil, usuario?.profissao].filter(Boolean).join(' • ');
  const dadosPrivados = [
    ['CPF', usuario?.cpf],
    ['CNPJ', usuario?.cnpj],
    ['Data de nascimento', usuario?.dataNascimento],
    ['Responsável pela empresa', usuario?.nomeResponsavel],
  ].filter(([, valor]) => valor);
  const carregandoPerfil = ehProprio ? carregando : Boolean(idPublico && !outro && !erroPublico);
  const falhaPerfil = ehProprio ? Boolean(erroPerfil) : !idPublico || erroPublico;
  const podeAdicionarNaObra = !ehProprio && usuario?.idProfissional && idUsuarioLogado && idUsuarioLogado !== idPublico;

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.titulo}>{ehProprio ? 'Meu Perfil' : 'Perfil profissional'}</Text>
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {nome && (
          <View style={styles.perfilRow}>
            <Image style={styles.avatar} source={usuario?.foto || ICONE_PERFIL} />
            <View style={styles.perfilInfo}>
              <Text style={styles.nome}>{nome}</Text>
              {identificacao ? <Text style={styles.profissao}>{identificacao}</Text> : null}
              {usuario?.cidade ? (
                <View style={styles.localRow}>
                  <Image style={styles.iconePequeno} source={require('../assets/icones/localizacao.png')} />
                  <Text style={styles.localTexto}>{usuario.cidade}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {Boolean(email || telefone) && (
          <View style={styles.contato}>
            {email ? (
              <View style={styles.contatoItem}>
                <Image style={styles.contatoIcone} source={require('../assets/icones/email.png')} />
                <Text style={styles.contatoTexto}>{email}</Text>
              </View>
            ) : null}
            {telefone ? (
              <View style={styles.contatoItem}>
                <Image style={styles.contatoIcone} source={require('../assets/icones/telefone.png')} />
                <Text style={styles.contatoTexto}>{telefone}</Text>
              </View>
            ) : null}
          </View>
        )}

        {ehProprio && dadosPrivados.map(([rotulo, valor]) => (
          <View key={rotulo} style={styles.dadoPrivado}>
            <Text style={styles.dadoRotulo}>{rotulo}</Text>
            <Text style={styles.contatoTexto}>{valor}</Text>
          </View>
        ))}

        {usuario?.bio ? <Text style={styles.bio}>{usuario.bio}</Text> : null}

        {carregandoPerfil && <Text style={styles.aviso}>Carregando perfil...</Text>}
        {falhaPerfil && (
          <View style={styles.aviso}>
            <Text style={styles.profissao}>Não foi possível carregar os dados do perfil.</Text>
            {ehProprio && (
              <TouchableOpacity accessibilityRole="button" onPress={recarregarUsuario} style={styles.anunciarCard}>
                <Text style={styles.anunciarTitulo}>Tentar novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {usuario && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValor}>{itensAVenda?.length ?? '—'}</Text>
              <Text style={styles.statLabel}>Produtos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValor}>{usuario.avaliacoes}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValor}>
                {usuario.avaliacoes > 0 ? <><Text style={styles.estrela}>★ </Text>{usuario.notaMedia}</> : '—'}
              </Text>
              <Text style={styles.statLabel}>Nota média</Text>
            </View>
          </View>
        )}

        {Boolean(podeAdicionarNaObra) && (
          <View>
            <TouchableOpacity style={styles.anunciarCard} onPress={() => setEscolhendoObra((v) => !v)}>
              <View style={styles.anunciarInfo}>
                <Text style={styles.anunciarTitulo}>Adicionar a uma obra</Text>
                <Text style={styles.anunciarSub}>Escolha em qual das suas obras ele vai trabalhar</Text>
              </View>
            </TouchableOpacity>
            {escolhendoObra && (minhasObras.length === 0
              ? <Text style={styles.anunciarSub}>Você ainda não tem obras.</Text>
              : minhasObras.map((o) => (
                  <TouchableOpacity key={o.id} style={styles.anunciarCard} onPress={() => adicionarNaObra(o)}>
                    <Text style={styles.anunciarTitulo}>{o.nome}</Text>
                  </TouchableOpacity>
                )))}
          </View>
        )}

        {usuario && (
          <View>
            <View style={styles.divisor} />
            <Text style={styles.secaoTitulo}>Itens à venda</Text>
            {erroAnuncios ? <Text style={styles.profissao}>Não foi possível carregar os anúncios.</Text> : (
              itensAVenda?.length ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {itensAVenda.map((produto) => (
                    <TouchableOpacity key={produto.id} style={styles.produtoCard} onPress={() => abrirProduto(produto)}>
                      {produto.imagem
                        ? <Image style={styles.produtoImagem} source={produto.imagem} />
                        : <View style={styles.produtoImagem} />}
                      <Text style={styles.produtoNome} numberOfLines={1}>{produto.nome}</Text>
                      <Text style={styles.produtoPreco}>{produto.preco} / un.</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.profissao}>{itensAVenda ? 'Nenhum anúncio publicado.' : 'Carregando anúncios...'}</Text>
              )
            )}
          </View>
        )}
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

        <TouchableOpacity style={styles.footerItem} onPress={perfil} accessibilityRole="button" accessibilityLabel="Meu perfil">
          <Image style={ehProprio ? styles.footerIcone1 : styles.footerIcone} source={ICONE_PERFIL} />
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
  perfilRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfilInfo: {
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    marginRight: 16,
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
  contato: {
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
    flexShrink: 1,
    fontSize: 13,
    color: '#000000',
  },
  dadoPrivado: {
    marginTop: 8,
  },
  dadoRotulo: {
    color: '#666666',
    fontSize: 12,
  },
  aviso: {
    marginTop: 16,
    color: '#666666',
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
  divisor: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
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
