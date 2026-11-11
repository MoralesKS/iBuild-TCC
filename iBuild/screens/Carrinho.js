import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { useCarrinho } from '../src/CarrinhoItens';
import { api, useUsuario } from '../src/api';
import FotoProduto from '../src/FotoProduto';
import { useAreaSegura } from '../src/responsivo';

// Transforma "R$ 1,20" (string) em 1.2 (número), pra dar pra somar
function precoParaNumero(precoTexto) {
  return Number(precoTexto.replace('R$', '').replace(',', '.').trim());
}

export default function Carrinho() {
  const areaSegura = useAreaSegura();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { itens, removerDoCarrinho } = useCarrinho();
  const { usuario } = useUsuario();

  const subtotal = itens.reduce(
    (total, item) => total + precoParaNumero(item.preco) * item.quantidade, 0
  );

  async function fazerPedido() {
    const reais = itens.filter((i) => i.idAnuncio);   // produtos que vieram do banco
    if (reais.length === 0) {
      alert('Comprou!!');                              // produtos de exemplo: comportamento antigo
      return;
    }
    if (!usuario) { alert('Entre na sua conta novamente.'); return; }
    try {
      await api.fazerPedido(
        usuario.idUsuario,
        reais.map((i) => ({ id_anuncio: i.idAnuncio, quantidade: i.quantidade }))
      );
      reais.forEach((i) => removerDoCarrinho(i.id));
      alert('Pedido realizado!');
      home();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <View style={[styles.container, areaSegura, areaSegura]}>
      <TouchableOpacity onPress={home}>
        <Text>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Finalizar compra</Text>

      <View style={styles.linha}>
        <Text style={styles.label}>Entrega</Text>
        <Text style={styles.valor}>Adicionar endereço {'>'}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Frete</Text>
        <Text style={styles.valor}>Gratuito {'>'}</Text>
      </View>

      <View style={styles.linha}>
        <Text style={styles.label}>Pagamento</Text>
        <Text style={styles.valor}>Visa *1234 {'>'}</Text>
      </View>

      <Text style={styles.tituloSecao}>Itens</Text>

      {itens.length === 0 ? (
        <View style={styles.itemInfo}> 
          <Text style={styles.carrinhoVazio}>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <ScrollView>
          {itens.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <FotoProduto style={styles.itemImagem} source={item.imagem} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemQuantidade}>Quantidade: {item.quantidade}</Text>
              </View>
              <Text style={styles.itemPreco}>{item.preco}</Text>
              <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}>
                <Text style={styles.itemRemover}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.linha}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValor}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
      </View>

      <TouchableOpacity style={styles.botaoPedido} onPress={fazerPedido}>
        <Text style={styles.botaoTexto}>Fazer pedido</Text>
      </TouchableOpacity>

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
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    color: '#828282',
    fontSize: 13,
  },
  valor: {
    fontSize: 13,
    color: '#000000',
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  carrinhoVazio: {
    fontSize: 13,
    color: '#828282',
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImagem: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemQuantidade: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  itemRemover: {
    fontSize: 12,
    color: '#D32F2F',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoPedido: {
    backgroundColor: '#F57C00',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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