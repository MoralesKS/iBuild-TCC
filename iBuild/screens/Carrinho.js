import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { useCarrinho } from '../src/CarrinhoItens';

const METODOS_PAGAMENTO = ['Pix (demonstração)', 'Cartão de crédito (demonstração)', 'Dinheiro na entrega (demonstração)'];
const CUPOM_DEMO = 'IBUILD10';
const FRETE_DEMO = 12.9;

function precoParaNumero(precoTexto) {
  return Number(String(precoTexto).replace('R$', '').replace(',', '.').trim()) || 0;
}

export default function Carrinho() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { itens, removerDoCarrinho, atualizarQuantidade } = useCarrinho();
  const [endereco, setEndereco] = useState('');
  const [enderecoRascunho, setEnderecoRascunho] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [mensagemCupom, setMensagemCupom] = useState('');

  const subtotal = itens.reduce((total, item) => total + precoParaNumero(item.preco) * item.quantidade, 0);
  const frete = endereco ? FRETE_DEMO : 0;
  const total = Math.max(0, subtotal + frete - desconto);

  function aplicarCupom() {
    if (cupom.trim().toUpperCase() !== CUPOM_DEMO) {
      setDesconto(0);
      setMensagemCupom('Cupom inválido ou expirado.');
      return;
    }
    const novoDesconto = Number((subtotal * 0.1).toFixed(2));
    setDesconto(novoDesconto);
    setMensagemCupom(`Cupom aplicado. Desconto de R$ ${novoDesconto.toFixed(2).replace('.', ',')}.`);
  }

  function finalizarPedido() {
    if (itens.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione um item antes de continuar.');
      return;
    }
    if (!endereco.trim() || !metodoPagamento) {
      Alert.alert('Faltam dados', 'Informe um endereço e selecione uma forma de pagamento de demonstração.');
      return;
    }
    Alert.alert('Pedido demonstrativo', 'Os dados foram validados. Nenhum pagamento foi processado e o pedido não foi gravado no banco.');
  }

  function alterarQuantidade(item, delta) {
    atualizarQuantidade(item.id, item.quantidade + delta);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={home}><Text>{'<'}</Text></TouchableOpacity>
      <Text style={styles.titulo}>Finalizar compra</Text>
      <Text style={styles.avisoDemo}>Modo de demonstração. Endereço, pagamento, frete e cupom ficam só nesta sessão.</Text>

      <TouchableOpacity style={styles.linha} onPress={() => { setEnderecoRascunho(endereco); setModalEndereco(true); }}>
        <Text style={styles.label}>Entrega</Text><Text style={styles.valor}>{endereco || 'Adicionar endereço  ›'}</Text>
      </TouchableOpacity>
      <View style={styles.linha}><Text style={styles.label}>Frete estimado</Text><Text style={styles.valor}>{endereco ? `R$ ${FRETE_DEMO.toFixed(2).replace('.', ',')}` : 'Informe o endereço'}</Text></View>
      <TouchableOpacity style={styles.linha} onPress={() => setModalPagamento(true)}>
        <Text style={styles.label}>Pagamento</Text><Text style={styles.valor}>{metodoPagamento || 'Selecionar forma  ›'}</Text>
      </TouchableOpacity>

      <Text style={styles.tituloSecao}>Cupom de demonstração</Text>
      <View style={styles.cupomLinha}>
        <TextInput style={styles.cupomInput} value={cupom} onChangeText={setCupom} placeholder="Digite IBUILD10" autoCapitalize="characters" />
        <TouchableOpacity style={styles.botaoCupom} onPress={aplicarCupom}><Text style={styles.botaoTexto}>Aplicar</Text></TouchableOpacity>
      </View>
      {mensagemCupom ? <Text style={styles.mensagem}>{mensagemCupom}</Text> : null}

      <Text style={styles.tituloSecao}>Itens</Text>
      {itens.length === 0 ? <Text style={styles.carrinhoVazio}>Seu carrinho está vazio.</Text> : (
        <ScrollView style={styles.listaItens}>
          {itens.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              {item.imagem ? <Image style={styles.itemImagem} source={item.imagem} /> : <View style={styles.itemImagem} />}
              <View style={styles.itemInfo}><Text style={styles.itemNome}>{item.nome}</Text><Text>{item.preco}</Text></View>
              <View style={styles.controleQtd}>
                <TouchableOpacity onPress={() => alterarQuantidade(item, -1)}><Text style={styles.controleTexto}>−</Text></TouchableOpacity>
                <Text>{item.quantidade}</Text>
                <TouchableOpacity onPress={() => alterarQuantidade(item, 1)}><Text style={styles.controleTexto}>+</Text></TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}><Text style={styles.itemRemover}>Remover</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.linha}><Text style={styles.label}>Subtotal</Text><Text>R$ {subtotal.toFixed(2).replace('.', ',')}</Text></View>
      <View style={styles.linha}><Text style={styles.label}>Frete</Text><Text>R$ {frete.toFixed(2).replace('.', ',')}</Text></View>
      <View style={styles.linha}><Text style={styles.label}>Desconto</Text><Text>R$ {desconto.toFixed(2).replace('.', ',')}</Text></View>
      <View style={styles.linha}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalLabel}>R$ {total.toFixed(2).replace('.', ',')}</Text></View>
      <TouchableOpacity style={styles.botaoPedido} onPress={finalizarPedido}><Text style={styles.botaoTexto}>Validar pedido demonstrativo</Text></TouchableOpacity>

      <View style={styles.footer}>
        {[[require('../assets/Home.png'), home], [require('../assets/gerenciar.png'), gerenciar], [require('../assets/Bussola.png'), mapa], [require('../assets/Trabalho.png'), contratar], [require('../assets/Chat.png'), chat], [require('../assets/Perfil.png'), perfil]].map(([icone, acao], indice) => (
          <TouchableOpacity key={indice} style={styles.footerItem} onPress={acao}><Image style={styles.footerIcone} source={icone} /></TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalEndereco} transparent animationType="fade" onRequestClose={() => setModalEndereco(false)}>
        <View style={styles.modalFundo}><View style={styles.modalCard}>
          <Text style={styles.tituloSecao}>Endereço de entrega</Text>
          <TextInput style={styles.enderecoInput} value={enderecoRascunho} onChangeText={setEnderecoRascunho} placeholder="Rua, número, bairro e cidade" />
          <TouchableOpacity style={styles.botaoPedido} onPress={() => { if (!enderecoRascunho.trim()) { Alert.alert('Endereço necessário', 'Preencha o endereço para salvar.'); return; } setEndereco(enderecoRascunho.trim()); setModalEndereco(false); }}><Text style={styles.botaoTexto}>Salvar nesta sessão</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setModalEndereco(false)}><Text style={styles.fechar}>Cancelar</Text></TouchableOpacity>
        </View></View>
      </Modal>
      <Modal visible={modalPagamento} transparent animationType="fade" onRequestClose={() => setModalPagamento(false)}>
        <View style={styles.modalFundo}><View style={styles.modalCard}>
          <Text style={styles.tituloSecao}>Forma de pagamento demonstrativa</Text>
          {METODOS_PAGAMENTO.map((metodo) => <TouchableOpacity key={metodo} style={styles.opcaoPagamento} onPress={() => { setMetodoPagamento(metodo); setModalPagamento(false); }}><Text>{metodo === metodoPagamento ? '● ' : '○ '}{metodo}</Text></TouchableOpacity>)}
          <TouchableOpacity onPress={() => setModalPagamento(false)}><Text style={styles.fechar}>Fechar</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, paddingTop: '10%' },
  titulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  avisoDemo: { fontSize: 11, color: '#8A4B08', backgroundColor: '#FFF3E0', padding: 8, borderRadius: 6, marginBottom: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { color: '#666', fontSize: 13 }, valor: { fontSize: 13, color: '#111', maxWidth: '65%', textAlign: 'right' },
  tituloSecao: { fontWeight: 'bold', fontSize: 15, marginTop: 12, marginBottom: 8 },
  cupomLinha: { flexDirection: 'row', gap: 8 }, cupomInput: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, height: 40 },
  botaoCupom: { backgroundColor: '#277D2C', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  mensagem: { fontSize: 12, color: '#555', marginTop: 5 }, carrinhoVazio: { color: '#828282', paddingVertical: 12 }, listaItens: { maxHeight: 220 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 8 }, itemImagem: { width: 42, height: 42, borderRadius: 6, backgroundColor: '#F0F0F0' },
  itemInfo: { flex: 1 }, itemNome: { fontSize: 12, fontWeight: '500' }, controleQtd: { flexDirection: 'row', gap: 9, alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  controleTexto: { fontSize: 18, color: '#277D2C' }, itemRemover: { color: '#D32F2F', fontSize: 11 }, totalLabel: { fontSize: 15, fontWeight: 'bold' },
  botaoPedido: { backgroundColor: '#F57C00', minHeight: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, padding: 8 }, botaoTexto: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', marginTop: 'auto' }, footerItem: { flex: 1, alignItems: 'center', paddingVertical: 8 }, footerIcone: { height: 23, width: 23, tintColor: '#9C9C9C' },
  modalFundo: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 24 }, modalCard: { backgroundColor: 'white', borderRadius: 12, padding: 18 }, enderecoInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, minHeight: 44 }, opcaoPagamento: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }, fechar: { color: '#277D2C', textAlign: 'center', padding: 12 },
});
