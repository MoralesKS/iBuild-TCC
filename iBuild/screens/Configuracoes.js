import { useEffect, useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, ScrollView, Image,
  KeyboardAvoidingView, Platform, Alert, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAppNavigation } from '../src/Functions';
import { api, sair, useUsuario } from '../src/api';
import BarraInferior from '../src/BarraInferior';

function formatarTelefone(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export default function Configuracoes() {
  const navigation = useNavigation();
  const { perfil } = useAppNavigation();
  const { usuario, recarregarUsuario } = useUsuario();

  const [nome, setNome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [bio, setBio] = useState('');
  const [profissao, setProfissao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  // Preenche os campos quando o perfil carregar
  useEffect(() => {
    if (!usuario) return;
    setNome(usuario.nomePessoa || '');
    setRazaoSocial(usuario.razaoSocial || '');
    setTelefone(usuario.telefone || '');
    setCidade(usuario.cidade || '');
    setBio(usuario.bio || '');
    setProfissao(usuario.tipoPerfil === 'autonomo' ? usuario.profissao || '' : '');
  }, [usuario?.idUsuario]);

  async function escolherFoto() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (resultado.canceled) return;

    const imagem = resultado.assets[0];
    const extensao = (imagem.uri.split('?')[0].split('.').pop() || 'jpg').toLowerCase();

    setEnviandoFoto(true);
    try {
      await api.enviarFoto(usuario.idUsuario, imagem.base64, extensao);
      await recarregarUsuario();
    } catch (e) {
      alert('Erro ao enviar a foto: ' + e.message);
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function salvar() {
    if (nome.trim() === '') {
      alert('O nome não pode ficar vazio.');
      return;
    }
    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), telefone, cidade: cidade.trim(), bio: bio.trim() };
      if (usuario.tipoPerfil === 'loja') dados.razao_social = razaoSocial.trim();
      if (usuario.tipoPerfil === 'autonomo') dados.profissao = profissao.trim();

      await api.atualizarUsuario(usuario.idUsuario, dados);
      await recarregarUsuario();
      alert('Perfil atualizado!');
      perfil();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  function confirmarSaida() {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await sair();
            navigation.navigate('Login');
          } catch (e) {
            alert(e.message);
          }
        },
      },
    ]);
  }

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Configurações</Text>
        <Text style={styles.carregando}>Carregando perfil...</Text>
      </View>
    );
  }

  const ehLoja = usuario.tipoPerfil === 'loja';
  const ehAutonomo = usuario.tipoPerfil === 'autonomo';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <TouchableOpacity onPress={perfil}>
          <Text style={styles.seta}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Configurações</Text>

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Foto */}
          <View style={styles.fotoArea}>
            <TouchableOpacity onPress={escolherFoto} disabled={enviandoFoto}>
              <Image style={styles.avatar} source={usuario.foto} />
              <View style={styles.editarBadge}>
                <Text style={styles.editarTexto}>✎</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.fotoDica}>
              {enviandoFoto ? 'Enviando foto...' : 'Toque na foto para alterar'}
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Informações do perfil</Text>

            {ehLoja && (
              <>
                <Text style={styles.label}>Nome da loja (razão social)</Text>
                <TextInput
                  style={styles.input}
                  value={razaoSocial}
                  onChangeText={setRazaoSocial}
                  placeholder="Razão social"
                  placeholderTextColor="#828282"
                />
              </>
            )}

            <Text style={styles.label}>{ehLoja ? 'Nome do responsável' : 'Nome completo'}</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome"
              placeholderTextColor="#828282"
              autoCapitalize="words"
            />

            {ehAutonomo && (
              <>
                <Text style={styles.label}>Profissão / área de atuação</Text>
                <TextInput
                  style={styles.input}
                  value={profissao}
                  onChangeText={setProfissao}
                  placeholder="Ex: Eletricista"
                  placeholderTextColor="#828282"
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={(t) => setTelefone(formatarTelefone(t))}
              placeholder="(XX) XXXXX-XXXX"
              placeholderTextColor="#828282"
              keyboardType="numeric"
              maxLength={15}
            />

            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={cidade}
              onChangeText={setCidade}
              placeholder="Ex: Embu das Artes"
              placeholderTextColor="#828282"
            />

            <Text style={styles.label}>Sobre você</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre você ou sua empresa"
              placeholderTextColor="#828282"
              multiline
              maxLength={200}
            />
            <Text style={styles.contador}>{bio.length}/200</Text>

            <Text style={styles.label}>E-mail (não pode ser alterado)</Text>
            <View style={[styles.input, styles.inputBloqueado]}>
              <Text style={styles.emailTexto}>{usuario.email}</Text>
            </View>

            <TouchableOpacity
              style={[styles.salvarBotao, salvando && { opacity: 0.6 }]}
              onPress={salvar}
              disabled={salvando}
            >
              <Text style={styles.salvarTexto}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.sairBotao} onPress={confirmarSaida}>
            <Text style={styles.sairTexto}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>

        <BarraInferior ativo="perfil" />
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
  carregando: {
    textAlign: 'center',
    color: '#828282',
    marginTop: 40,
  },
  fotoArea: {
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0F0F0',
  },
  editarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editarTexto: {
    fontSize: 13,
    color: '#000000',
  },
  fotoDica: {
    fontSize: 11,
    color: '#828282',
    marginTop: 8,
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
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
    justifyContent: 'center',
  },
  inputBloqueado: {
    backgroundColor: '#F5F5F5',
  },
  emailTexto: {
    fontSize: 13,
    color: '#828282',
  },
  bioInput: {
    height: 80,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  contador: {
    fontSize: 9,
    color: '#828282',
    textAlign: 'right',
    marginTop: 2,
  },
  salvarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  salvarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sairBotao: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  sairTexto: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});