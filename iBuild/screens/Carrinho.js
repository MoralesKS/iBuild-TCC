import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { carrinhoStyles as styles } from '../src/Styles';
import { useCarrinho } from '../src/CarrinhoItens';

// Transforma "R$ 1,20" (string) em 1.2 (número), pra dar pra somar
function precoParaNumero(precoTexto) {
  return Number(precoTexto.replace('R$', '').replace(',', '.').trim());
}

export default function Carrinho() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { itens, removerDoCarrinho } = useCarrinho();

  const subtotal = itens.reduce(
    (total, item) => total + precoParaNumero(item.preco) * item.quantidade, 0
  );

  return (
    <View style={styles.container}>
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
        <Text style={styles.carrinhoVazio}>Seu carrinho está vazio.</Text>
      ) : (
        <ScrollView>
          {itens.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image style={styles.itemImagem} source={item.imagem} />
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

      <TouchableOpacity style={styles.botaoPedido}>
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