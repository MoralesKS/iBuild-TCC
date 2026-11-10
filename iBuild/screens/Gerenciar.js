import { useCallback, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppNavigation, obras as obrasExemplo, calcularProgresso } from '../src/Functions';
import { api, useUsuario } from '../src/api';

const FILTROS = [
  { label: 'Todas as obras', value: 'todas' },
  { label: 'Em andamento', value: 'andamento' },
  { label: 'Concluídas', value: 'concluida' },
];

const limitarPercentual = (valor) => Math.min(100, Math.max(0, Number(valor) || 0));

export default function Gerenciar() {
  const navigation = useNavigation();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { usuario, carregando: carregandoPerfil, erroPerfil, recarregarUsuario } = useUsuario();
  const [textoBusca, setTextoBusca] = useState('');
  const [obrasDb, setObrasDb] = useState([]);
  const [carregandoObras, setCarregandoObras] = useState(false);
  const [erroObras, setErroObras] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const idUsuario = usuario?.idUsuario;
  const [filtro, setFiltro] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [alteracoes, setAlteracoes] = useState({});
  const [excluidas, setExcluidas] = useState([]);
  const [obraEditando, setObraEditando] = useState(null);
  const [rascunho, setRascunho] = useState(null);

  useFocusEffect(useCallback(() => {
    if (!idUsuario) return;
    let ativo = true;
    setCarregandoObras(true);
    setErroObras(false);

    api.obras(idUsuario)
      .then((lista) => { if (ativo) setObrasDb(lista); })
      .catch(() => { if (ativo) setErroObras(true); })
      .finally(() => { if (ativo) setCarregandoObras(false); });

    return () => { ativo = false; };
  }, [idUsuario, tentativa]));

  const obras = useMemo(() => [...obrasDb, ...obrasExemplo]
    .filter((obra) => !excluidas.includes(obra.id))
    .map((obra) => ({ ...obra, ...(alteracoes[obra.id] || {}) })), [obrasDb, excluidas, alteracoes]);

  const obrasFiltradas = obras.filter((obra) => {
    const texto = textoBusca.trim().toLowerCase();
    const combinaBusca = !texto || obra.nome.toLowerCase().includes(texto) || (obra.construtora || '').toLowerCase().includes(texto);
    const combinaStatus = filtro === 'todas' || obra.status === filtro;
    return combinaBusca && combinaStatus;
  });
  const totalFuncionarios = obras.reduce((soma, obra) => soma + (obra.equipe?.funcionariosAtivos || 0), 0);

  function guardarEdicao() {
    const etapas = {
      fundacao: limitarPercentual(rascunho.fundacao),
      estrutura: limitarPercentual(rascunho.estrutura),
      acabamento: limitarPercentual(rascunho.acabamento),
    };
    setAlteracoes((atuais) => ({ ...atuais, [obraEditando.id]: {
      nome: rascunho.nome.trim() || obraEditando.nome,
      construtora: rascunho.construtora.trim() || obraEditando.construtora,
      status: rascunho.status,
      etapas,
      equipe: { ...obraEditando.equipe, funcionariosAtivos: Math.max(0, Number(rascunho.funcionarios) || 0) },
    } }));
    setObraEditando(null);
    setRascunho(null);
  }

  function excluirObra(obra) {
    Alert.alert('Excluir obra', `Remover “${obra.nome}” desta demonstração?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => setExcluidas((ids) => [...ids, obra.id]) },
    ]);
  }

  function abrirDetalhesObra(obra) {
    navigation.navigate('DetalhesObra', { obra, edicaoTemporaria: alteracoes[obra.id] ?? null });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.conteudo} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.avisoDemo}>Modo de demonstração. Favoritos, edições e exclusões são temporários e ficam apenas nesta sessão.</Text>
        <TextInput style={styles.searchInput} placeholder="Pesquisar obra ou construtora" value={textoBusca} onChangeText={setTextoBusca} />

        <TouchableOpacity style={styles.filtro} onPress={() => setMostrarFiltros((aberto) => !aberto)}>
          <Text>{FILTROS.find((opcao) => opcao.value === filtro)?.label}  ⌄</Text>
        </TouchableOpacity>
        {mostrarFiltros && <View style={styles.opcoesFiltro}>{FILTROS.map((opcao) => (
          <TouchableOpacity key={opcao.value} style={styles.opcaoFiltro} onPress={() => { setFiltro(opcao.value); setMostrarFiltros(false); }}>
            <Text>{filtro === opcao.value ? '● ' : '○ '}{opcao.label}</Text>
          </TouchableOpacity>
        ))}</View>}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Total de Obras</Text><Text style={styles.statValor}>{obras.length}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Em andamento</Text><Text style={styles.statValor}>{obras.filter((obra) => obra.status === 'andamento').length}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Concluídas</Text><Text style={styles.statValor}>{obras.filter((obra) => obra.status === 'concluida').length}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Funcionários</Text><Text style={styles.statValor}>{totalFuncionarios}</Text></View>
        </View>

        <Text style={styles.tituloSecao}>Obras</Text>
        {(carregandoPerfil || (idUsuario && carregandoObras)) ? <Text>Carregando obras…</Text> : null}
        {(erroPerfil || (idUsuario && erroObras)) ? (
          <View style={styles.opcoesFiltro}>
            <Text accessibilityRole="alert" style={styles.opcaoFiltro}>Não foi possível carregar as obras do servidor.</Text>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.opcaoFiltro}
              onPress={() => idUsuario ? setTentativa((atual) => atual + 1) : recarregarUsuario()}
            >
              <Text>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {obrasFiltradas.length === 0 ? <Text style={styles.semResultados}>Nenhuma obra encontrada.</Text> : obrasFiltradas.map((obra) => {
          const progresso = calcularProgresso(obra);
          const favorita = favoritos.includes(obra.id);
          return (
            <View key={obra.id} style={styles.obraCard}>
              <Image style={styles.foto} source={obra.imagem || require('../assets/gerenciar.png')} />
              <View style={styles.cardInfo}>
                <Text style={styles.obraNome}>{obra.nome}</Text>
                <Text style={styles.obraSub}>{obra.construtora}</Text>
                <View style={styles.progressoBarraFundo}><View style={[styles.progressoBarraPreenchida, { width: `${progresso}%` }]} /></View>
                <Text style={styles.progressoTexto}>{progresso}% concluída · {obra.status === 'concluida' ? 'Concluída' : 'Em andamento'}</Text>
                <View style={styles.acoesLinha}>
                  <TouchableOpacity style={styles.acaoSecundaria} onPress={() => abrirDetalhesObra(obra)}><Text>Ver detalhes</Text></TouchableOpacity>
                <TouchableOpacity style={styles.acaoSecundaria} onPress={() => { setObraEditando(obra); setRascunho({ nome: obra.nome, construtora: obra.construtora || '', status: obra.status, fundacao: String(obra.etapas.fundacao), estrutura: String(obra.etapas.estrutura), acabamento: String(obra.etapas.acabamento), funcionarios: String(obra.equipe?.funcionariosAtivos || 0) }); }}><Text>Editar</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.acaoIcone} accessibilityLabel={favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onPress={() => setFavoritos((ids) => favorita ? ids.filter((id) => id !== obra.id) : [...ids, obra.id])}><Text style={{ color: favorita ? '#F57C00' : '#666' }}>{favorita ? '★' : '☆'}</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.acaoIcone} accessibilityLabel="Excluir obra" onPress={() => excluirObra(obra)}><Text style={{ color: '#C62828' }}>×</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {[[require('../assets/Home.png'), home], [require('../assets/gerenciar.png'), gerenciar], [require('../assets/Bussola.png'), mapa], [require('../assets/Trabalho.png'), contratar], [require('../assets/Chat.png'), chat], [require('../assets/Perfil.png'), perfil]].map(([icone, acao], indice) => (
          <TouchableOpacity key={indice} style={styles.footerItem} onPress={acao}><Image style={[styles.footerIcone, indice === 1 && styles.footerIconeAtivo]} source={icone} /></TouchableOpacity>
        ))}
      </View>

      <Modal visible={Boolean(obraEditando)} transparent animationType="fade" onRequestClose={() => setObraEditando(null)}>
        <View style={styles.modalFundo}><ScrollView contentContainerStyle={styles.modalCard}>
          <Text style={styles.tituloSecao}>Editar obra (temporário)</Text>
          <TextInput style={styles.campoEdicao} placeholder="Nome da obra" value={rascunho?.nome || ''} onChangeText={(nome) => setRascunho((r) => ({ ...r, nome }))} />
          <TextInput style={styles.campoEdicao} placeholder="Construtora" value={rascunho?.construtora || ''} onChangeText={(construtora) => setRascunho((r) => ({ ...r, construtora }))} />
          <Text style={styles.rotuloCampo}>Situação</Text>
          <View style={styles.acoesLinha}>{[['andamento', 'Em andamento'], ['concluida', 'Concluída']].map(([valor, label]) => <TouchableOpacity key={valor} style={[styles.acaoSecundaria, rascunho?.status === valor && styles.statusSelecionado]} onPress={() => setRascunho((r) => ({ ...r, status: valor }))}><Text>{label}</Text></TouchableOpacity>)}</View>
          <Text style={styles.rotuloCampo}>Etapas (%)</Text>
          {['fundacao', 'estrutura', 'acabamento'].map((etapa) => <TextInput key={etapa} style={styles.campoEdicao} keyboardType="numeric" placeholder={etapa} value={rascunho?.[etapa] || ''} onChangeText={(valor) => setRascunho((r) => ({ ...r, [etapa]: valor.replace(/[^0-9]/g, '') }))} />)}
          <TextInput style={styles.campoEdicao} keyboardType="numeric" placeholder="Funcionários ativos" value={rascunho?.funcionarios || ''} onChangeText={(valor) => setRascunho((r) => ({ ...r, funcionarios: valor.replace(/[^0-9]/g, '') }))} />
          <TouchableOpacity style={styles.botaoSalvar} onPress={guardarEdicao}><Text style={styles.botaoSalvarTexto}>Salvar nesta sessão</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { setObraEditando(null); setRascunho(null); }}><Text style={styles.cancelar}>Cancelar</Text></TouchableOpacity>
        </ScrollView></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: '10%' }, conteudo: { flex: 1, paddingHorizontal: 16 },
  avisoDemo: { color: '#8A4B08', backgroundColor: '#FFF3E0', fontSize: 11, padding: 8, borderRadius: 6, marginBottom: 10 },
  searchInput: { backgroundColor: '#F5F5F5', height: 42, borderRadius: 8, paddingHorizontal: 12 },
  filtro: { marginTop: 12, borderColor: '#AAA', borderWidth: 1, borderRadius: 8, padding: 9, alignSelf: 'flex-start', minWidth: 150 },
  opcoesFiltro: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginTop: 4 }, opcaoFiltro: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 }, statCard: { width: '48%', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, marginBottom: 10 },
  statLabel: { fontSize: 12, color: '#777' }, statValor: { fontSize: 24, fontWeight: 'bold', color: '#F57C00', marginTop: 6 }, tituloSecao: { fontWeight: 'bold', fontSize: 16, marginTop: 8, marginBottom: 12 },
  semResultados: { color: '#777', paddingVertical: 18 }, obraCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderColor: '#DDD', borderWidth: 1 },
  foto: { width: 48, height: 48, tintColor: '#000' }, cardInfo: { flex: 1, marginLeft: 12 }, obraNome: { fontWeight: 'bold', fontSize: 14 }, obraSub: { fontSize: 12, color: '#777', marginBottom: 8 },
  progressoBarraFundo: { height: 7, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' }, progressoBarraPreenchida: { height: 7, backgroundColor: '#277D2C' }, progressoTexto: { fontSize: 11, marginTop: 5 },
  acoesLinha: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }, acaoSecundaria: { paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#F2F2F2', borderRadius: 6 }, acaoIcone: { paddingHorizontal: 8, paddingVertical: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 54, flexShrink: 0, borderTopWidth: 1, borderTopColor: '#EEE' }, footerItem: { flex: 1, alignItems: 'center' }, footerIcone: { height: 23, width: 23, tintColor: '#AAA' }, footerIconeAtivo: { tintColor: '#277D2C' },
  modalFundo: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 20 }, modalCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 18 }, campoEdicao: { borderWidth: 1, borderColor: '#DDD', borderRadius: 7, padding: 10, marginBottom: 8 }, rotuloCampo: { fontWeight: '600', marginVertical: 5 }, statusSelecionado: { backgroundColor: '#DFF0E0' }, botaoSalvar: { backgroundColor: '#F57C00', padding: 12, alignItems: 'center', borderRadius: 8, marginTop: 8 }, botaoSalvarTexto: { color: '#FFF', fontWeight: 'bold' }, cancelar: { color: '#277D2C', textAlign: 'center', padding: 12 },
});
