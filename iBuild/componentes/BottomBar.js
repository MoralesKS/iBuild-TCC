import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '../src/Functions';

const abas = [
  { id: 'home', rotulo: 'Início', icone: require('../assets/Home.png') },
  { id: 'gerenciar', rotulo: 'Gerenciar obras', icone: require('../assets/gerenciar.png') },
  { id: 'mapa', rotulo: 'Mapa', icone: require('../assets/Bussola.png') },
  { id: 'contratar', rotulo: 'Contratar', icone: require('../assets/Trabalho.png') },
  { id: 'chat', rotulo: 'Chat', icone: require('../assets/Chat.png') },
  { id: 'perfil', rotulo: 'Meu perfil', icone: require('../assets/Perfil.png') },
];

export default function BottomBar({ ativa }) {
  const navegacao = useAppNavigation();

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.rodape}>
      <View style={styles.abas}>
        {abas.map(({ id, rotulo, icone }) => (
          <TouchableOpacity
            key={id}
            accessibilityRole="tab"
            accessibilityLabel={rotulo}
            accessibilityState={{ selected: ativa === id }}
            onPress={navegacao[id]}
            style={styles.aba}
          >
            <Image source={icone} style={[styles.icone, ativa === id && styles.iconeAtivo]} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rodape: { flexShrink: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  abas: { flexDirection: 'row', minHeight: 54 },
  aba: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icone: { height: 23, width: 23, tintColor: '#9C9C9C' },
  iconeAtivo: { tintColor: '#277D2C' },
});
