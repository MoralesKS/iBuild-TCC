import { voltar as voltarTela } from '../src/navegacao';
import { useEffect, useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation } from '../src/Functions';
import { api, coordenadasDoEndereco, escolherImagens, formatarTelefone, sair, useUsuario } from '../src/api';
import FotoProduto from '../src/FotoProduto';
import BarraInferior from '../src/BarraInferior';
import { useAreaSegura } from '../src/responsivo';

// Alert com "Sim/Não" que devolve true/false
const confirmar = (titulo, mensagem, sim = 'Sim') =>
  new Promise((resolve) =>
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Não', style: 'cancel', onPress: () => resolve(false) },
        { text: sim, onPress: () => resolve(true) },
      ],
      { onDismiss: () => resolve(false) }
    )
  );

export default function Configuracoes() {
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();
  const { perfil } = useAppNavigation();
  const { usuario, recarregarUsuario, erroPerfil } = useUsuario();

  // Perfil (todos)
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [bio, setBio] = useState('');
  const [profissao, setProfissao] = useState('');   // autônomo

  // Card da loja (só lojista)
  const [razaoSocial, setRazaoSocial] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [uf, setUf] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [enviandoFotoLoja, setEnviandoFotoLoja] = useState(false);

  // Preenche os campos quando o perfil carregar
  useEffect(() => {
    if (!usuario) return;
    const e = usuario.endereco || {};
    setNome(usuario.nomePessoa || '');
    setTelefone(usuario.telefone || '');
    setCidade(e.cidade || usuario.cidade || '');
    setBio(usuario.bio || '');
    setProfissao(usuario.tipoPerfil === 'autonomo' ? usuario.profissao || '' : '');
    setRazaoSocial(usuario.razaoSocial || '');
    setEndereco(e.logradouro || '');
    setBairro(e.bairro || '');
    setUf(e.estado || '');
  }, [usuario?.idUsuario]);

  async function trocarFotoPerfil() {
    const [imagem] = await escolherImagens({ multiplo: false, aspecto: [1, 1] });
    if (!imagem) return;
    setEnviandoFoto(true);
    try {
      await api.enviarFoto(usuario.idUsuario, imagem.base64, imagem.ext);
      await recarregarUsuario();
    } catch (e) {
      alert('Erro ao enviar a foto: ' + e.message);
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function trocarFotoLoja() {
    const [imagem] = await escolherImagens({ multiplo: false });
    if (!imagem) return;
    setEnviandoFotoLoja(true);
    try {
      await api.enviarFotoLoja(usuario.idUsuario, imagem.base64, imagem.ext);
      await recarregarUsuario();
    } catch (e) {
      alert('Erro ao enviar a foto da loja: ' + e.message);
    } finally {
      setEnviandoFotoLoja(false);
    }
  }

  async function salvar() {
    if (nome.trim() === '') {
      alert('O nome não pode ficar vazio.');
      return;
    }
    const ehLoja = usuario.tipoPerfil === 'loja';
    if (ehLoja) {
      if (razaoSocial.trim().length < 2) {
        alert('Informe o nome da loja.');
        return;
      }
      if (endereco.trim().length < 3 || cidade.trim().length < 2 || uf.length !== 2) {
        alert('Preencha o endereço da loja: rua e número, cidade e UF.');
        return;
      }
    }

    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), telefone, cidade: cidade.trim(), bio: bio.trim() };
      if (usuario.tipoPerfil === 'autonomo') dados.profissao = profissao.trim();

      if (ehLoja) {
        dados.razao_social = razaoSocial.trim();

        // Só procura as coordenadas de novo se o endereço mudou
        const atual = usuario.endereco || {};
        const mudou =
          endereco.trim() !== (atual.logradouro || '') ||
          bairro.trim() !== (atual.bairro || '') ||
          cidade.trim() !== (atual.cidade || '') ||
          uf !== (atual.estado || '') ||
          atual.latitude == null;

        if (mudou) {
          const consulta = `${endereco.trim()}, ${bairro.trim()}, ${cidade.trim()} - ${uf}, Brasil`;
          let coord = await coordenadasDoEndereco(consulta, { fallbackGps: false });
          if (!coord) {
            const usar = await confirmar(
              'Endereço não encontrado',
              'Não consegui localizar esse endereço no mapa. Quer usar a sua localização atual como a posição da loja?',
              'Usar minha localização'
            );
            if (!usar) return;
            coord = await coordenadasDoEndereco(consulta, { fallbackGps: true });
            if (!coord) {
              alert('Não consegui obter a sua localização. Confira a permissão de localização do app.');
              return;
            }
          }
          dados.endereco = {
            logradouro: endereco.trim(),
            bairro: bairro.trim(),
            cidade: cidade.trim(),
            estado: uf,
            latitude: coord.latitude,
            longitude: coord.longitude,
          };
        }
      }

      await api.atualizarUsuario(usuario.idUsuario, dados);
      await recarregarUsuario();
      alert(ehLoja ? 'Perfil e card da loja atualizados!' : 'Perfil atualizado!');
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
          } catch (e) {
            alert(e.message);
          }
        },
      },
    ]);
  }

  if (!usuario) {
    return (
      <View style={[styles.container, areaSegura]}>
        <Text style={styles.titulo}>Configurações</Text>
        <Text style={styles.carregando}>{erroPerfil || "Carregando perfil…"}</Text><TouchableOpacity onPress={() => voltarTela(navigation, 'Home')}><Text>Voltar</Text></TouchableOpacity><TouchableOpacity onPress={recarregarUsuario}><Text>Tentar novamente</Text></TouchableOpacity>
      </View>
    );
  }

  const ehLoja = usuario.tipoPerfil === 'loja';
  const ehAutonomo = usuario.tipoPerfil === 'autonomo';

  // Mesmo texto que o Mapa mostra no card
  const enderecoNoCard = [
    endereco.trim(),
    bairro.trim(),
    [cidade.trim(), uf].filter(Boolean).join(' - '),
  ].filter(Boolean).join(' • ');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, areaSegura]}>
        <TouchableOpacity onPress={() => voltarTela(navigation, 'Perfil')}>
          <Text style={styles.seta}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Configurações</Text>

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Foto do perfil */}
          <View style={styles.fotoArea}>
            <TouchableOpacity onPress={trocarFotoPerfil} disabled={enviandoFoto}>
              <FotoProduto style={styles.avatar} source={usuario.foto} />
              <View style={styles.editarBadge}>
                <Text style={styles.editarTexto}>✎</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.fotoDica}>
              {enviandoFoto ? 'Enviando foto...' : 'Toque na foto para alterar'}
            </Text>
          </View>

          {/* ===== CARD DA LOJA (só lojista) ===== */}
          {ehLoja && (
            <View style={styles.formCard}>
              <Text style={styles.formTitulo}>Card da loja no Mapa</Text>
              <Text style={styles.cardDica}>
                É assim que os clientes veem a sua loja quando tocam no pin do mapa.
              </Text>

              {/* Pré-visualização (muda enquanto você digita) */}
              <View style={styles.lojaCard}>
                <TouchableOpacity onPress={trocarFotoLoja} disabled={enviandoFotoLoja} activeOpacity={0.85}>
                  <FotoProduto style={styles.lojaImagem} source={usuario.fotoLoja} />
                  <View style={styles.fotoTrocar}>
                    <Text style={styles.fotoTrocarTexto}>
                      {enviandoFotoLoja
                        ? 'Enviando...'
                        : usuario.fotoLoja ? 'Trocar foto da loja' : 'Adicionar foto da loja'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.lojaInfo}>
                  <Text style={styles.lojaNome}>{razaoSocial.trim() || 'Nome da loja'}</Text>
                  <Text style={styles.lojaAvaliacao}>
                    {usuario.notaMedia} ({usuario.avaliacoes} avaliações)
                  </Text>
                  <Text style={styles.lojaEndereco}>{enderecoNoCard || 'Endereço da loja'}</Text>
                  {!!bio.trim() && (
                    <Text style={styles.lojaSobre} numberOfLines={2}>{bio.trim()}</Text>
                  )}
                </View>
              </View>

              <Text style={styles.label}>Nome da loja</Text>
              <TextInput
                style={styles.input}
                value={razaoSocial}
                onChangeText={setRazaoSocial}
                placeholder="Nome que aparece no card"
                placeholderTextColor="#828282"
                maxLength={150}
              />

              <Text style={styles.label}>Endereço (rua e número)</Text>
              <TextInput
                style={styles.input}
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Ex: Rua das Flores, 120"
                placeholderTextColor="#828282"
              />

              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                value={bairro}
                onChangeText={setBairro}
                placeholder="Ex: Centro"
                placeholderTextColor="#828282"
              />

              <View style={styles.linhaCampos}>
                <View style={styles.campoCidade}>
                  <Text style={styles.label}>Cidade</Text>
                  <TextInput
                    style={styles.input}
                    value={cidade}
                    onChangeText={setCidade}
                    placeholder="Ex: Embu das Artes"
                    placeholderTextColor="#828282"
                  />
                </View>
                <View style={styles.campoUf}>
                  <Text style={styles.label}>UF</Text>
                  <TextInput
                    style={styles.input}
                    value={uf}
                    onChangeText={(t) => setUf(t.replace(/[^A-Za-z]/g, '').toUpperCase())}
                    placeholder="SP"
                    placeholderTextColor="#828282"
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <Text style={styles.label}>Sobre a loja</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Ex: Materiais de construção e acabamento. Entregamos na região."
                placeholderTextColor="#828282"
                multiline
                maxLength={200}
              />
              <Text style={styles.contador}>{bio.length}/200</Text>
              <Text style={styles.cardDica}>
                Ao salvar um endereço novo, o pin da loja é reposicionado no Mapa.
              </Text>
            </View>
          )}

          {/* ===== INFORMAÇÕES DO PERFIL ===== */}
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Informações do perfil</Text>

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

            {!ehLoja && (
              <>
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
                  placeholder="Conte um pouco sobre você"
                  placeholderTextColor="#828282"
                  multiline
                  maxLength={200}
                />
                <Text style={styles.contador}>{bio.length}/200</Text>
              </>
            )}

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
    overflow: 'hidden',
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
  cardDica: {
    fontSize: 11,
    color: '#828282',
    marginTop: 4,
  },
  lojaCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  lojaImagem: {
    width: '100%',
    height: 110,
    backgroundColor: '#F5F5F5',
  },
  fotoTrocar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 5,
    alignItems: 'center',
  },
  fotoTrocarTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lojaInfo: {
    padding: 12,
  },
  lojaNome: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  lojaAvaliacao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  lojaEndereco: {
    fontSize: 12,
    color: '#828282',
  },
  lojaSobre: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  linhaCampos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campoCidade: {
    width: '68%',
  },
  campoUf: {
    width: '28%',
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
