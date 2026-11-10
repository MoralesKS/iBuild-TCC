import { Text, View, TouchableOpacity, ScrollView, Image, TextInput, KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../src/api';
import Checkbox from 'expo-checkbox';
import { useAppNavigation, calcularProgresso  } from '../src/Functions';

export default function DetalhesObra({ route }) {
  const { obra, obraId, edicaoTemporaria } = route.params ?? {};
  return (
    <CarregarDetalhes
      key={obra?.id ?? obraId ?? 'sem-obra'}
      obraInicial={obra}
      idBanco={obra?.doBanco ? obra.id : obraId}
      edicaoTemporaria={edicaoTemporaria}
    />
  );
}

function CarregarDetalhes({ obraInicial, idBanco, edicaoTemporaria }) {
  const { gerenciar } = useAppNavigation();
  const [resposta, setResposta] = useState(null);

  useFocusEffect(useCallback(() => {
    if (!idBanco) return;
    let ativo = true;
    api.obra(idBanco)
      .then((dados) => { if (ativo) setResposta({ dados }); })
      .catch((erro) => { if (ativo) setResposta({ status: erro.status ?? 0 }); });
    return () => { ativo = false; };
  }, [idBanco]));

  const dados = resposta?.dados ?? obraInicial;
  if (resposta?.status === 404 || !dados) {
    const mensagem = resposta?.status === 404 || !idBanco
      ? 'Obra não encontrada ou removida.'
      : resposta ? 'Não foi possível carregar a obra.' : 'Carregando obra…';
    return (
      <View style={[styles.container, { paddingHorizontal: 16 }]}>
        <Text accessibilityRole="alert">{mensagem}</Text>
        <TouchableOpacity accessibilityRole="button" onPress={gerenciar} style={{ paddingVertical: 12 }}>
          <Text>‹ Voltar às obras</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const obra = {
    ...dados,
    ...edicaoTemporaria,
    equipe: { ...dados.equipe, ...edicaoTemporaria?.equipe },
  };
  return <ConteudoDetalhes obra={obra} />;
}

function ConteudoDetalhes({ obra }) {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const [acoesEditadas, setAcoesEditadas] = useState(null);
  const acoesOriginais = obra.proximasAcoes ?? [];
  const proximasAcoes = acoesEditadas ?? acoesOriginais;
  const [novaAcaoTexto, setNovaAcaoTexto] = useState('');
  const etapas = {
    fundacao: Number(obra.etapas?.fundacao) || 0,
    estrutura: Number(obra.etapas?.estrutura) || 0,
    acabamento: Number(obra.etapas?.acabamento) || 0,
  };

  function alternarAcao(id) {
    setAcoesEditadas((acoes) => (acoes ?? acoesOriginais).map((acao) =>
      acao.id === id ? { ...acao, feito: !acao.feito } : acao,
    ));
  }

  function adicionarAcao() {
    const texto = novaAcaoTexto.trim();
    if (!texto) return;
    setAcoesEditadas((acoes) => [...(acoes ?? acoesOriginais), { id: Date.now(), texto, feito: false }]);
    setNovaAcaoTexto('');
  }

  const porcentagemTotal = calcularProgresso({ etapas });
 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 }}>
        <TouchableOpacity accessibilityRole="button" onPress={gerenciar} style={{ paddingVertical: 8, paddingRight: 16 }}>
          <Text style={{ color: '#277D2C', fontWeight: 'bold' }}>{'< Voltar'}</Text>
        </TouchableOpacity>
        <Text style={[styles.titulo, { flex: 1, marginBottom: 0 }]}>Detalhes da obra</Text>
        <View style={{ width: 62 }} />
      </View>
 
      <ScrollView style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <View style={styles.resumoCard}>
          <Image style={styles.foto} source={obra.imagem || require('../assets/gerenciar.png')} />
          <View style={{ marginLeft: '10%', width: '60%' }}>
            <Text style={styles.resumoNome}>{obra.nome}</Text>
            <Text style={styles.resumoSub}>Entrega {obra.entrega || 'não informada'}</Text>
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
                <Text style={styles.infoLinha}>{obra.tipo || 'Não informado'}</Text>
              </View>
 
              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/icones/localizacao.png')}/>
                </View>
                <Text style={styles.infoLinha}>Endereço: </Text>
                <Text style={styles.infoLinha}>{obra.endereco || 'Não informado'}</Text>
              </View>
 
              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/Perfil.png')}/>
                </View>
                <Text style={styles.infoLinha}>Responsável técnico: </Text>
                <Text style={styles.infoLinha}>{obra.responsavel || 'Não informado'}</Text>
              </View>
 
              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5 }}>
                <View style={{ borderWidth: 1, borderRadius: 8, margin: 8, padding: 8 }}>
                  <Image style={styles.foto1} source={require('../assets/icones/orçamento.png')}/>
                </View>
                <Text style={styles.infoLinha}>Orçamento: </Text>
                <Text style={styles.infoLinha}>{obra.orcamento || 'Não informado'}</Text>
              </View>
            </View>
          </View>
        </View>
 
        <Text style={styles.tituloSecao}>Etapas da Obra</Text>
        <View style={styles.infoCard}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Fundação </Text>
              <View style={[styles.progressoBarraFundo, { width: '70%', margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${etapas.fundacao}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{etapas.fundacao}%</Text>
            </View>
 
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Estrutura </Text>
              <View style={[styles.progressoBarraFundo, { width: '70%', margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${etapas.estrutura}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{etapas.estrutura}%</Text>
            </View>
 
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Acabamento </Text>
              <View style={[styles.progressoBarraFundo, { width: '65%', margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${etapas.acabamento}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{etapas.acabamento}%</Text>
            </View>
          </View>
        </View>
 
        <Text style={styles.tituloSecao}>Equipe</Text>
        <View style={[styles.infoCard, { flexDirection: 'row', justifyContent: 'space-around' }]}>
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/engenheiro.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Mestre de Obras</Text>
            <Text style={[styles.infoLinha, { fontSize: 14 }]}>{obra.equipe.mestre ?? '—'}</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/equipe.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Funcionários Ativos</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.funcionariosAtivos ?? '—'}</Text>
          </View>
 
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/relogio.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Horas Trabalhadas</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.horasTrabalhadas ?? '—'}</Text>
          </View>
 
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/checklist.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Próxima Ação</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.proximaAcao ?? '—'}</Text>
          </View>
        </View>

        {obra.profissionais?.length > 0 && (
          <Text style={styles.infoLinha}>Autônomos: {obra.profissionais.map((p) => p.nome).join(', ')}</Text>
        )}
 
        <TouchableOpacity style={styles.contratarBotao} onPress={contratar}>
          <Text style={styles.contratarTexto}>Contratar funcionários</Text>
        </TouchableOpacity>

        <Text style={styles.tituloSecao}>Próximas Ações</Text>
        <View style={styles.infoCard}>
          {proximasAcoes.map((acao) => (
            <View key={acao.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={acao.feito}
                onValueChange={() => alternarAcao(acao.id)}
                color={acao.feito ? '#277D2C' : undefined}
              />
              <Text style={styles.infoLinha}> {acao.texto}</Text>
            </View>
          ))}
 
          {/* Adicionar nova tarefa na checklist */}
          <View style={styles.novaAcaoRow}>
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
          </View>
        </View>
 
      </ScrollView>
 
      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone1} source={require('../assets/gerenciar.png')}/>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
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
  divisao: {
    borderLeftWidth: .5,
    borderRightWidth: .5,
    padding: 12,
    alignItems: 'center',
  },
});
