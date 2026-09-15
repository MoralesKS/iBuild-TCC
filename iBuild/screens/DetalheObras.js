import { Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { useAppNavigation, obras, calcularProgresso  } from '../src/Functions';
import { detalhesObraStyles as styles } from '../src/Styles';

export default function DetalhesObra() {
  const route = useRoute();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
 
  // route.params.obra vem do navigation.navigate('DetalhesObra', { obra })
  // lá do Gerenciar.js. O "|| obras[0]" é só um fallback pra tela não
  // quebrar caso você abra ela direto, sem vir de um clique.
  const obra = route.params?.obra || obras[0];
 
  // Cada obra tem sua própria lista de tarefas — guardamos elas aqui
  // como um ARRAY de objetos, não uma variável só, porque cada
  // checkbox precisa poder ser marcado/desmarcado independente dos outros.
  const [proximasAcoes, setProximasAcoes] = useState(obra.proximasAcoes);
 
  // Se a pessoa voltar e clicar em "Ver detalhes" de OUTRA obra, esse
  // efeito garante que o checklist é reiniciado com as tarefas da
  // nova obra, mesmo que essa tela continue montada em memória.
  useEffect(() => {
    setProximasAcoes(obra.proximasAcoes);
  }, [obra.id]);
 
  function alternarAcao(id) {
    setProximasAcoes((acoesAtuais) =>
      acoesAtuais.map((acao) =>
        acao.id === id ? { ...acao, feito: !acao.feito } : acao
      )
    );
  }
 
  // Campo de texto pra criar uma nova tarefa na checklist
  const [novaAcaoTexto, setNovaAcaoTexto] = useState('');
 
  function adicionarAcao() {
    if (novaAcaoTexto.trim() === '') return; // não adiciona tarefa vazia
 
    const novaAcao = {
      id: Date.now(), // jeito simples de gerar um id único
      texto: novaAcaoTexto.trim(),
      feito: false,
    };
 
    setProximasAcoes((acoesAtuais) => [...acoesAtuais, novaAcao]);
    setNovaAcaoTexto(''); // limpa o campo depois de adicionar
  }
 
  const porcentagemTotal = calcularProgresso(obra);
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes da obra</Text>
 
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
              <View style={[styles.progressoBarraFundo, { width: '70%', margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${obra.etapas.fundacao}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{obra.etapas.fundacao}%</Text>
            </View>
 
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Estrutura </Text>
              <View style={[styles.progressoBarraFundo, { width: '70%', margin: 8, marginTop: -1 }]}>
                <View style={[styles.progressoBarraPreenchida, { width: `${obra.etapas.estrutura}%` }]} />
              </View>
              <Text style={styles.infoLinha}>{obra.etapas.estrutura}%</Text>
            </View>
 
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
              <Text style={styles.infoLinha}>Acabamento </Text>
              <View style={[styles.progressoBarraFundo, { width: '65%', margin: 8, marginTop: -1 }]}>
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
 
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/icones/checklist.png')}/>
            <Text style={[styles.infoLinha, { fontSize: 8 }]}>Próxima Ação</Text>
            <Text style={[styles.infoLinha, { fontSize: 14, color: '#F57C00' }]}>{obra.equipe.proximaAcao}</Text>
          </View>
        </View>
 
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
  );
}