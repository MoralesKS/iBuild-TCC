import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroAutonomos() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userProfissao, setUserProfissao] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const contentWidth = Math.min(width - 32, 375);
  const inputWidth = Math.min(width - 48, 327);
  const buttonWidth = (inputWidth - 16) / 2;

  const logoWidth = Math.min(width * 0.85, 340);
  const logoHeight = logoWidth * 0.5;

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validarCPF(cpf) {
    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(numeros)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(numeros.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
      resto = 0;
    }

    if (resto !== Number(numeros.charAt(9))) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(numeros.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
      resto = 0;
    }

    return resto === Number(numeros.charAt(10));
  }

  function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');

    if (numeros.length !== 11) {
      return false;
    }

    const ddd = Number(numeros.substring(0, 2));

    if (ddd < 11 || ddd > 99) {
      return false;
    }

    if (numeros.charAt(2) !== '9') {
      return false;
    }

    if (/^(\d)\1+$/.test(numeros)) {
      return false;
    }

    return true;
  }

  function validarNome(nome) {
    const nomeLimpo = nome.trim();

    if (nomeLimpo.length < 3) {
      return false;
    }

    const partes = nomeLimpo.split(/\s+/);

    if (partes.length < 2) {
      return false;
    }

    return /^[A-Za-zÀ-ÿ\s]+$/.test(nomeLimpo);
  }

  function validarProfissao(profissao) {
    return profissao.trim().length >= 3;
  }

  function novoUser() {
    const nomeValido = validarNome(userNome);
    const cpfValido = validarCPF(userCPF);
    const telefoneValido = validarTelefone(userTelefone);
    const emailValido = validarEmail(userMail);
    const profissaoValida = validarProfissao(userProfissao);

    if (
      userMail.trim() === '' ||
      userPass === '' ||
      confirmePass === '' ||
      userNome.trim() === '' ||
      userCPF.trim() === '' ||
      userTelefone.trim() === '' ||
      userProfissao.trim() === ''
    ) {
      alert('Todos os campos devem ser preenchidos');
      return;
    }

    if (!nomeValido) {
      alert('Informe seu nome completo corretamente');
      return;
    }

    if (!cpfValido) {
      alert('Informe um CPF válido');
      return;
    }

    if (!telefoneValido) {
      alert('Informe um telefone celular válido');
      return;
    }

    if (!profissaoValida) {
      alert('Informe uma profissão ou área de atuação válida');
      return;
    }

    if (!emailValido) {
      alert('Informe um e-mail válido');
      return;
    }

    if (userPass.length < 6) {
      alert('A senha deve possuir pelo menos 6 caracteres');
      return;
    }

    if (userPass !== confirmePass) {
      alert('A senha e a confirmação não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, userMail.trim(), userPass)
      .then(() => {
        alert('Conta criada com sucesso!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Este e-mail já está cadastrado');
        } else if (error.code === 'auth/invalid-email') {
          alert('O e-mail informado é inválido');
        } else if (error.code === 'auth/weak-password') {
          alert('A senha é muito fraca');
        } else {
          alert(error.message);
        }
      });
  }

  function voltar() {
    navigation.navigate('Cadastro');
  }

  function formatarTelefone(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function formatarCPF(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

    if (numeros.length <= 3) {
      return numeros;
    }

    if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    }

    if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    }

    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  }

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height }
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { width: contentWidth + 32 }]}>
            <View style={styles.logoView}>
              <Image
                source={require('../assets/IBuild.jpg')}
                style={{
                  width: logoWidth,
                  height: logoHeight,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.textView, { width: contentWidth }]}>
              <Text style={styles.titulo}>
                Crie sua nova conta
              </Text>

              <Text style={styles.subTitulo}>
                Cadastre-se para oferecer seus serviços no aplicativo
              </Text>

              <TextInput
                style={[styles.textInput, { width: inputWidth }]}
                value={userNome}
                onChangeText={setUserNome}
                placeholder="Nome completo"
                placeholderTextColor="#828282"
                autoCapitalize="words"
              />

              <TextInput
                style={[styles.textInput, { width: inputWidth }]}
                value={userCPF}
                onChangeText={(t) => setUserCPF(formatarCPF(t))}
                placeholder="CPF: XXX.XXX.XXX-XX"
                placeholderTextColor="#828282"
                keyboardType="numeric"
                maxLength={14}
              />

              <TextInput
                style={[styles.textInput, { width: inputWidth }]}
                value={userProfissao}
                onChangeText={setUserProfissao}
                placeholder="Profissão / área de atuação"
                placeholderTextColor="#828282"
                autoCapitalize="words"
              />

              <TextInput
                style={[styles.textInput, { width: inputWidth }]}
                value={userTelefone}
                onChangeText={(t) => setUserTelefone(formatarTelefone(t))}
                placeholder="Telefone: (XX) XXXXX-XXXX"
                placeholderTextColor="#828282"
                keyboardType="numeric"
                maxLength={15}
              />

              <TextInput
                style={[styles.textInput, { width: inputWidth }]}
                value={userMail}
                onChangeText={setUserMail}
                placeholder="Email"
                placeholderTextColor="#828282"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View
                style={[
                  styles.passwordContainer,
                  { width: inputWidth }
                ]}
              >
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
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#828282"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.passwordContainer,
                  { width: inputWidth }
                ]}
              >
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
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#828282"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.botoesRow,
                  { width: inputWidth }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.voltar,
                    { width: buttonWidth }
                  ]}
                  onPress={voltar}
                >
                  <Text style={styles.voltarText}>
                    Voltar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.cadastrar,
                    { width: buttonWidth }
                  ]}
                  onPress={novoUser}
                >
                  <Text style={styles.cadastrarText}>
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.espacamento} />

              <Text style={styles.termos}>
                Ao clicar em Cadastrar, você concorda com os nossos{' '}
                {'\n'}
                <Text style={styles.termosLink}>
                  Termos de Serviço
                </Text>
                {' '}e com a{' '}
                <Text style={styles.termosLink}>
                  Política de Privacidade
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  logoView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  textView: {
    alignItems: 'center',
    marginBottom: 20,
  },

  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  subTitulo: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 5,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000000',
    paddingHorizontal: 12,
  },

  iconArea: {
    height: '100%',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  voltar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  cadastrar: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  voltarText: {
    color: '#F57C00',
    fontWeight: 'bold',
  },

  cadastrarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  espacamento: {
    height: 16,
  },

  termos: {
    color: '#828282',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 5,
  },

  termosLink: {
    color: '#24BF1E',
  },
});


