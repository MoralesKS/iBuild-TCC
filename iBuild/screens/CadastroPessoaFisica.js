import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroPessoaFisica() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [userNome, setUserNome] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userCPF, setUserCPF] = useState('');

  // Estados para alternar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para o Calendário
  const [date, setDate] = useState(new Date());
  const [userData, setUserData] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  function novoUser() {
    if (userMail === '' || userPass === '' || confirmePass === '' || userNome === '' || userCPF === '' || userTelefone === '' || userData === '') {
      alert('Todos os campos devem ser preenchidos');
      return;
    }
    if (userPass !== confirmePass) {
      alert('A senha e a confirmação não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, userMail, userPass)
      .then((userCredential) => {
        alert('O usuário ' + userMail + ' foi criado. Faça o Login');
        navigation.navigate('Login');
      })
      .catch((error) => {
        alert(error.message);
        navigation.navigate('Login');
      });
  }

  function voltar() {
    navigation.navigate('Cadastro');
  }

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const ano = selectedDate.getFullYear();
      setUserData(`${dia}/${mes}/${ano}`);
    }
  };

  function formatarTelefone(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function formatarCPF(texto) {
    let numeros = texto.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoView}>
          <Image source={require('../assets/IBuild.jpg')} style={styles.logo} />
        </View>

        <View style={styles.textView}>
          <Text style={styles.titulo}>Crie sua nova conta</Text>
          <Text style={styles.subTitulo}>Cadastre-se para utilizar o aplicativo como cliente</Text>

          <TextInput
            style={styles.textInput}
            value={userNome}
            onChangeText={setUserNome}
            placeholder="Nome completo"
            placeholderTextColor="#828282"
          />

          <TextInput
            style={styles.textInput}
            value={userCPF}
            onChangeText={(t) => setUserCPF(formatarCPF(t))}
            placeholder="CPF: XXX.XXX.XXX-XX"
            placeholderTextColor="#828282"
            keyboardType="numeric"
            maxLength={14}
          />

          {/* Campo de Data de Nascimento com Calendário */}
          <TouchableOpacity style={styles.textInput} onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={{ flex: 1, color: '#000000' }}
              value={userData}
              placeholder="Data de nascimento: DD/MM/AAAA"
              placeholderTextColor="#828282"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            style={styles.textInput}
            value={userTelefone}
            onChangeText={(t) => setUserTelefone(formatarTelefone(t))}
            placeholder="Telefone: (XX) XXXXX-XXXX"
            placeholderTextColor="#828282"
            keyboardType="numeric"
            maxLength={15}
          />

          <TextInput
            style={styles.textInput}
            value={userMail}
            onChangeText={setUserMail}
            placeholder="Email"
            placeholderTextColor="#828282"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo de Senha com Ver/Ocultar */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={userPass}
              onChangeText={setUserPass}
              placeholder="Senha"
              placeholderTextColor="#828282"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.iconArea}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#828282"
              />
            </TouchableOpacity>
          </View>

          {/* Campo de Confirmação de Senha com Ver/Ocultar */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmePass}
              onChangeText={setConfirmePass}
              placeholder="Confirme sua senha"
              placeholderTextColor="#828282"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.iconArea}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#828282"
              />
            </TouchableOpacity>
          </View>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingBottom: 40, // Garante um espaço extra no final da rolagem
  },
  logoView: {
    height: 100,
    width: 258,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 90,
  },
  textView: {
    width: 375,
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitulo: {
    color: '#000000',
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
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    width: 327,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    margin: 8,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000000',
    paddingHorizontal: 10,
  },
  iconArea: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    justify: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadastrar: {
    backgroundColor: '#F57C00',
    height: 40,
    width: 155,
    borderRadius: 8,
    justify: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  espacamento: {
    height: 16,
  },
});