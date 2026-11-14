import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { voltar } from '../src/navegacao';
import { api, useUsuario } from '../src/api';
import BottomBar from '../componentes/BottomBar';
import { useAreaSegura } from '../src/responsivo';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { useCarrinho } from '../src/CarrinhoItens';

const METODOS_PAGAMENTO = ['Pix', 'Cartão de crédito', 'Dinheiro na entrega'];
const CUPOM_DEMO = 'IBUILD10';
const FRETE_DEMO = 12.9;

function precoParaNumero(precoTexto) {
  return Number(String(precoTexto).replace('R$', '').replace(',', '.').trim()) || 0;
}

export default function Carrinho() {
  const navigation = useNavigation();
  const {usuario} = useUsuario();
  const [enviando,setEnviando]=useState(false);
  const [pendente,setPendente]=useState(null);
  const [carregandoTentativa,setCarregandoTentativa]=useState(true);
  const trava=useRef(false);
  const [erroTentativa,setErroTentativa]=useState('');
  const [reler,setReler]=useState(0);
  const armazenamento=`ibuild-pedido-pendente-${usuario?.idUsuario}`;
  useEffect(()=>{let ativo=true;setCarregandoTentativa(true);setErroTentativa('');
    AsyncStorage.getItem(armazenamento).then(v=>{if(ativo)setPendente(v?JSON.parse(v):null);})
      .catch(()=>setErroTentativa('Não foi possível recuperar a tentativa anterior. Tente novamente antes de confirmar.'))
      .finally(()=>{if(ativo)setCarregandoTentativa(false);});
    return ()=>{ativo=false;};
  },[armazenamento,reler]);
  const areaSegura = useAreaSegura();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { itens, removerDoCarrinho, atualizarQuantidade, confirmarItens } = useCarrinho();
  const [endereco, setEndereco] = useState('');
  const [recebimento,setRecebimento]=useState('entrega');
  const [enderecoRascunho, setEnderecoRascunho] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [mensagemCupom, setMensagemCupom] = useState('');

  const subtotal = itens.reduce((total, item) => total + precoParaNumero(item.preco) * item.quantidade, 0);
  const frete = recebimento==='entrega' && endereco ? FRETE_DEMO : 0;
  const desconto = cupomAplicado ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const total = Math.max(0, subtotal + frete - desconto);

  function aplicarCupom() {
    if (cupom.trim().toUpperCase() !== CUPOM_DEMO) {
      setCupomAplicado(false);
      setMensagemCupom('Cupom inválido ou expirado.');
      return;
    }
    const novoDesconto = Number((subtotal * 0.1).toFixed(2));
    setCupomAplicado(true);
    setMensagemCupom(`Cupom aplicado: 10% sobre o subtotal.`);
  }

  async function finalizarPedido() {
    if(trava.current || carregandoTentativa || erroTentativa || !usuario)return;
    if (!pendente && !itens.length) return Alert.alert('Carrinho vazio','Adicione um produto.');
    if (!pendente && ((recebimento==='entrega' && !endereco.trim()) || !metodoPagamento)) return Alert.alert('Faltam dados','Informe endereço e forma de pagamento pretendida. Nenhuma cobrança será realizada.');
    trava.current=true;setEnviando(true);
    try {
      const tentativa=pendente || {
        chave:`pedido-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`,
        endereco,recebimento,metodo:metodoPagamento,cupom:cupomAplicado?'IBUILD10':'',
        itens:itens.map(i=>({id_anuncio:i.idAnuncio,quantidade:i.quantidade})),
      };
      // Guarda ANTES do envio: timeout/reabertura deve reutilizar a mesma chave.
      await AsyncStorage.setItem(armazenamento,JSON.stringify(tentativa));setPendente(tentativa);
      const pedido=await api.fazerPedido(tentativa);
      await AsyncStorage.removeItem(armazenamento);setPendente(null);
      confirmarItens(tentativa.itens);setCupomAplicado(false);
      Alert.alert('Pedido registrado',`Pedido #${pedido.id} • R$ ${Number(pedido.total).toFixed(2).replace('.',',')}. Pendente de pagamento. Nenhuma cobrança foi realizada. Confira suas notificações.`);
    } catch(e) {
      if([400,409].includes(e.status)) {await AsyncStorage.removeItem(armazenamento);setPendente(null);}
      Alert.alert('Pedido não confirmado',e.message+' O carrinho foi preservado.');
    } finally {trava.current=false;setEnviando(false);}
  }

  function alterarQuantidade(item, delta) {
    atualizarQuantidade(item.id, item.quantidade + delta);
  }

  return (
    <View style={[styles.container, areaSegura]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => voltar(navigation)}><Text>{'<'}</Text></TouchableOpacity>
      <Text style={styles.titulo}>Finalizar compra</Text>
      <Text style={styles.avisoDemo}>O pedido será registrado como pendente de pagamento. Não há cobrança pelo app. Entrega: frete simulado fixo de R$ 12,90 por pedido. Retirada: sem frete. Entrega exige que todos os produtos ofereçam essa opção.</Text>

      <View pointerEvents={enviando || pendente ? "none" : "auto"} style={{opacity:pendente?0.6:1}}>
      <View style={{flexDirection:'row',gap:16}}>{['entrega','retirada'].map(r=><TouchableOpacity key={r} onPress={()=>setRecebimento(r)}><Text>{recebimento===r?'●':'○'} {r==='entrega'?'Entrega':'Retirada (sem frete)'}</Text></TouchableOpacity>)}</View>
      <TouchableOpacity disabled={recebimento==='retirada'} style={styles.linha} onPress={() => { setEnderecoRascunho(endereco); setModalEndereco(true); }}>
        <Text style={styles.label}>Entrega</Text><Text style={styles.valor}>{recebimento==='retirada'?'Combinar com os vendedores':endereco || 'Adicionar endereço  ›'}</Text>
      </TouchableOpacity>
      <View style={styles.linha}><Text style={styles.label}>Frete estimado</Text><Text style={styles.valor}>{recebimento==='retirada'?'R$ 0,00':endereco ? `R$ ${FRETE_DEMO.toFixed(2).replace('.', ',')}` : 'Informe o endereço'}</Text></View>
      <TouchableOpacity style={styles.linha} onPress={() => setModalPagamento(true)}>
        <Text style={styles.label}>Pagamento</Text><Text style={styles.valor}>{metodoPagamento || 'Selecionar forma  ›'}</Text>
      </TouchableOpacity>

      <Text style={styles.tituloSecao}>Cupom</Text>
      <View style={styles.cupomLinha}>
        <TextInput style={styles.cupomInput} value={cupom} onChangeText={setCupom} placeholder="Digite IBUILD10" autoCapitalize="characters" />
        <TouchableOpacity style={styles.botaoCupom} onPress={aplicarCupom}><Text style={styles.botaoTexto}>Aplicar</Text></TouchableOpacity>
      </View>
      {mensagemCupom ? <Text style={styles.mensagem}>{mensagemCupom}</Text> : null}

      <Text style={styles.tituloSecao}>Itens</Text>
      {itens.length === 0 ? <Text style={styles.carrinhoVazio}>Seu carrinho está vazio.</Text> : (
        <View style={styles.listaItens}>
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
        </View>
      )}

      <View style={styles.linha}><Text style={styles.label}>Subtotal</Text><Text>R$ {subtotal.toFixed(2).replace('.', ',')}</Text></View>
      <View style={styles.linha}><Text style={styles.label}>Frete</Text><Text>R$ {frete.toFixed(2).replace('.', ',')}</Text></View>
      <View style={styles.linha}><Text style={styles.label}>Desconto</Text><Text>R$ {desconto.toFixed(2).replace('.', ',')}</Text></View>
      <Text style={{ color: "#777", marginVertical: 8 }}>O total definitivo é conferido pelo servidor ao registrar o pedido.</Text>
      <View style={styles.linha}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalLabel}>R$ {total.toFixed(2).replace('.', ',')}</Text></View>
      </View>
      {!!erroTentativa && <TouchableOpacity onPress={()=>setReler(r=>r+1)}><Text>{erroTentativa} Tentar novamente</Text></TouchableOpacity>}
      {!!pendente && <Text>Há uma tentativa ainda não confirmada. Reenviar consulta ou registra o mesmo pedido, sem duplicá-lo.</Text>}
      <TouchableOpacity disabled={enviando || carregandoTentativa || !!erroTentativa} style={styles.botaoPedido} onPress={finalizarPedido}><Text style={styles.botaoTexto}>{enviando?'Confirmando…':pendente?'Confirmar tentativa anterior':'Registrar pedido'}</Text></TouchableOpacity>

      </ScrollView>
      <BottomBar ativa="home" />

      <Modal visible={modalEndereco} transparent animationType="fade" onRequestClose={() => setModalEndereco(false)}>
        <View style={styles.modalFundo}><View style={styles.modalCard}>
          <Text style={styles.tituloSecao}>Endereço de entrega</Text>
          <TextInput style={styles.enderecoInput} value={enderecoRascunho} onChangeText={setEnderecoRascunho} placeholder="Rua, número, bairro e cidade" />
          <TouchableOpacity style={styles.botaoPedido} onPress={() => { if (!enderecoRascunho.trim()) { Alert.alert('Endereço necessário', 'Preencha o endereço para salvar.'); return; } setEndereco(enderecoRascunho.trim()); setModalEndereco(false); }}><Text style={styles.botaoTexto}>Salvar endereço</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setModalEndereco(false)}><Text style={styles.fechar}>Cancelar</Text></TouchableOpacity>
        </View></View>
      </Modal>
      <Modal visible={modalPagamento} transparent animationType="fade" onRequestClose={() => setModalPagamento(false)}>
        <View style={styles.modalFundo}><View style={styles.modalCard}>
          <Text style={styles.tituloSecao}>Forma de pagamento pretendida</Text>
          {METODOS_PAGAMENTO.map((metodo) => <TouchableOpacity key={metodo} style={styles.opcaoPagamento} onPress={() => { setMetodoPagamento(metodo); setModalPagamento(false); }}><Text>{metodo === metodoPagamento ? '● ' : '○ '}{metodo}</Text></TouchableOpacity>)}
          <TouchableOpacity onPress={() => setModalPagamento(false)}><Text style={styles.fechar}>Fechar</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 8 },
  titulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  avisoDemo: { fontSize: 11, color: '#8A4B08', backgroundColor: '#FFF3E0', padding: 8, borderRadius: 6, marginBottom: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { color: '#666', fontSize: 13 }, valor: { fontSize: 13, color: '#111', maxWidth: '65%', textAlign: 'right' },
  tituloSecao: { fontWeight: 'bold', fontSize: 15, marginTop: 12, marginBottom: 8 },
  cupomLinha: { flexDirection: 'row', gap: 8 }, cupomInput: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, height: 40 },
  botaoCupom: { backgroundColor: '#277D2C', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  mensagem: { fontSize: 12, color: '#555', marginTop: 5 }, carrinhoVazio: { color: '#828282', paddingVertical: 12 }, listaItens: { },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 8 }, itemImagem: { width: 42, height: 42, borderRadius: 6, backgroundColor: '#F0F0F0' },
  itemInfo: { flex: 1 }, itemNome: { fontSize: 12, fontWeight: '500' }, controleQtd: { flexDirection: 'row', gap: 9, alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  controleTexto: { fontSize: 18, color: '#277D2C' }, itemRemover: { color: '#D32F2F', fontSize: 11 }, totalLabel: { fontSize: 15, fontWeight: 'bold' },
  botaoPedido: { backgroundColor: '#F57C00', minHeight: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, padding: 8 }, botaoTexto: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  modalFundo: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 24 }, modalCard: { backgroundColor: 'white', borderRadius: 12, padding: 18 }, enderecoInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, minHeight: 44 }, opcaoPagamento: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }, fechar: { color: '#277D2C', textAlign: 'center', padding: 12 },
});
