import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function RedefinicaoSenha() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const navigation = useNavigation();

  function replacePass(){
    if(userMail !== ''){
        sendPasswordResetEmail(auth, userMail)
        .then(() => {
            alert(`Foi enviado um email para: ${userMail}. Verifique a sua caixa de email ou spam`);
            navigation.navigate('Login')
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(`Ops! Algo deu errado. ${errorMessage}. Tente novamente ou precione voltar`);
            return;
        })
    }else{
        alert("Inforeme seu email")
    }
  }

  function voltar(){
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/IBuild.jpg')} style={styles.logo}/>
      </View>
 
      <View style={styles.textView}>
        <Text style={styles.titulo}>Redefinição de Senha</Text>
        <Text style={styles.subTitulo}>Informe seu e-mail para receber {'\n'} as instruções de recuperação</Text>
 
        <View style={styles.espacamento} />
 
        <TextInput style={styles.textInput}
            placeholder='Informe seu email'
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
            value={userMail}
            onChangeText={setUserMail}
        />

        <TouchableOpacity style={styles.continuar} onPress={replacePass}>
            <Text style={{color: '#ffffff'}}>Continuar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.voltar} onPress={voltar}>
            <Text style={{color: '#F57C00'}}>Voltar</Text>
        </TouchableOpacity>

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
  },
  logoView: {
    height: 130,
    width: 258,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logo: {
    height: 130,
    width: 258,
    borderRadius: 8,
  },
  textView: {
    width: 375,
    alignItems: 'center',
    marginBottom: '70%'
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
    marginBottom: 4,
  },
  opcaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  opcaoIcone: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  opcaoTextos: {
    flex: 1,
  },
  opcaoTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  opcaoDescricao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  opcaoSeta: {
    fontSize: 16,
    color: '#828282',
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
  voltar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 40,
    width: 327,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  espacamento: {
    height: 24,
  },
  textInput: {
    backgroundColor: 'white',
    color: '#E0E0E0',
    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,
    marginBottom: 10,
  },
});
 