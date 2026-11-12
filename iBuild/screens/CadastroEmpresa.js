import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { coordenadasDoEndereco, useUsuario } from '../src/api';
import DocumentosLegais from '../componentes/DocumentosLegais';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroEmpresa() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userRazaoSocial, setUserRazaoSocial] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCNPJ, setUserCNPJ] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userEndereco, setUserEndereco] = useState('');
  const [userBairro, setUserBairro] = useState('');
  const [userCidade, setUserCidade] = useState('');
  const [userUF, setUserUF] = useState('');
  const [aceitouDocumentos, setAceitouDocumentos] = useState(false);

  const { cadastrarUsuario } = useUsuario();

  // Estados para alternar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  async function novoUser() {
    if (
      userMail === '' ||
      userPass === '' ||
      confirmePass === '' ||
      userNome === '' ||
      userCNPJ === '' ||
      userTelefone === '' ||
      userRazaoSocial === '' ||
      userEndereco.trim() === '' ||
      userCidade.trim() === '' ||
      userUF.length !== 2
    ) {
      alert('Todos os campos devem ser preenchidos');
      return;
    }
    if (userPass !== confirmePass) {
      alert('A senha e a confirmação não coincidem');
      return;
    }
    if (!aceitouDocumentos) {
      alert('Confirme a leitura da Política de Privacidade e aceite os Termos de Serviço.');
      return;
    }

    const coord = await coordenadasDoEndereco(`${userEndereco}, ${userBairro}, ${userCidade} - ${userUF}, Brasil`);
    if (!coord) {
      alert('Não consegui localizar o endereço da loja.');
      return;
    }
    if (coord.aproximada) alert('Não achei o endereço exato; usei a sua localização atual como posição da loja.');

    try {
      await cadastrarUsuario(userMail.trim(), userPass, {
        tipo_perfil: 'loja', razao_social: userRazaoSocial.trim(), cnpj: userCNPJ,
        nome: userNome.trim(), telefone: userTelefone,
        endereco: { logradouro: userEndereco, bairro: userBairro, cidade: userCidade,
                    estado: userUF.toUpperCase(), latitude: coord.latitude, longitude: coord.longitude },
      }, aceitouDocumentos);
      alert('Loja criada! Faça o login.');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  }

  function voltar() {
    navigation.navigate('Cadastro');
  }

  function formatarCNPJ(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 14);

    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 5) {
      return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    } else if (numeros.length <= 8) {
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
    } else if (numeros.length <= 12) {
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
    } else {
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`;
    }
  }

  function formatarTelefone(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoView}>
          <Image source={require('../assets/IBuild.jpg')} style={styles.logo} />
        </View>

        <View style={styles.textView}>
          <Text style={styles.titulo}>Crie sua nova conta</Text>
          <Text style={styles.subTitulo}>Cadastre sua empresa para anunciar ou contratar</Text>

          <TextInput
            style={styles.textInput}
            value={userRazaoSocial}
            onChangeText={setUserRazaoSocial}
            placeholder="Razão social"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userCNPJ}
            onChangeText={(t) => setUserCNPJ(formatarCNPJ(t))}
            placeholder="CNPJ: XX.XXX.XXX/XXXX-XX"
            placeholderTextColor="#828282"
            keyboardType="numeric"
            maxLength={18}
          />

          <TextInput
            style={styles.textInput}
            value={userNome}
            onChangeText={setUserNome}
            placeholder="Nome do responsável"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userTelefone}
            onChangeText={(t) => setUserTelefone(formatarTelefone(t))}
            placeholder="Telefone: (XX) XXXXX-XXXX"
            placeholderTextColor="#828282"
            keyboardType="numeric"
            maxLength={15}
          />

          <TextInput
            style={styles.textInput}
            value={userEndereco}
            onChangeText={setUserEndereco}
            placeholder="Endereço da loja (rua e número)"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userBairro}
            onChangeText={setUserBairro}
            placeholder="Bairro"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userCidade}
            onChangeText={setUserCidade}
            placeholder="Cidade"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userUF}
            onChangeText={(t) => setUserUF(t.replace(/[^A-Za-z]/g, '').toUpperCase())}
            placeholder="UF (ex: SP)"
            placeholderTextColor="#828282"
            maxLength={2}
            autoCapitalize="characters"
          />

          <TextInput
            style={styles.textInput}
            value={userMail}
            onChangeText={setUserMail}
            placeholder="Email corporativo"
            placeholderTextColor="#828282"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo de Senha com Ver/Ocultar */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={userPass}
              onChangeText={setUserPass}
              placeholder="Senha"
              placeholderTextColor="#828282"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.iconArea}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#828282"
              />
            </TouchableOpacity>
          </View>

          {/* Campo de Confirmação de Senha com Ver/Ocultar */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmePass}
              onChangeText={setConfirmePass}
              placeholder="Confirme sua senha"
              placeholderTextColor="#828282"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.iconArea}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#828282"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.botoesRow}>
            <TouchableOpacity style={styles.voltar} onPress={voltar}>
              <Text style={{ color: '#F57C00', fontWeight: 'bold' }}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cadastrar} onPress={novoUser}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.espacamento} />

          <DocumentosLegais aceito={aceitouDocumentos} onAceitar={setAceitouDocumentos} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingBottom: 40,
  },
  logoView: {
    height: 100,
    width: 258,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 90,
  },
  textView: {
    width: 375,
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitulo: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'white',
    color: '#000000',
    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000000',
    paddingHorizontal: 10,
  },
  iconArea: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 327,
    margin: 8,
  },
  voltar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 40,
    width: 155,
    borderRadius: 8,
    justify: 'center',
    alignItems: 'center',
    justifyContent:'center',
  },
  cadastrar: {
    backgroundColor: '#F57C00',
    height: 40,
    width: 155,
    borderRadius: 8,
    justify: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  espacamento: {
    height: 16,
  },
});
