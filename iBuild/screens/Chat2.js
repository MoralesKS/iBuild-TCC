import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../componentes/Avatar';
import { voltar } from '../src/navegacao';
import { api, useUsuario } from '../src/api';
import { useChat } from '../src/useChat';

export default function Chat2({ route, navigation }) {
  const { pessoa, nome } = route.params || {};

  if (!pessoa) {
    return null;
  }

  return (
    <Conversa
      key={pessoa}
      pessoa={pessoa}
      nome={nome}
      navigation={navigation}
    />
  );
}

function Conversa({ pessoa, nome, navigation }) {
  const { usuario } = useUsuario();
  const [texto, setTexto] = useState('');
  const [versao, setVersao] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [foto, setFoto] = useState(null);
  const tentativa = useRef(null);
  const trava = useRef(false);
  const { dados, erro } = useChat(pessoa, versao);

  useEffect(() => {
    let ativo = true;

    api.usuario(pessoa)
      .then((perfil) => {
        if (ativo) setFoto(perfil.foto);
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, [pessoa]);

  async function enviar() {
    const mensagem = texto.trim();

    if (!mensagem || trava.current) return;

    trava.current = true;
    setEnviando(true);

    if (tentativa.current?.mensagem !== mensagem) {
      tentativa.current = {
        mensagem,
        chave: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
    }

    try {
      await api.enviarMensagem(
        pessoa,
        mensagem,
        tentativa.current.chave,
      );

      tentativa.current = null;
      setTexto('');
      setVersao((atual) => atual + 1);
    } catch (erroEnvio) {
      Alert.alert('Mensagem não confirmada', erroEnvio.message);
    } finally {
      trava.current = false;
      setEnviando(false);
    }
  }

  function renderMensagem({ item, index }) {
    const posicao = dados.length - 1 - index;
    const anterior = dados[posicao - 1];
    const seguinte = dados[posicao + 1];
    const data = String(item.criada_em || '');
    const dia = data.slice(0, 10);
    const hora = data.slice(11, 16);
    const iniciaDia = dia !== anterior?.criada_em?.slice(0, 10);

    function mesmaSequencia(outra) {
      return (
        outra &&
        String(outra.remetente) === String(item.remetente) &&
        outra.criada_em?.slice(0, 16) === data.slice(0, 16)
      );
    }

    const ultimaDaSequencia = !mesmaSequencia(seguinte);
    const minhaMensagem =
      String(item.remetente) === String(usuario?.idUsuario);

    const [ano, mes, numeroDia] = dia.split('-').map(Number);

    return (
      <View>
        {iniciaDia && numeroDia > 0 && (
          <Text style={styles.data}>
            {new Date(ano, mes - 1, numeroDia).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        )}

        <View
          style={[
            styles.linhaMensagem,
            minhaMensagem && styles.linhaMinha,
            { marginTop: mesmaSequencia(anterior) ? 2 : 10 },
          ]}
        >
          {!minhaMensagem && (
            <View style={styles.espacoFoto}>
              {ultimaDaSequencia && (
                <Avatar source={foto} style={styles.fotoPequena} />
              )}
            </View>
          )}

          <View
            style={[
              styles.balao,
              minhaMensagem ? styles.balaoMeu : styles.balaoRecebido,
            ]}
          >
            <Text
              style={[
                styles.textoMensagem,
                minhaMensagem && styles.textoMensagemMinha,
              ]}
            >
              {item.texto}
            </Text>
          </View>
        </View>

        {ultimaDaSequencia && !!hora && (
          <Text
            style={[
              styles.horario,
              minhaMensagem ? styles.horarioMeu : styles.horarioRecebido,
            ]}
          >
            {hora}
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.conteudo}
      >
        <View style={styles.cabecalho}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.botaoVoltar}
            onPress={() => voltar(navigation, 'Chat 1')}
          >
            <Ionicons name="chevron-back" size={25} color="#111" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.contato}
            onPress={() =>
              navigation.push('PerfilAutonomo', { usuarioId: pessoa })
            }
          >
            <Avatar source={foto} style={styles.foto} />

            <View style={styles.conteudo}>
              <Text numberOfLines={1} style={styles.nome}>
                {nome}
              </Text>
              <Text style={styles.linkPerfil}>Ver perfil</Text>
            </View>
          </TouchableOpacity>
        </View>

        {!!erro && (
          <Text accessibilityRole="alert" style={styles.erro}>
            {erro}
          </Text>
        )}

        <FlatList
          inverted
          data={[...dados].reverse()}
          keyExtractor={(mensagem) => String(mensagem.id)}
          contentContainerStyle={styles.lista}
          renderItem={renderMensagem}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.campoMensagem}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            editable={!enviando}
            multiline
            maxLength={2000}
            placeholder="Mensagem..."
            placeholderTextColor="#808080"
            accessibilityLabel="Mensagem"
            style={styles.input}
          />

          {!!texto.trim() && (
            <TouchableOpacity
              disabled={enviando}
              accessibilityRole="button"
              accessibilityLabel="Enviar"
              onPress={enviar}
              style={styles.botaoEnviar}
            >
              <Ionicons
                name={enviando ? 'time-outline' : 'arrow-up-circle'}
                size={28}
                color="#111"
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conteudo: {
    flex: 1,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    minHeight: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  botaoVoltar: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contato: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 52,
  },
  foto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nome: {
    color: '#111',
    fontWeight: '700',
    fontSize: 16,
  },
  linkPerfil: {
    color: '#666',
    fontSize: 12,
    marginTop: 1,
  },
  lista: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  data: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#777',
    fontSize: 12,
  },
  linhaMensagem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  linhaMinha: {
    justifyContent: 'flex-end',
  },
  espacoFoto: {
    width: 32,
  },
  fotoPequena: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  balao: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 17,
  },
  balaoMeu: {
    backgroundColor: '#080808',
    borderBottomRightRadius: 5,
  },
  balaoRecebido: {
    backgroundColor: '#e9e9eb',
    borderBottomLeftRadius: 5,
  },
  textoMensagem: {
    fontSize: 15,
    color: '#111',
    lineHeight: 21,
  },
  textoMensagemMinha: {
    color: '#fff',
  },
  horario: {
    fontSize: 11,
    color: '#5b5b5b',
    marginTop: 4,
  },
  horarioMeu: {
    textAlign: 'right',
  },
  horarioRecebido: {
    marginLeft: 34,
  },
  campoMensagem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    borderColor: '#d8d8da',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    color: '#111',
    fontSize: 15,
    paddingVertical: 9,
  },
  botaoEnviar: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erro: {
    color: '#963c32',
    padding: 10,
  },
});