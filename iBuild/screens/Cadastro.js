import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function Cadastro() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const navigation = useNavigation();
  

  return (
    <View style={styles.container}>
     <View style={styles.logoView}>
      <Image style={styles.logo} source={require('../assets/IBuild.jpg')}/> 
     </View>

     <View style={styles.textView}> 
      <Text style={styles.titulo}> Como deseja se Cadastrar? </Text>
      <Text style={styles.subTitulo}> Escolha seu perfil ideal para continuar no aplicativo </Text>

      <TouchableOpacity style={styles.button}>
        <View style={styles.alinhar}>
          <Image/>
          <View>
            <Text style={styles.titulo}> Como deseja se Cadastrar? </Text>
            <Text style={styles.subTitulo}> Escolha seu perfil ideal para continuar no aplicativo </Text>
          </View>
        </View>
      </TouchableOpacity>
      

      <TouchableOpacity style={styles.continuar}><Text style={{color: '#ffffff',}}> Continuar </Text></TouchableOpacity>
      
      <Text style={styles.titulo}> Como deseja se Cadastrar? </Text>
      <Text style={styles.subTitulo}> Escolha seu perfil ideal para continuar no aplicativo </Text>
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
  },
  textView: {
    height: 439,
    width: 375,
    alignItems: 'center',
    marginBottom: 24,
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
    height: 15,
  },
  logo: {
    height: 130,
    width: 258,
    borderRadius: 8,
  },
  button: {
    height: 100,
    width: 327,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 10,
  },
});