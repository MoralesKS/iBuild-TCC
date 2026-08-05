import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';

export default function Cadastro() {
  return (
    <View style={styles.container}>
     <View style={styles.logoView}>
      <Image style={styles.logo} source={require('../assets/IBuild.jpg')}/> 
     </View>

     <View style={styles.textView}> 
      <Text style={styles.titulo}> Crie uma nova conta </Text>
      <Text style={styles.subTitulo}> Insira seu e-mail para se cadastrar neste aplicativo </Text>
      <TextInput style={styles.textInput}> Email </TextInput>
      <TextInput style={styles.textInput}> Confirme seu Email </TextInput>
      <TextInput style={styles.textInput}> Senha </TextInput>
      <TextInput style={styles.textInput}> Confirme sua Senha </TextInput>
      <TouchableOpacity style={styles.continuar}><Text style={{color: '#ffffff',}}> Continuar </Text></TouchableOpacity>
      <View style={styles.espacamento}> </View>
      <Text style={{color: '#E0E0E0'}}>-------------------------- Ou ------------------------ </Text>
      <View style={styles.espacamento}> </View>
      <TouchableOpacity style={styles.continuar2}><Text style={{fontWeight: 'medium', fontSize: 14}}> Continuar com o Google </Text></TouchableOpacity>
      <TouchableOpacity style={styles.continuar2}><Text style={{fontWeight: 'medium', fontSize: 14}}> Continuar com a Apple </Text></TouchableOpacity>
      <View style={styles.espacamento}> </View>
      <Text style={{color: '#828282', fontSize: 12}}> Ao clicar em continuar, você concorda com os nossos {'\n'} <Text style={{color: '#24BF1E'}}> Termos de Serviço </Text> e com a <Text style={{color: '#24BF1E'}}> Política de Privacidade </Text> </Text>
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
    padding: 16,
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
});