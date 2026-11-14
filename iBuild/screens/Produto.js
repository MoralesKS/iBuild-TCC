import Avaliacao from '../componentes/Avaliacao';
import { voltar } from '../src/navegacao';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, Image, Linking, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppNavigation } from '../src/Functions';
import { useCarrinho } from '../src/CarrinhoItens';
import { api, useUsuario } from '../src/api';
import { useLayout } from '../src/responsivo';
import FotoProduto from '../src/FotoProduto';
import BarraInferior from '../src/BarraInferior';
import { garantirConversa, useConversas } from './Chat1';
import { useAreaSegura } from '../src/responsivo';
import { verificarFavorito, alternarFavorito as alternarFavoritoStorage } from '../src/Favoritos';

export default function Produto() {
  const conversas = useConversas();
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();
  const route = useRoute();
  const { home, chat, carrinho } = useAppNavigation();
  const { adicionarAoCarrinho } = useCarrinho();
  const { usuario } = useUsuario();
  const { larguraUtil } = useLayout();

  // O produto selecionado pela navegação é a fonte da verdade.
  const produtoRecebido = route.params?.produto;
  const [produto, setProduto] = useState(produtoRecebido || null);
  const [erroProduto, setErroProduto] = useState('');
  const [tentativa,setTentativa] = useState(0);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    let ativo = true;
    if (produtoRecebido) {
      setErroProduto('');
      setProduto(produtoRecebido);
      setFotoIndex(0);
      if (produtoRecebido.idAnuncio) {
        api.produto(produtoRecebido.idAnuncio)
          .then((atualizado) => { if (ativo) setProduto(atualizado); })
          .catch((e) => { if (ativo) {setProduto(null);setErroProduto(e.message);} });
      }
    }
    return () => { ativo = false; };
  }, [produtoRecebido?.id, produtoRecebido?.idAnuncio, tentativa]);

  useEffect(() => {
    let ativo = true;
    if (!produto) return;
    verificarFavorito(usuario?.idUsuario, produto).then((valor) => { if (ativo) setFavorito(valor); });
    return () => { ativo = false; };
  }, [usuario?.idUsuario, produto?.id]);

  async function alternarFavorito() {
    const novoValor = await alternarFavoritoStorage(usuario?.idUsuario, produto);
    setFavorito(novoValor);
  }

  if (!produto) return <View style={[styles.container,areaSegura]}><Text>{erroProduto || 'Produto indisponível.'}</Text><TouchableOpacity onPress={()=>setTentativa(t=>t+1)}><Text>Tentar novamente</Text></TouchableOpacity><TouchableOpacity onPress={()=>voltar(navigation)}><Text>Voltar</Text></TouchableOpacity></View>;
  // Só quem publicou o anúncio vê o botão de editar
  const ehDono = !!usuario && !!produto.idVendedor && produto.idVendedor === usuario.idUsuario;

  // Carrossel: capa + fotos extras (produtos de exemplo têm só a imagem principal)
  const galeria = [produto.imagem, ...(produto.fotos || []).map((f) => f.imagem)].filter(Boolean);
  const dados = galeria.length > 0 ? galeria : [null];
  const larguraFoto = larguraUtil - 32; // a tela tem 16 de margem em cada lado
  const alturaFoto = Math.round(larguraFoto * 0.75);
  const indiceAtual = fotoIndex < dados.length ? fotoIndex : 0;

  function comprarAgora() {
    adicionarAoCarrinho(produto);
    carrinho();
  }

  function abrirWhatsApp() {
    const numeros = produto.contato.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/55${numeros}`).catch(() => alert('Não consegui abrir o WhatsApp.'));
  }

  // Abre (ou cria) a conversa com quem vende o produto
  function chamarNoChat() {
    const id = garantirConversa(conversas, {
      id: produto.idVendedor ? `u-${produto.idVendedor}` : `demo-${produto.vendedor}`,
      nome: produto.vendedor,
      status: 'Vendedor',
      saudacao: `Olá! Aqui é da ${produto.vendedor}. Posso ajudar com o produto "${produto.nome}"?`,
      padrao: 'Recebi sua mensagem! Já te respondo sobre o produto.',
    });
    navigation.navigate('Chat 2', { conversaId: id });
  }

  return (
    <View style={[styles.container, areaSegura]}>

      {/* Cabeçalho */}
      <TouchableOpacity onPress={() => voltar(navigation)}>
        <Text style={styles.seta}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Carrossel de fotos (deslize para o lado) */}
        <View>
          <FlatList
            key={`carrossel-${produto.id}-${dados.length}`}
            data={dados}
            keyExtractor={(_, indice) => String(indice)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, indice) => ({ length: larguraFoto, offset: larguraFoto * indice, index: indice })}
            onMomentumScrollEnd={(e) => setFotoIndex(Math.round(e.nativeEvent.contentOffset.x / larguraFoto))}
            style={{ width: larguraFoto, alignSelf: 'center' }}
            renderItem={({ item }) => (
              <FotoProduto
                source={item}
                style={{ width: larguraFoto, height: alturaFoto, borderRadius: 12, backgroundColor: '#F5F5F5' }}
              />
            )}
          />
          {dados.length > 1 && (
            <>
              <View style={styles.contadorFotos}>
                <Text style={styles.contadorFotosTexto}>{indiceAtual + 1}/{dados.length}</Text>
              </View>
              <View style={styles.pontos}>
                {dados.map((_, indice) => (
                  <View key={indice} style={[styles.ponto, indice === indiceAtual && styles.pontoAtivo]} />
                ))}
              </View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.favoritoBotao} onPress={alternarFavorito}>
          <Text style={styles.favoritoTexto}>{favorito ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos'}</Text>
        </TouchableOpacity>

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
        <Avaliacao tipo="produto" id={produto.idAnuncio} dono={produto.idVendedor} onAtualizar={r=>setProduto(p=>({...p,avaliacao:r.media,numAvaliacoes:r.quantidade}))} />
        <TouchableOpacity style={styles.vendedorCard} onPress={() => navigation.push('PerfilAutonomo', { usuarioId: produto.idVendedor })}>
          <View style={[styles.vendedorIcone, {justifyContent: 'center', alignItems: 'center'}]}>
            <Image style={{height: 25, width: 25, tintColor: '#000000'}} source={require('../assets/empresas.png')}/>
          </View>
          <View style={styles.vendedorInfo}>
            <Text style={styles.vendedorNome}>Vendedor: {produto.vendedor}</Text>
            <Text style={styles.vendedorLocal}>{produto.local}</Text>
          </View>
          <Text style={styles.setaDireita}>{'>'}</Text>
        </TouchableOpacity>

        {/* Contato (toque para abrir o WhatsApp) */}
        {!!produto.contato && (
          <TouchableOpacity style={styles.contatoCard} onPress={abrirWhatsApp}>
            <Image style={styles.contatoIcone} source={require('../assets/icones/whatsapp.png')}/>
            <Text style={styles.contatoTexto}>Contato: {produto.contato}</Text>
            <Text style={styles.setaDireita}>{'>'}</Text>
          </TouchableOpacity>
        )}

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
          {ehDono ? (
            <>
            <TouchableOpacity
              style={styles.editarBotao}
              onPress={() => navigation.navigate('EditarAnuncio', { produto })}
            >
              <Text style={styles.comprarTexto}>Editar anúncio</Text>
            </TouchableOpacity>
            {produto.idAnuncio && (
              <TouchableOpacity style={styles.removerBotao} onPress={() => {
                Alert.alert('Remover produto', 'Deseja retirar este produto do catálogo?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Remover', style: 'destructive', onPress: async () => {
                    try { await api.excluirAnuncio(produto.idAnuncio, usuario.idUsuario); navigation.navigate('Home'); }
                    catch (e) { alert(e.message); }
                  } },
                ]);
              }}>
                <Text style={styles.removerTexto}>Remover do catálogo</Text>
              </TouchableOpacity>
            )}
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.chatBotao} onPress={chamarNoChat}>
                <Text style={styles.chatTexto}>Chamar no chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.comprarBotao} onPress={comprarAgora}>
                <Text style={styles.comprarTexto}>Comprar agora</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>

      <BarraInferior ativo="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  favoritoBotao: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12, marginTop: 6 },
  favoritoTexto: { color: '#277D2C', fontWeight: 'bold', fontSize: 13 },
  removerBotao: { flex: 1, borderWidth: 1, borderColor: '#C62828', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 8 },
  removerTexto: { color: '#C62828', fontWeight: 'bold' },
  contadorFotos: {
    position: 'absolute',
    top: 10,
    right: 26,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  contadorFotosTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  ponto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 3,
  },
  pontoAtivo: {
    backgroundColor: '#F57C00',
    width: 18,
  },
  galeriaRow: {
    marginTop: 10,
  },
  miniatura: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  miniaturaAtiva: {
    borderColor: '#F57C00',
  },
  contatoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  contatoIcone: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  contatoTexto: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
  },
  editarBotao: {
    flex: 1,
    backgroundColor: '#F57C00',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    height: '30%',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
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
});
