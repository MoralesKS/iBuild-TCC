import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function CadastroAutonomos() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/IBuild.jpg')} style={styles.logo} resizeMode="contain" />
      </View>
 
      <View style={styles.textView}>
        <Text style={styles.titulo}>Crie sua nova conta</Text>
        <Text style={styles.subTitulo}>Cadastre-se para oferecer seus serviços no aplicativo</Text>
 
        <TextInput style={styles.textInput} placeholder="Nome completo" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} placeholder="CPF" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} placeholder="Profissão / área de atuação" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} placeholder="Telefone / whatsapp" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} placeholder="Email" placeholderTextColor="#828282" />
        <TextInput style={styles.textInput} placeholder="Senha" placeholderTextColor="#828282" secureTextEntry />
        <TextInput style={styles.textInput} placeholder="Confirme sua senha" placeholderTextColor="#828282" secureTextEntry />
 
        <View style={styles.botoesRow}>
          <TouchableOpacity style={styles.voltar} onPress={voltar}>
            <Text style={{ color: '#F57C00', fontWeight: 'bold' }}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cadastrar} onPress={novoUser}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
 
        <Text style={{ color: '#828282', fontSize: 13, marginTop: 8 }}>ou</Text>
 
        <TouchableOpacity style={styles.continuar2}>
          <Text style={{ fontWeight: 'medium', fontSize: 14 }}>Continuar com o Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continuar2}>
          <Text style={{ fontWeight: 'medium', fontSize: 14 }}>Continuar com a Apple</Text>
        </TouchableOpacity>
 
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