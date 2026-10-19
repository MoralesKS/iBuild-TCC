import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { auth } from '../firebase.config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const contentWidth = Math.min(width - 32, 375);
  const buttonWidth = (contentWidth - 16) / 2;
  const logoWidth = Math.min(width * 0.85, 340);
  const logoHeight = logoWidth * 0.5;

  function userLogin() {
    signInWithEmailAndPassword(auth, userMail, userPass)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function cadastrar() {
    navigation.navigate('Cadastro');
  }

  function replacePass() {
    navigation.navigate('RedefinicaoSenha');
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: height }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { width: contentWidth + 32 }]}>
          <View style={styles.logoView}>
            <Image
              style={{
                width: logoWidth,
                height: logoHeight,
                borderRadius: 8,
              }}
              source={require('../assets/IBuild.jpg')}
              resizeMode="contain"
            />
          </View>

          <View style={[styles.textView, { width: contentWidth }]}>
            <Text style={styles.titulo}>Entre na sua conta</Text>

            <Text style={styles.subTitulo}>
              Insira seu e-mail para se cadastrar neste aplicativo
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Informe o Email"
              placeholderTextColor="#828282"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              value={userMail}
              onChangeText={setUserMail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Informe a Senha"
                placeholderTextColor="#828282"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                value={userPass}
                onChangeText={setUserPass}
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

            <TouchableOpacity
              onPress={replacePass}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <View style={styles.alinhar}>
              <TouchableOpacity
                style={[
                  styles.continuar,
                  { width: buttonWidth }
                ]}
                onPress={userLogin}
              >
                <Text style={styles.continuarText}>
                  Continuar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.criarConta,
                  { width: buttonWidth }
                ]}
                onPress={cadastrar}
              >
                <Text style={styles.criarContaText}>
                  Criar Conta
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.espacamento} />

            <View style={styles.divisor}>
              <View style={styles.linha} />
              <Text style={styles.ou}>Ou</Text>
              <View style={styles.linha} />
            </View>

            <View style={styles.espacamento} />

            <TouchableOpacity style={styles.continuar2}>
              <Image
                style={styles.socialIcon}
                source={require('../assets/Google.png')}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>
                Continuar com o Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.continuar2}>
              <Image
                style={styles.socialIcon}
                source={require('../assets/Apple.png')}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>
                Continuar com a Apple
              </Text>
            </TouchableOpacity>

            <View style={styles.espacamento} />

            <Text style={styles.termos}>
              Ao clicar em continuar, você concorda com os nossos{' '}
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
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
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
  },

  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 6,
  },

  subTitulo: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 5,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    height: 44,
    width: '100%',
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 4,
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

  forgotButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
  },

  forgotText: {
    fontSize: 13,
    color: '#828282',
  },

  alinhar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  continuar: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  criarConta: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  continuarText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  criarContaText: {
    color: '#F57C00',
    fontSize: 14,
  },

  divisor: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  ou: {
    color: '#E0E0E0',
    fontSize: 14,
    marginHorizontal: 10,
  },

  continuar2: {
    backgroundColor: '#EEEEEE',
    minHeight: 44,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },

  socialIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },

  socialText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#000000',
  },

  espacamento: {
    height: 20,
  },

  termos: {
    color: '#828282',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 5,
  },

  termosLink: {
    color: '#24BF1E',
  },
});