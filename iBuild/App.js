import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Route from './Route';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  if (carregando) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Route usuario={usuario} />
    </NavigationContainer>
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