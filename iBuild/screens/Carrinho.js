import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView} from 'react-native';

export default function Carrinho() {
  const itens = [
    { marca: 'Marca', nome: 'Areia Fina - Saco', preco: 'R$10,99', quantidade: '02' },
    { marca: 'Marca', nome: 'Tijolo Cerâmico', preco: 'R$8,99', quantidade: '10' },
    { marca: 'Marca', nome: 'Cimento Caue', preco: 'R$8,99', quantidade: '04' },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerView}>
        <TouchableOpacity style={styles.voltarBotao}>
          <Text style={styles.voltarSeta}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Finalizar compra</Text>
        <View style={styles.voltarBotao} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ENTREGA */}
        <Text style={styles.rotulo}>ENTREGA</Text>
        <TextInput style={styles.linhaInfo}
          placeholder="Adicionar endereço de entrega"
          placeholderTextColor="#828282"
        />

        {/* FRETE */}
        <Text style={styles.rotulo}>FRETE</Text>
        <View style={styles.linhaInfo}>
          <Text style={styles.linhaInfoValor}>Gratuito</Text>
          <Text style={styles.linhaInfoSub}>Padrão | 3 a 4 dias</Text>
        </View>

        {/* PAGAMENTO */}
        <Text style={styles.rotulo}>PAGAMENTO</Text>
        <TouchableOpacity style={styles.linhaInfo}>
          <Text style={styles.linhaInfoValor}>Visa *1234</Text>
        </TouchableOpacity>

        {/* PROMOÇÕES */}
        <Text style={styles.rotulo}>PROMOÇÕES</Text>
        <TextInput
          style={styles.linhaInfo}
          placeholder="Aplicar código promocional"
          placeholderTextColor="#828282"
        />

        {/* ITENS */}
        <View style={styles.itensHeaderRow}>
          <Text style={styles.rotulo}>DESCRIÇÃO</Text>
          <Text style={styles.rotulo}>PREÇO</Text>
        </View>

        {itens.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemImagem}>
              {/* IMAGEM: {item.nome} */}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemMarca}>{item.marca}</Text>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemDescricao}>Descrição</Text>
              <View style={styles.itemQuantidadeRow}>
                <Text style={styles.itemQuantidade}>Quantidade: {item.quantidade}</Text>
                <Text style={styles.itemQuantidadeBotoes}> + / - </Text>
              </View>
            </View>
            <Text style={styles.itemPreco}>{item.preco}</Text>
          </View>
        ))}

        {/* RESUMO */}
        <View style={styles.resumoLinha}>
          <Text style={styles.resumoTexto}>Subtotal (3)</Text>
          <Text style={styles.resumoTexto}>R$19,98</Text>
        </View>
        <View style={styles.resumoLinha}>
          <Text style={styles.resumoTexto}>Total do frete</Text>
          <Text style={styles.resumoTexto}>Gratuito</Text>
        </View>
        <View style={styles.resumoLinha}>
          <Text style={styles.resumoTexto}>Impostos</Text>
          <Text style={styles.resumoTexto}>R$2.00</Text>
        </View>
        <View style={styles.resumoLinha}>
          <Text style={styles.resumoTotalTexto}>Total</Text>
          <Text style={styles.resumoTotalTexto}>R$21,98</Text>
        </View>
      </ScrollView>

      {/* BOTÃO FAZER PEDIDO */}
      <TouchableOpacity style={styles.fazerPedido}>
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Fazer pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  voltarBotao: {
    width: 24,
  },
  voltarSeta: {
    fontSize: 18,
    color: '#000000',
  },
  headerTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  rotulo: {
    fontSize: 11,
    color: '#828282',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  linhaInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  linhaInfoValor: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  linhaInfoSub: {
    color: '#828282',
    fontSize: 12,
    marginTop: 2,
  },
  itensHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  itemImagem: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemMarca: {
    fontSize: 10,
    color: '#828282',
  },
  itemNome: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemDescricao: {
    fontSize: 11,
    color: '#828282',
  },
  itemQuantidadeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  itemQuantidade: {
    fontSize: 11,
    color: '#828282',
  },
  itemQuantidadeBotoes: {
    fontSize: 11,
    color: '#F57C00',
    marginLeft: 8,
  },
  itemPreco: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  resumoTexto: {
    fontSize: 13,
    color: '#000000',
  },
  resumoTotalTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  fazerPedido: {
    backgroundColor: '#F57C00',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
});
