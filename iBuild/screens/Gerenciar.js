import { useAreaSegura } from '../src/responsivo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { calcularProgresso } from '../src/Functions';
import { api, useUsuario } from '../src/api';
import BottomBar from '../componentes/BottomBar';

const FILTROS = [
  { label: 'Todas as obras', value: 'todas' },
  { label: 'Em andamento', value: 'andamento' },
  { label: 'Concluídas', value: 'concluida' },
];

const limitarPercentual = (valor) => Math.min(100, Math.max(0, Number(valor) || 0));

export default function Gerenciar() {
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();
  const { usuario, carregando: carregandoPerfil, erroPerfil, recarregarUsuario, sessao } = useUsuario();
  const [textoBusca, setTextoBusca] = useState('');
  const [obrasDb, setObrasDb] = useState([]);
  const [carregandoObras, setCarregandoObras] = useState(false);
  const [erroObras, setErroObras] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const idUsuario = usuario?.idUsuario;
  const [filtro, setFiltro] = useState('todas');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [favoritos, setFavoritos] = useState(sessao.obras?.favoritos || []);
  useEffect(() => { sessao.obras = { favoritos }; }, [favoritos, sessao]);

  useFocusEffect(useCallback(() => {
    if (!idUsuario) return;
    let ativo = true;
    setCarregandoObras(true);
    setErroObras(false);

    Promise.all([api.obras(idUsuario), api.obrasParticipando(idUsuario)]).then(([proprias, equipe]) => [...proprias, ...equipe.filter(o => !proprias.some(p => p.id === o.id))])
      .then((lista) => { if (ativo) setObrasDb(lista); })
      .catch(() => { if (ativo) setErroObras(true); })
      .finally(() => { if (ativo) setCarregandoObras(false); });

    return () => { ativo = false; };
  }, [idUsuario, tentativa]));

  const obras = obrasDb;

  const obrasFiltradas = obras.filter((obra) => {
    const texto = textoBusca.trim().toLowerCase();
    const combinaBusca = !texto || obra.nome.toLowerCase().includes(texto) || (obra.construtora || '').toLowerCase().includes(texto);
    const combinaStatus = filtro === 'todas' || obra.status === filtro;
    return combinaBusca && combinaStatus;
  });
  const totalFuncionarios = obras.reduce((soma, obra) => soma + (obra.equipe?.funcionariosAtivos || 0), 0);

  function excluirObra(obra) {
    Alert.alert('Excluir obra', `Excluir “${obra.nome}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await api.excluirObra(obra.id, idUsuario); setTentativa(t => t + 1); }
        catch(e) { Alert.alert('Não foi possível excluir', e.message); }
      } },
    ]);
  }

  function abrirDetalhesObra(obra) {
    navigation.navigate('DetalhesObra', { obra });
  }

  return (
    <View style={[styles.container, areaSegura]}>
      <ScrollView style={styles.conteudo} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
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

        <TouchableOpacity style={styles.botaoSalvar} onPress={() => navigation.navigate('NovaObra')}><Text style={styles.botaoSalvarTexto}>+ Nova obra</Text></TouchableOpacity>
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
                {String(obra.idProprietario) === String(idUsuario) && <TouchableOpacity style={styles.acaoSecundaria} onPress={() => navigation.navigate('NovaObra', { obra })}><Text>Editar</Text></TouchableOpacity>}
                  <TouchableOpacity style={styles.acaoIcone} accessibilityLabel={favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onPress={() => setFavoritos((ids) => favorita ? ids.filter((id) => id !== obra.id) : [...ids, obra.id])}><Text style={{ color: favorita ? '#F57C00' : '#666' }}>{favorita ? '★' : '☆'}</Text></TouchableOpacity>
                  {String(obra.idProprietario) === String(idUsuario) && <TouchableOpacity style={styles.acaoIcone} accessibilityLabel="Excluir obra" onPress={() => excluirObra(obra)}><Text style={{ color: '#C62828' }}>×</Text></TouchableOpacity>}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BottomBar ativa="gerenciar" />
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
  modalFundo: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 20 }, modalCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 18 }, campoEdicao: { borderWidth: 1, borderColor: '#DDD', borderRadius: 7, padding: 10, marginBottom: 8 }, rotuloCampo: { fontWeight: '600', marginVertical: 5 }, statusSelecionado: { backgroundColor: '#DFF0E0' }, botaoSalvar: { backgroundColor: '#F57C00', padding: 12, alignItems: 'center', borderRadius: 8, marginTop: 8 }, botaoSalvarTexto: { color: '#FFF', fontWeight: 'bold' }, cancelar: { color: '#277D2C', textAlign: 'center', padding: 12 },
});
