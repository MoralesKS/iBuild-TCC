import BottomBar from '../componentes/BottomBar';
import { Text, View, TouchableOpacity, ScrollView, Image, TextInput, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../src/api';
import Checkbox from 'expo-checkbox';
import { useAppNavigation, obras, calcularProgresso  } from '../src/Functions';
import { useUsuario } from '../src/api';
import { Alert } from 'react-native';
import { useAreaSegura } from '../src/responsivo';

export default function DetalhesObra() {
  const route = useRoute();
  const navigation = useNavigation();
  if (!route.params?.obra?.id) return <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text>Obra indisponível.</Text><TouchableOpacity onPress={() => navigation.navigate('Gerenciar')}><Text>Voltar às obras</Text></TouchableOpacity></View>;
  return <DetalheDisponivel key={route.params.obra.id} />;
}
function normalizarObra(o) {
  return { ...o, etapas: { fundacao: 0, estrutura: 0, acabamento: 0, ...o.etapas }, equipe: { mestre: '—', funcionariosAtivos: 0, horasTrabalhadas: '0h', proximaAcao: 'Nenhuma', ...o.equipe }, proximasAcoes: o.proximasAcoes || [] };
}
function DetalheDisponivel() {
  const areaSegura = useAreaSegura();
  const route = useRoute();
  const navigation = useNavigation();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const { usuario } = useUsuario();
  // route.params.obra vem do navigation.navigate('DetalhesObra', { obra }); "obras[0]" é só um plano B
  const [obra, setObra] = useState(normalizarObra(route.params.obra));
  const ehProprietario = !obra.doBanco || (!!usuario && String(obra.idProprietario) === String(usuario.idUsuario));
  const [erroObra, setErroObra] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  // Cada obra tem sua própria lista de tarefas — guardamos elas aqui
  // como um ARRAY de objetos, não uma variável só, porque cada
  // checkbox precisa poder ser marcado/desmarcado independente dos outros.
  const [proximasAcoes, setProximasAcoes] = useState(obra.proximasAcoes);

  // Campo de texto pra criar uma nova tarefa na checklist
  const [novaAcaoTexto, setNovaAcaoTexto] = useState('');

  // Chegou uma obra nova (ou atualizada) pela navegação: usa ela
  useEffect(() => {
    if (route.params?.obra) setObra(normalizarObra(route.params.obra));
  }, [route.params?.obra]);

  // Sempre que a obra muda, o checklist é refeito com as tarefas dela
  useEffect(() => {
    setProximasAcoes(obra.proximasAcoes);
  }, [obra]);

  // Obras do banco: busca a versão mais recente toda vez que a tela ganha foco
  useFocusEffect(useCallback(() => {
    let ativo = true;
    if (obra.doBanco && usuario?.idUsuario) { setErroObra(null); api.obra(obra.id, usuario.idUsuario).then(o => { if (ativo) setObra(normalizarObra({ ...o, ...route.params?.edicaoTemporaria })); }).catch(e => { if (ativo) setErroObra(e); }); }
    return () => { ativo = false; };
  }, [obra.id, usuario?.idUsuario, tentativa, route.params?.edicaoTemporaria]));

  function alternarAcao(id) {
    if (!ehProprietario) return;
    const acao = proximasAcoes.find((a) => a.id === id);
    setProximasAcoes((atuais) => atuais.map((a) => (a.id === id ? { ...a, feito: !a.feito } : a)));
    // obra do banco: salva a marcação no MySQL
    if (obra.doBanco && acao && ehProprietario) api.marcarTarefa(id, !acao.feito, usuario?.idUsuario).catch((e) => { setProximasAcoes(obra.proximasAcoes); alert(e.message); });
  }

  async function adicionarAcao() {
    const texto = novaAcaoTexto.trim();
    if (texto === '') return; // não adiciona tarefa vazia
    if (!ehProprietario) return;
    let id = Date.now(); // obra de exemplo: id só local
    if (obra.doBanco) {
      try { id = (await api.novaTarefa(obra.id, texto, usuario?.idUsuario)).id; } catch (e) { alert(e.message); return; }
    }
    setProximasAcoes((atuais) => [...atuais, { id, texto, feito: false }]);
    setNovaAcaoTexto('');
  }

  if (erroObra) return <View style={[styles.container, areaSegura]}><Text>{erroObra.status === 404 ? 'Obra indisponível ou removida.' : 'Não foi possível carregar a obra.'}</Text><TouchableOpacity onPress={() => setTentativa(t => t + 1)}><Text>Tentar novamente</Text></TouchableOpacity><TouchableOpacity onPress={() => navigation.navigate('Gerenciar')}><Text>Voltar às obras</Text></TouchableOpacity></View>;
  const porcentagemTotal = calcularProgresso(obra);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={[styles.container, areaSegura]}>
      <Text style={styles.titulo}>Detalhes da obra</Text>
      {ehProprietario && obra.doBanco && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
          <TouchableOpacity style={[styles.contratarBotao, { flex: 1 }]} onPress={() => navigation.navigate('NovaObra', { obra })}>
            <Text style={styles.contratarTexto}>Editar obra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contratarBotao, { flex: 1, backgroundColor: '#C62828' }]} onPress={() => Alert.alert('Excluir obra', 'Deseja realmente excluir esta obra? Essa ação não poderá ser desfeita.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: async () => { try { await api.excluirObra(obra.id, usuario.idUsuario); navigation.navigate('Gerenciar'); } catch (e) { alert(e.message); } } },
          ])}>
            <Text style={styles.contratarTexto}>Excluir obra</Text>
          </TouchableOpacity>
        </View>
      )}
      {!ehProprietario && <Text style={{ color: '#777', textAlign: 'center', marginBottom: 8 }}>Você está visualizando esta obra como profissional da equipe.</Text>}

      <ScrollView style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <View style={styles.resumoCard}>
          <Image style={styles.foto} source={obra.imagem} />
          <View style={{ marginLeft: '10%', width: '60%' }}>
            <Text style={styles.resumoNome}>{obra.nome}</Text>
            <Text style={styles.resumoSub}>Entrega {obra.entrega}</Text>
            <View style={styles.progressoBarraFundo}>
              <View style={[styles.progressoBarraPreenchida, { width: `${porcentagemTotal}%` }]} />
            </View>
            <Text style={styles.progressoTexto}>
              {porcentagemTotal}% Concluída • {obra.status === 'concluida' ? 'Concluída' : 'Em andamento'}
            </Text>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Informações gerais</Text>
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/Home.png')}/>
                </View>
                <Text style={styles.infoLinha}>Tipo: </Text>
                <Text style={styles.infoLinha}>{obra.tipo}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/icones/localizacao.png')}/>
                </View>
                <Text style={styles.infoLinha}>Endereço: </Text>
                <Text style={styles.infoLinha}>{obra.endereco}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/Perfil.png')}/>
                </View>
                <Text style={styles.infoLinha}>Responsável técnico: </Text>
                <Text style={styles.infoLinha}>{obra.responsavel}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/icones/orçamento.png')}/>
                </View>
                <Text style={styles.infoLinha}>Orçamento: </Text>
                <Text style={styles.infoLinha}>{obra.orcamento}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Etapas da Obra</Text>
        <View style={styles.infoCard}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Fundação </Text>
              <View style={[styles.progressoBarraFundo, { flex: 1, margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${obra.etapas.fundacao}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{obra.etapas.fundacao}%</Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Estrutura </Text>
              <View style={[styles.progressoBarraFundo, { flex: 1, margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${obra.etapas.estrutura}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{obra.etapas.estrutura}%</Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Acabamento </Text>
              <View style={[styles.progressoBarraFundo, { flex: 1, margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${obra.etapas.acabamento}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{obra.etapas.acabamento}%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Equipe</Text>
        <View style={[styles.infoCard, { flexDirection: 'row', justifyContent: 'space-around' }]}>
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/engenheiro.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Mestre de Obras</Text>
            <Text style={[styles.infoLinha, { fontSize: 14 }]}>{obra.equipe.mestre}</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/equipe.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Funcionários Ativos</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.funcionariosAtivos}</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/relogio.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Horas Trabalhadas</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.horasTrabalhadas}</Text>
          </View>


        </View>

        <View style={[styles.infoCard, { marginTop: 8 }]}><Text>Próxima Ação</Text><Text style={{ color: '#F57C00', marginTop: 8 }}>{obra.equipe.proximaAcao}</Text></View>
        {obra.profissionais?.length > 0 && (
          <Text style={styles.infoLinha}>Autônomos: {obra.profissionais.map((p) => p.nome).join(', ')}</Text>
        )}

        {ehProprietario && <TouchableOpacity style={styles.contratarBotao} onPress={() => navigation.navigate('Atribuir Funcionários', { obra })}>
          <Text style={styles.contratarTexto}>Atribuir funcionários</Text>
        </TouchableOpacity>}

        <Text style={styles.tituloSecao}>Próximas Ações</Text>
        <View style={styles.infoCard}>
          {proximasAcoes.map((acao) => (
            <View key={acao.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={acao.feito}
                onValueChange={() => alternarAcao(acao.id)}
                disabled={!ehProprietario}
                color={acao.feito ? '#277D2C' : undefined}
              />
              <Text style={styles.infoLinha}> {acao.texto}</Text>
            </View>
          ))}

          {/* Adicionar nova tarefa na checklist */}
          {ehProprietario && <View style={styles.novaAcaoRow}>
            <TextInput
              style={styles.novaAcaoInput}
              placeholder="Escreva uma nova tarefa..."
              placeholderTextColor="#828282"
              value={novaAcaoTexto}
              onChangeText={setNovaAcaoTexto}
              onSubmitEditing={adicionarAcao}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.novaAcaoBotao} onPress={adicionarAcao}>
              <Text style={styles.novaAcaoBotaoTexto}>+</Text>
            </TouchableOpacity>
          </View>}
        </View>

      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <BottomBar ativa="gerenciar" />
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  resumoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#828282',
  },
  foto: {
    width: 61,
    height: 61,
    tintColor: '#000000',
  },
  foto1: {
    width: 21,
    height: 21,
    tintColor: '#000000',
  },
  resumoNome: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  resumoSub: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 12,
  },
  progressoBarraFundo: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: 6,
    backgroundColor: '#277D2C',
    borderRadius: 3,
  },
  progressoTexto: {
    fontSize: 12,
    marginTop: 8,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  novaAcaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  novaAcaoInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    marginRight: 8,
    color: '#000000',
  },
  novaAcaoBotao: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  novaAcaoBotaoTexto: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 8,
  },
  infoLinha: {
    flexShrink: 1,
    fontSize: 13,
    color: '#000000',
    marginBottom: 8,
  },
  contratarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  contratarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  divisao: {
    borderLeftWidth: .5,
    borderRightWidth: .5,
    padding: 6,
    flex: 1,
    alignItems: 'center',
  },
});
