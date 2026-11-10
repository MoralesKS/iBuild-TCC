import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppNavigation } from './Functions';

// Mesma barra inferior das outras telas. Use: <BarraInferior ativo="perfil" />
// ativo: 'home' | 'gerenciar' | 'mapa' | 'contratar' | 'chat' | 'perfil'
const ABAS = [
  { id: 'home', icone: require('../assets/Home.png') },
  { id: 'gerenciar', icone: require('../assets/gerenciar.png') },
  { id: 'mapa', icone: require('../assets/Bussola.png') },
  { id: 'contratar', icone: require('../assets/Trabalho.png') },
  { id: 'chat', icone: require('../assets/Chat.png') },
  { id: 'perfil', icone: require('../assets/Perfil.png') },
];

export default function BarraInferior({ ativo }) {
  const navegar = useAppNavigation();

  return (
    <View style={styles.footer}>
      {ABAS.map((aba) => (
        <TouchableOpacity key={aba.id} style={styles.footerItem} onPress={navegar[aba.id]}>
          <Image
            style={[styles.footerIcone, { tintColor: ativo === aba.id ? '#277D2C' : '#9C9C9C' }]}
            source={aba.icone}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
  },
});