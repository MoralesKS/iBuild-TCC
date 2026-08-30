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
import { cadastrarPessoaFisica } from '../services/api';

export default function CadastroPessoaFisica() {

  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');

  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();


  function converterData(data) {

    // Recebe DD/MM/AAAA
    const partes = data.split('/');

    if (partes.length !== 3) {
      return null;
    }

    const [dia, mes, ano] = partes;

    if (
      dia.length !== 2 ||
      mes.length !== 2 ||
      ano.length !== 4
    ) {
      return null;
    }

    return `${ano}-${mes}-${dia}`;
  }


  async function novoUser() {

    if (
      !userMail ||
      !userPass ||
      !confirmePass ||
      !userNome ||
      !userCPF ||
      !userTelefone ||
      !dataNascimento
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
      alert('Digite um CPF com 11 números.');
      return;
    }

    const dataConvertida = converterData(dataNascimento);

    if (!dataConvertida) {
      alert('Digite a data no formato DD/MM/AAAA.');
      return;
    }

    let usuarioFirebase = null;

    try {

      setCarregando(true);

      // 1. Cria login no Firebase
      const credencial =
        await createUserWithEmailAndPassword(
          auth,
          userMail.trim(),
          userPass
        );

      usuarioFirebase = credencial.user;


      // 2. Salva perfil no MySQL
      await cadastrarPessoaFisica({
        firebase_uid: usuarioFirebase.uid,

        nome: userNome.trim(),

        email: userMail
          .trim()
          .toLowerCase(),

        telefone: userTelefone,

        cpf: cpfLimpo,

        data_nascimento: dataConvertida
      });


      alert(
        'Conta criada com sucesso! Faça seu login.'
      );

      navigation.navigate('Login');


    } catch (erro) {

      console.error(
        'Erro ao cadastrar:',
        erro
      );


      /*
        Se o Firebase criou o usuário,
        mas o MySQL falhou,
        removemos o usuário do Firebase
        para evitar cadastro incompleto.
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
          'A senha precisa possuir pelo menos 6 caracteres.'
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
          Cadastre-se para utilizar o aplicativo como cliente
        </Text>


        <TextInput
          style={styles.textInput}
          placeholder="Nome completo"
          placeholderTextColor="#828282"
          value={userNome}
          onChangeText={setUserNome}
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
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#828282"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="numeric"
          maxLength={10}
        />


        <TextInput
          style={styles.textInput}
          placeholder="Telefone"
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
            style={styles.cadastrar}
            onPress={novoUser}
            disabled={carregando}
          >

            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold'
              }}
            >

              {carregando
                ? 'Cadastrando...'
                : 'Cadastrar'}

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


        <TouchableOpacity style={styles.continuar2}>

          <Text
            style={{
              fontWeight: '500',
              fontSize: 14
            }}
          >
            Continuar com o Google
          </Text>

        </TouchableOpacity>


        <TouchableOpacity style={styles.continuar2}>

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
    fontWeight: 'regular',
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