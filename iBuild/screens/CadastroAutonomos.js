import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  createUserWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';

import { auth } from '../firebase.config';
import { cadastrarAutonomo } from '../services/api';


export default function CadastroAutonomos() {

  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');

  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userProfissao, setUserProfissao] = useState('');

  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();


  async function novoUser() {

    if (
      !userMail ||
      !userPass ||
      !confirmePass ||
      !userNome ||
      !userCPF ||
      !userTelefone ||
      !userProfissao
    ) {
      alert('Todos os campos devem ser preenchidos.');
      return;
    }


    if (userPass !== confirmePass) {
      alert('A senha e a confirmação não coincidem.');
      return;
    }


    const cpfLimpo = userCPF.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      alert('O CPF deve possuir 11 números.');
      return;
    }


    let usuarioFirebase = null;

    try {

      setCarregando(true);


      // 1. Cria o usuário no Firebase
      const credencial =
        await createUserWithEmailAndPassword(
          auth,
          userMail.trim(),
          userPass
        );

      usuarioFirebase = credencial.user;


      // 2. Salva os dados do autônomo no MySQL
      await cadastrarAutonomo({

        firebase_uid: usuarioFirebase.uid,

        nome: userNome.trim(),

        email: userMail
          .trim()
          .toLowerCase(),

        telefone: userTelefone.trim(),

        cpf: cpfLimpo,

        profissao: userProfissao.trim(),

        descricao_profissional: null

      });


      alert(
        'Conta de autônomo criada com sucesso!'
      );

      navigation.navigate('Login');


    } catch (erro) {

      console.error(
        'Erro ao cadastrar autônomo:',
        erro
      );


      /*
        Caso o usuário tenha sido criado no Firebase,
        mas o MySQL dê erro, o usuário do Firebase
        é apagado para evitar cadastro incompleto.
      */

      if (usuarioFirebase) {

        try {

          await deleteUser(usuarioFirebase);

        } catch (erroDelete) {

          console.error(
            'Erro ao remover usuário do Firebase:',
            erroDelete
          );

        }
      }


      if (
        erro.code === 'auth/email-already-in-use'
      ) {

        alert(
          'Este e-mail já está cadastrado.'
        );

      } else if (
        erro.code === 'auth/weak-password'
      ) {

        alert(
          'A senha deve possuir pelo menos 6 caracteres.'
        );

      } else if (
        erro.code === 'auth/invalid-email'
      ) {

        alert(
          'Digite um e-mail válido.'
        );

      } else {

        alert(
          erro.message ||
          'Não foi possível realizar o cadastro.'
        );

      }

    } finally {

      setCarregando(false);

    }
  }


  function voltar() {
    navigation.navigate('Cadastro');
  }


  return (

    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.logoView}>

        <Image
          source={require('../assets/IBuild.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

      </View>


      <View style={styles.textView}>

        <Text style={styles.titulo}>
          Crie sua nova conta
        </Text>

        <Text style={styles.subTitulo}>
          Cadastre-se para oferecer seus serviços no aplicativo
        </Text>


        <TextInput
          style={styles.textInput}
          placeholder="Nome completo"
          placeholderTextColor="#828282"
          value={userNome}
          onChangeText={setUserNome}
          autoCapitalize="words"
        />


        <TextInput
          style={styles.textInput}
          placeholder="CPF"
          placeholderTextColor="#828282"
          value={userCPF}
          onChangeText={setUserCPF}
          keyboardType="numeric"
          maxLength={14}
        />


        <TextInput
          style={styles.textInput}
          placeholder="Profissão / área de atuação"
          placeholderTextColor="#828282"
          value={userProfissao}
          onChangeText={setUserProfissao}
        />


        <TextInput
          style={styles.textInput}
          placeholder="Telefone / WhatsApp"
          placeholderTextColor="#828282"
          value={userTelefone}
          onChangeText={setUserTelefone}
          keyboardType="phone-pad"
        />


        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#828282"
          value={userMail}
          onChangeText={setUserMail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />


        <TextInput
          style={styles.textInput}
          placeholder="Senha"
          placeholderTextColor="#828282"
          value={userPass}
          onChangeText={setUserPass}
          secureTextEntry
        />


        <TextInput
          style={styles.textInput}
          placeholder="Confirme sua senha"
          placeholderTextColor="#828282"
          value={confirmePass}
          onChangeText={setConfirmePass}
          secureTextEntry
        />


        <View style={styles.botoesRow}>

          <TouchableOpacity
            style={styles.voltar}
            onPress={voltar}
            disabled={carregando}
          >

            <Text
              style={{
                color: '#F57C00',
                fontWeight: 'bold'
              }}
            >
              Voltar
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.cadastrar,
              carregando && styles.botaoDesabilitado
            ]}
            onPress={novoUser}
            disabled={carregando}
          >

            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold'
              }}
            >

              {
                carregando
                  ? 'Cadastrando...'
                  : 'Cadastrar'
              }

            </Text>

          </TouchableOpacity>

        </View>


        <Text
          style={{
            color: '#828282',
            fontSize: 13,
            marginTop: 8
          }}
        >
          ou
        </Text>


        <TouchableOpacity
          style={styles.continuar2}
        >

          <Text
            style={{
              fontWeight: '500',
              fontSize: 14
            }}
          >
            Continuar com o Google
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.continuar2}
        >

          <Text
            style={{
              fontWeight: '500',
              fontSize: 14
            }}
          >
            Continuar com a Apple
          </Text>

        </TouchableOpacity>


        <View style={styles.espacamento} />


        <Text
          style={{
            color: '#828282',
            fontSize: 11,
            textAlign: 'center'
          }}
        >

          Ao clicar em Cadastrar, você concorda com os nossos {'\n'}

          <Text style={{ color: '#24BF1E' }}>
            Termos de Serviço
          </Text>

          {' '}e com a{' '}

          <Text style={{ color: '#24BF1E' }}>
            Política de Privacidade
          </Text>

        </Text>

      </View>

    </ScrollView>
  );
}



const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },

  logoView: {
    height: 100,
    width: 258,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  logo: {
    width: 200,
    height: 90,
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
    color: '#000000',
    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,

    paddingHorizontal: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  cadastrar: {
    backgroundColor: '#F57C00',
    height: 40,
    width: 155,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoDesabilitado: {
    opacity: 0.6,
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

  espacamento: {
    height: 16,
  },

});