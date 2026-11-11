import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Text, View, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppNavigation } from '../src/Functions';
import { api, useUsuario } from '../src/api';
import BarraInferior from '../src/BarraInferior';
import { useAreaSegura } from '../src/responsivo';

const TIPOS = ['Residencial', 'Comercial', 'Reforma', 'Industrial'];

export default function NovaObra() {
  const areaSegura = useAreaSegura();
  const { gerenciar } = useAppNavigation();
  const { usuario } = useUsuario();
  const route = useRoute();
  const obraEdicao = route.params?.obra;
  const editando = !!obraEdicao?.id;

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Residencial');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [entrega, setEntrega] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [responsavel, setResponsavel] = useState('');
  const [mestre, setMestre] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!obraEdicao) return;
    setNome(obraEdicao.nome || '');
    setTipo(obraEdicao.tipo || 'Residencial');
    setEndereco(obraEdicao.logradouro || obraEdicao.endereco || '');
    setCidade(obraEdicao.cidade || '');
    setOrcamento(String(obraEdicao.orcamentoNumero ?? obraEdicao.orcamento ?? '').replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.'));
    setEntrega(obraEdicao.entrega && obraEdicao.entrega !== '—' ? obraEdicao.entrega : '');
    setResponsavel(obraEdicao.responsavel === '—' ? '' : (obraEdicao.responsavel || ''));
    setMestre(obraEdicao.equipe?.mestre === '—' ? '' : (obraEdicao.equipe?.mestre || ''));
  }, [obraEdicao?.id]);

  function aoEscolherData(evento, dataEscolhida) {
    setMostrarCalendario(Platform.OS === 'ios');
    if (dataEscolhida) {
      setData(dataEscolhida);
      const dia = String(dataEscolhida.getDate()).padStart(2, '0');
      const mes = String(dataEscolhida.getMonth() + 1).padStart(2, '0');
      setEntrega(`${dia}/${mes}/${dataEscolhida.getFullYear()}`);
    }
  }

  async function criarObra() {
    if (nome.trim() === '' || endereco.trim() === '') {
      alert('Preencha pelo menos o nome e o endereço da obra.');
      return;
    }
    if (!usuario) {
      alert('Entre na sua conta novamente.');
      return;
    }

    // aceita "450000", "450.000" ou "450.000,50"
    const valor = Number(orcamento.replace(/\./g, '').replace(',', '.')) || 0;

    setSalvando(true);
    try {
      const dados = {
        id_proprietario: usuario.idUsuario,
        id_usuario: usuario.idUsuario,
        nome: nome.trim(), tipo, endereco: endereco.trim(), cidade: cidade.trim(),
        orcamento: valor, entrega: entrega || null, responsavel: responsavel.trim(), mestre: mestre.trim(),
      };
      if (editando) await api.atualizarObra(obraEdicao.id, dados);
      else await api.criarObra(dados);
      alert(editando ? 'Obra atualizada!' : 'Obra criada!');
      gerenciar();
    } catch (e) {
      alert('Erro ao criar obra: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, areaSegura, areaSegura]}>
        <TouchableOpacity onPress={gerenciar}>
          <Text style={styles.seta}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{editando ? 'Editar obra' : 'Nova obra'}</Text>

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Informações da obra</Text>

            <Text style={styles.label}>Nome da obra</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Residencial Aurora"
              placeholderTextColor="#828282"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.menuOpcoes}>
              {TIPOS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.opcaoMenu, tipo === item && styles.opcaoMenuAtiva]}
                  onPress={() => setTipo(item)}
                >
                  <Text style={[styles.opcaoTexto, tipo === item && styles.opcaoTextoAtivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Endereço (rua e número)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rua das Flores, 120"
              placeholderTextColor="#828282"
              value={endereco}
              onChangeText={setEndereco}
            />

            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Embu das Artes"
              placeholderTextColor="#828282"
              value={cidade}
              onChangeText={setCidade}
            />

            <View style={styles.linhaCampos}>
              <View style={styles.campoMetade}>
                <Text style={styles.label}>Orçamento (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="450000,00"
                  placeholderTextColor="#828282"
                  keyboardType="decimal-pad"
                  value={orcamento}
                  onChangeText={setOrcamento}
                />
              </View>

              <View style={styles.campoMetade}>
                <Text style={styles.label}>Previsão de entrega</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setMostrarCalendario(true)}>
                  <Text style={entrega ? styles.valorTexto : styles.placeholderTexto}>
                    {entrega || 'DD/MM/AAAA'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {mostrarCalendario && (
              <DateTimePicker
                value={data}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onValueChange={(evento, dataEscolhida) => aoEscolherData(evento, dataEscolhida)}
                onDismiss={() => setMostrarCalendario(false)}
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Responsável técnico (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Eng. Marina Duarte"
              placeholderTextColor="#828282"
              value={responsavel}
              onChangeText={setResponsavel}
            />

            <Text style={styles.label}>Mestre de obras (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Batista"
              placeholderTextColor="#828282"
              value={mestre}
              onChangeText={setMestre}
            />

            <View style={styles.botoesRow}>
              <TouchableOpacity style={styles.cancelarBotao} onPress={gerenciar}>
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.salvarBotao, salvando && { opacity: 0.6 }]}
                onPress={criarObra}
                disabled={salvando}
              >
                <Text style={styles.salvarTexto}>{salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar obra'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BarraInferior ativo="gerenciar" />
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
  seta: {
    fontSize: 20,
    color: '#000000',
    marginLeft: '5%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -24,
    marginBottom: 12,
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  formTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#000000',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#000000',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  placeholderTexto: {
    fontSize: 13,
    color: '#828282',
  },
  valorTexto: {
    fontSize: 13,
    color: '#000000',
  },
  linhaCampos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campoMetade: {
    width: '48%',
  },
  menuOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  opcaoMenu: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  opcaoMenuAtiva: {
    borderColor: '#F57C00',
    backgroundColor: '#FFF4E5',
  },
  opcaoTexto: {
    fontSize: 12,
    color: '#828282',
  },
  opcaoTextoAtivo: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelarBotao: {
    width: '48%',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelarTexto: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  salvarBotao: {
    width: '48%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  salvarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});