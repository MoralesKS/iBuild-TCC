import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function RedefinicaoSenha() {
  const [userMail, setUserMail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigation = useNavigation();

  async function replacePass() {
    const email = userMail.trim();
    if (!email) {
      alert('Informe seu e-mail.');
      return;
    }
    if (enviando) return;

    setEnviando(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (erro) {
      // Projetos sem a proteção de enumeração podem devolver estes erros.
      if (!['auth/user-not-found', 'auth/user-disabled'].includes(erro.code)) {
        alert(erro.code === 'auth/invalid-email'
          ? 'Informe um e-mail válido.'
          : 'Não foi possível solicitar a recuperação. Tente novamente.');
        return;
      }
    } finally {
      setEnviando(false);
    }

    alert('Se houver uma conta com esse e-mail, você receberá as instruções de recuperação. Confira sua caixa de entrada e a pasta de spam.');
    navigation.navigate('Login');
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
            placeholderTextColor="#828282"
            autoCapitalize='none'
            autoComplete='email'
            value={userMail}
            onChangeText={setUserMail}
        />

        <TouchableOpacity style={styles.continuar} onPress={replacePass} disabled={enviando}>
            <Text style={{color: '#ffffff'}}>{enviando ? 'Enviando...' : 'Continuar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voltar} onPress={voltar} disabled={enviando}>
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
    paddingHorizontal: 24,
    paddingVertical: 8,
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
    width: '100%',
    maxWidth: 420,
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
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
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  voltar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 40,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  espacamento: {
    height: 24,
  },
  textInput: {
    backgroundColor: 'white',
    color: '#000000',
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginVertical: 6,
    marginBottom: 10,
  },
});
