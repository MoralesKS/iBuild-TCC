import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function CadastroPessoaFisica() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  
  function novoUser() {
    if(userMail === '' || userPass === '' || confirmePass === '' || userNome === '' || userCPF === '' || userTelefone === ''){
      alert('Todos os campos devem ser preenchidos');
      return;
    }
    if(userPass !== confirmePass){
      alert('A senha e a confirmação não coencidem');
      return;
    }
    else {
      createUserWithEmailAndPassword(auth, userMail, userPass)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('O usuário ' + userMail + ' foi criado. Faça o Login');
        navigation.navigate('Login');
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        navigation.navigate('Login');
      })
    }
  }

  function voltar(){
    navigation.navigate('Cadastro')
  }

  function formatarData(texto) {
    // remove tudo que não é número
    let apenasNumeros = texto.replace(/\D/g, '');

    // limita a 8 dígitos (DDMMAAAA)
    apenasNumeros = apenasNumeros.slice(0, 8);

    // insere as barras
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    } else {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4)}`;
    }
  }

  function formatarTelefone(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11); // DDD + 9 dígitos

    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  }

  function formatarCPF(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

    if (numeros.length <= 3) {
      return numeros;
    } else if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    } else if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    } else {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/IBuild.jpg')} style={styles.logo}/>
      </View>
 
      <View style={styles.textView}>
        <Text style={styles.titulo}>Crie sua nova conta</Text>
        <Text style={styles.subTitulo}>Cadastre-se para utilizar o aplicativo como cliente</Text>
 
        <TextInput style={styles.textInput} value={userNome} onChangeText={setUserNome} placeholder="Nome completo" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} value={userCPF} onChangeText={(t) => setUserCPF(formatarCPF(t))} placeholder="CPF: XXX.XXX.XXX-XX" keyboardType="numeric" maxLength={14}/>
        <TextInput style={styles.textInput} value={userData} onChangeText={(t) => setUserData(formatarData(t))} placeholder="Data de nascimento: DD/MM/AAAA" keyboardType="numeric" maxLength={10}/>
        <TextInput style={styles.textInput} value={userTelefone} onChangeText={(t) => setUserTelefone(formatarTelefone(t))} placeholder="Telefone: (XX) XXXXX-XXXX" keyboardType="numeric" maxLength={15}/>
        <TextInput style={styles.textInput} value={userMail} onChangeText={setUserMail} placeholder="Email" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} value={userPass} onChangeText={setUserPass} placeholder="Senha" placeholderTextColor="#828282" secureTextEntry />
        <TextInput style={styles.textInput} value={confirmePass} onChangeText={setConfirmePass} placeholder="Confirme sua senha" placeholderTextColor="#828282" secureTextEntry />
 
        <View style={styles.botoesRow}>
          <TouchableOpacity style={styles.voltar} onPress={voltar}>
            <Text style={{ color: '#F57C00', fontWeight: 'bold' }}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cadastrar} onPress={novoUser}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
 
        <View style={styles.espacamento} />
 
        <Text style={{ color: '#828282', fontSize: 11, textAlign: 'center' }}>
          Ao clicar em Cadastrar, você concorda com os nossos {'\n'}
          <Text style={{ color: '#24BF1E' }}>Termos de Serviço</Text> e com a{' '}
          <Text style={{ color: '#24BF1E' }}>Política de Privacidade</Text>
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
    justifyContent: 'space-evenly',
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
    marginBottom: '10%',
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