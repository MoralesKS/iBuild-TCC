import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  signInWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '../firebase.config.js';


export default function Login() {

  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();


  async function userLogin() {

    if (!userMail.trim() || !userPass) {
      alert('Informe seu e-mail e sua senha.');
      return;
    }

    try {

      setCarregando(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          userMail.trim().toLowerCase(),
          userPass
        );

      const user = userCredential.user;

      console.log(
        'Usuário autenticado:',
        user.uid
      );

      navigation.navigate('Home');


    } catch (error) {

      console.error(
        'Erro ao realizar login:',
        error
      );


      if (
        error.code === 'auth/invalid-email'
      ) {

        alert('Digite um e-mail válido.');

      } else if (
        error.code === 'auth/invalid-credential'
      ) {

        alert('E-mail ou senha incorretos.');

      } else if (
        error.code === 'auth/user-disabled'
      ) {

        alert(
          'Esta conta foi desativada.'
        );

      } else if (
        error.code === 'auth/too-many-requests'
      ) {

        alert(
          'Muitas tentativas de login. Tente novamente mais tarde.'
        );

      } else if (
        error.code === 'auth/network-request-failed'
      ) {

        alert(
          'Não foi possível conectar ao Firebase. Verifique sua internet.'
        );

      } else {

        alert(
          'Não foi possível realizar o login.'
        );

      }

    } finally {

      setCarregando(false);

    }
  }


  function cadastrar() {
    navigation.navigate('Cadastro');
  }


  return (

    <View style={styles.container}>

      <View style={styles.logoView}>

        <Image
          style={styles.logo}
          source={require('../assets/IBuild.jpg')}
          resizeMode="contain"
        />

      </View>


      <View style={styles.textView}>

        <Text style={styles.titulo}>
          Entre na sua conta
        </Text>

        <Text style={styles.subTitulo}>
          Insira seu e-mail e sua senha para acessar o IBuild
        </Text>


        <TextInput
          style={styles.textInput}
          placeholder="Informe o Email"
          placeholderTextColor="#828282"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          value={userMail}
          onChangeText={setUserMail}
        />


        <TextInput
          style={styles.textInput}
          placeholder="Informe a Senha"
          placeholderTextColor="#828282"
          autoCapitalize="none"
          secureTextEntry
          value={userPass}
          onChangeText={setUserPass}
          onSubmitEditing={userLogin}
        />


        <TouchableOpacity
          style={[
            styles.continuar,
            carregando && styles.botaoDesabilitado
          ]}
          onPress={userLogin}
          disabled={carregando}
        >

          <Text style={styles.textoBotao}>

            {
              carregando
                ? 'Entrando...'
                : 'Continuar'
            }

          </Text>

        </TouchableOpacity>


        <View style={styles.espacamentoPequeno} />


        <View style={styles.cadastroRow}>

          <Text style={styles.textoSecundario}>
            Não possui conta?
          </Text>

          <TouchableOpacity
            onPress={cadastrar}
          >

            <Text style={styles.linkCadastro}>
              Cadastre-se
            </Text>

          </TouchableOpacity>

        </View>


        <View style={styles.espacamento} />


        <View style={styles.ouContainer}>

          <View style={styles.linha} />

          <Text style={styles.ouTexto}>
            Ou
          </Text>

          <View style={styles.linha} />

        </View>


        <View style={styles.espacamentoPequeno} />


        <TouchableOpacity
          style={styles.continuar2}
        >

          <Text style={styles.textoSocial}>
            Continuar com o Google
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.continuar2}
        >

          <Text style={styles.textoSocial}>
            Continuar com a Apple
          </Text>

        </TouchableOpacity>


        <View style={styles.espacamento} />


        <Text style={styles.termos}>

          Ao clicar em continuar, você concorda com os nossos {'\n'}

          <Text style={styles.linkTermos}>
            Termos de Serviço
          </Text>

          {' '}e com a{' '}

          <Text style={styles.linkTermos}>
            Política de Privacidade
          </Text>

        </Text>

      </View>

    </View>
  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginBottom: '10%',
  },

  logoView: {
    height: 130,
    width: 258,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    height: 130,
    width: 258,
    borderRadius: 8,
  },

  textView: {
    width: 375,
    alignItems: 'center',
  },

  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
  },

  subTitulo: {
    color: '#000000',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },

  textInput: {
    backgroundColor: '#FFFFFF',

    // Antes estava #E0E0E0.
    // Agora o que o usuário digita fica visível.
    color: '#000000',

    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 12,
  },

  continuar: {
    backgroundColor: '#F57C00',
    height: 40,
    width: 327,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  cadastroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textoSecundario: {
    color: '#828282',
    fontSize: 12,
  },

  linkCadastro: {
    color: '#24BF1E',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  ouContainer: {
    flexDirection: 'row',
    width: 327,
    alignItems: 'center',
  },

  linha: {
    height: 1,
    backgroundColor: '#E0E0E0',
    flex: 1,
  },

  ouTexto: {
    color: '#828282',
    fontSize: 12,
    marginHorizontal: 10,
  },

  continuar2: {
    backgroundColor: '#EEEEEE',
    height: 40,
    width: 327,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },

  textoSocial: {
    fontWeight: '500',
    fontSize: 14,
  },

  espacamento: {
    height: 24,
  },

  espacamentoPequeno: {
    height: 8,
  },

  termos: {
    color: '#828282',
    fontSize: 12,
    textAlign: 'center',
  },

  linkTermos: {
    color: '#24BF1E',
  },

});