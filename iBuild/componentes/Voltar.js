import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { voltar } from '../src/navegacao';

export default function Voltar({ destino = 'Home' }) {
  const navigation = useNavigation();
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => voltar(navigation,destino)}
    style={{minHeight:48,minWidth:80,alignSelf:'flex-start',justifyContent:'center',paddingHorizontal:12}}>
    <Text style={{fontSize:17,color:'#245F28'}}>‹ Voltar</Text>
  </TouchableOpacity>;
}
