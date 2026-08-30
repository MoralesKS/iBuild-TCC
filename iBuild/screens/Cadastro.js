import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function Cadastro() {
  const navigation = useNavigation();

  function cadastroAutonomo() {
    navigation.navigate('CadastroAutonomo')
  }
  function cadastroPessoaFisica() {
    navigation.navigate('CadastroPessoaFisica')
  }
  function cadastroEmpresa() {
    navigation.navigate('CadastroEmpresa')
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        <Image source={require('../assets/IBuild.jpg')} style={styles.logo} resizeMode="contain" />
      </View>
 
      <View style={styles.textView}>
        <Text style={styles.titulo}>Como deseja se cadastrar?</Text>
        <Text style={styles.subTitulo}>Escolha seu perfil ideal para continuar no aplicativo</Text>
 
        <View style={styles.espacamento} />
 
        <TouchableOpacity style={styles.opcaoCard} onPress={cadastroPessoaFisica}>
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.opcaoIcone} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Pessoa física</Text>
            <Text style={styles.opcaoDescricao}>Comprar materiais e contratar serviços</Text>
          </View>
          <Text style={styles.opcaoSeta}>{'>'}</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.opcaoCard} onPress={cadastroAutonomo}>
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.opcaoIcone} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Autônomo</Text>
            <Text style={styles.opcaoDescricao}>Oferecer serviços e encontrar clientes</Text>
          </View>
          <Text style={styles.opcaoSeta}>{'>'}</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.opcaoCard} onPress={cadastroEmpresa}>
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.opcaoIcone} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Empresa</Text>
            <Text style={styles.opcaoDescricao}>Anunciar, vender ou contratar</Text>
          </View>
          <Text style={styles.opcaoSeta}>{'>'}</Text>
        </TouchableOpacity>
 
        <View style={styles.espacamento} />
 
        <Text style={{ color: '#828282', fontSize: 13 }}>
          Já possui uma conta? <Text style={{ color: '#24BF1E' }}>Entrar</Text>
        </Text>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    width: 220,
    height: 100,
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
  espacamento: {
    height: 24,
  },
});
 