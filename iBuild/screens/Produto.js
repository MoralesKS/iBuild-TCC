import { useCallback, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, Linking, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAppNavigation, produtos } from '../src/Functions';
import { useCarrinho } from '../src/CarrinhoItens';
import { api, useUsuario } from '../src/api';
import BarraInferior from '../src/BarraInferior';

export default function Produto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { home, chat, carrinho } = useAppNavigation();
  const { adicionarAoCarrinho } = useCarrinho();
  const { usuario } = useUsuario();

  // route.params.produto vem do navigation.navigate('Produto', { produto }).
  // O "|| produtos[0]" é só um plano B pra tela não quebrar se abrir sem clique.
  const [produto, setProduto] = useState(route.params?.produto || produtos[0]);
  const [fotoIndex, setFotoIndex] = useState(0);

  // Chegou um produto novo pela navegação (ex.: depois de editar): usa ele
  useEffect(() => {
    if (route.params?.produto) {
      setProduto(route.params.produto);
      setFotoIndex(0);
    }
  }, [route.params?.produto]);

  // Produto do banco: busca a versão mais recente sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (produto.idAnuncio) {
        api.produto(produto.idAnuncio).then(setProduto).catch((e) => console.log(e.message));
      }
    }, [produto.idAnuncio])
  );

  // Só quem publicou o anúncio vê o botão de editar
  const ehDono = !!usuario && !!produto.idVendedor && produto.idVendedor === usuario.idUsuario;

  // Capa + fotos extras (produtos de exemplo têm só a imagem principal)
  const galeria = [produto.imagem, ...(produto.fotos || []).map((f) => f.imagem)].filter(Boolean);
  const fotoPrincipal = galeria[fotoIndex] || produto.imagem;

  function comprarAgora() {
    adicionarAoCarrinho(produto);
    carrinho();
  }

  function abrirWhatsApp() {
    const numeros = produto.contato.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/55${numeros}`).catch(() => alert('Não consegui abrir o WhatsApp.'));
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <TouchableOpacity onPress={home}>
        <Text style={styles.seta}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Imagem do produto */}
        <Image style={styles.imagemProduto} source={fotoPrincipal} />

        {galeria.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galeriaRow}>
            {galeria.map((imagem, indice) => (
              <TouchableOpacity key={indice} onPress={() => setFotoIndex(indice)}>
                <Image
                  style={[styles.miniatura, fotoIndex === indice && styles.miniaturaAtiva]}
                  source={imagem}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
        <TouchableOpacity style={styles.vendedorCard}>
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
            <TouchableOpacity
              style={styles.editarBotao}
              onPress={() => navigation.navigate('EditarAnuncio', { produto })}
            >
              <Text style={styles.comprarTexto}>Editar anúncio</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.chatBotao} onPress={chat}>
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