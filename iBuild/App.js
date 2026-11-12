import { StyleSheet, Text, View } from 'react-native';
import Route from './Route';
import { NavigationContainer } from '@react-navigation/native';
import { UsuarioProvider, useUsuario } from './src/api';

function AppRoutes() {
  const { usuarioFirebase } = useUsuario();

  if (usuarioFirebase === undefined) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer key={usuarioFirebase?.uid ?? 'sem-sessao'}>
      <Route autenticado={Boolean(usuarioFirebase)} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UsuarioProvider>
      <AppRoutes />
    </UsuarioProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#277D2C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
