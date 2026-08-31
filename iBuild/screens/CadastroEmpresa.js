import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function CadastroEmpresa() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userRazaoSocial, setUserRazaoSocial] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCNPJ, setUserCNPJ] = useState('');
  const [userNome, setUserNome] = useState('');
  const navigation = useNavigation();
  
  function novoUser() {
    if(userMail === '' || userPass === '' || confirmePass === '' || userNome === '' || userCNPJ === '' || userTelefone === '' || userRazaoSocial === ''){
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
    numeros = numeros.slice(0, 11); // DDD + 9 dígitos

    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/IBuild.jpg')} style={styles.logo}/>
      </View>
 
      <View style={styles.textView}>
        <Text style={styles.titulo}>Crie sua nova conta</Text>
        <Text style={styles.subTitulo}>Cadastre sua empresa para anunciar ou contratar</Text>
 
        <TextInput style={styles.textInput} value={userRazaoSocial} onChangeText={setUserRazaoSocial} placeholder="Razão social" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} value={userCNPJ} onChangeText={(t) => setUserCNPJ(formatarCNPJ(t))} placeholder="CNPJ: XX.XXX.XXX/XXXX-XX" keyboardType="numeric" maxLength={18}/>
        <TextInput style={styles.textInput} value={userNome} onChangeText={setUserNome} placeholder="Nome do responsável" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} value={userTelefone} onChangeText={(t) => setUserTelefone(formatarTelefone(t))} placeholder="Telefone: (XX) XXXXX-XXXX" keyboardType="numeric" maxLength={15}/>
        <TextInput style={styles.textInput} value={userMail} onChangeText={setUserMail} placeholder="Email corporativo" placeholderTextColor="#828282" />
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