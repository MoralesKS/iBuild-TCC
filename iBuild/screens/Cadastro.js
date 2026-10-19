import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Cadastro() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const contentWidth = Math.min(width - 32, 375);
  const cardWidth = Math.min(width - 48, 327);

  const logoWidth = Math.min(width * 0.85, 340);
  const logoHeight = logoWidth * 0.5;

  function cadastroAutonomo() {
    navigation.navigate('CadastroAutonomo');
  }

  function cadastroPessoaFisica() {
    navigation.navigate('CadastroPessoaFisica');
  }

  function cadastroEmpresa() {
    navigation.navigate('CadastroEmpresa');
  }

  function login() {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: height }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { width: contentWidth + 32 }]}>
          <View style={styles.logoView}>
            <Image
              source={require('../assets/IBuild.jpg')}
              style={{
                width: logoWidth,
                height: logoHeight,
                borderRadius: 8,
              }}
              resizeMode="contain"
            />
          </View>

          <View style={[styles.textView, { width: contentWidth }]}>
            <Text style={styles.titulo}>
              Como deseja se cadastrar?
            </Text>

            <Text style={styles.subTitulo}>
              Escolha seu perfil ideal para continuar no aplicativo
            </Text>

            <View style={styles.espacamento} />

            <TouchableOpacity
              style={[styles.opcaoCard, { width: cardWidth }]}
              onPress={cadastroPessoaFisica}
            >
              <Image
                source={require('../assets/pessoaFisica.png')}
                style={styles.opcaoIcone}
              />

              <View style={styles.opcaoTextos}>
                <Text style={styles.opcaoTitulo}>
                  Pessoa física
                </Text>

                <Text style={styles.opcaoDescricao}>
                  Comprar materiais e contratar serviços
                </Text>
              </View>

              <Text style={styles.opcaoSeta}>
                {'>'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcaoCard, { width: cardWidth }]}
              onPress={cadastroAutonomo}
            >
              <Image
                source={require('../assets/autonomos.png')}
                style={styles.opcaoIcone}
              />

              <View style={styles.opcaoTextos}>
                <Text style={styles.opcaoTitulo}>
                  Autônomo
                </Text>

                <Text style={styles.opcaoDescricao}>
                  Oferecer serviços e encontrar clientes
                </Text>
              </View>

              <Text style={styles.opcaoSeta}>
                {'>'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcaoCard, { width: cardWidth }]}
              onPress={cadastroEmpresa}
            >
              <Image
                source={require('../assets/empresas.png')}
                style={styles.opcaoIcone}
              />

              <View style={styles.opcaoTextos}>
                <Text style={styles.opcaoTitulo}>
                  Empresa
                </Text>

                <Text style={styles.opcaoDescricao}>
                  Anunciar, vender ou contratar
                </Text>
              </View>

              <Text style={styles.opcaoSeta}>
                {'>'}
              </Text>
            </TouchableOpacity>

            <View style={styles.espacamento} />

            <View style={styles.loginContainer}>
              <Text style={styles.loginTexto}>
                Já possui uma conta?
              </Text>

              <TouchableOpacity onPress={login}>
                <Text style={styles.loginLink}>
                  {' '}Entrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  logoView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  textView: {
    alignItems: 'center',
  },

  titulo: {
    color: '#277D2C',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  subTitulo: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 5,
  },

  opcaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
  },

  opcaoIcone: {
    width: 50,
    height: 50,
    marginRight: 12,
    tintColor: '#F57C00',
  },

  opcaoTextos: {
    flex: 1,
  },

  opcaoTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },

  opcaoDescricao: {
    fontSize: 11,
    color: '#828282',
    marginTop: 2,
  },

  opcaoSeta: {
    fontSize: 16,
    color: '#828282',
    marginLeft: 8,
  },

  espacamento: {
    height: 24,
  },

  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginTexto: {
    color: '#828282',
    fontSize: 13,
  },

  loginLink: {
    color: '#24BF1E',
    fontSize: 13,
  },
});