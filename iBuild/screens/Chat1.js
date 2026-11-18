import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomBar from '../componentes/BottomBar';
import Voltar from '../componentes/Voltar';
import { useChat } from '../src/useChat';

export default function Chat1({navigation}) {
  const {dados,erro} = useChat();
  return <SafeAreaView style={{flex:1,backgroundColor:'#fff'}} edges={['top']}>
    <Voltar/><View style={{flex:1,paddingHorizontal:16}}>
      <Text style={{fontSize:24,fontWeight:'bold'}}>Conversas</Text>
      {!!erro && <Text accessibilityRole="alert">{erro}</Text>}
      <FlatList data={dados} keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text style={{paddingVertical:16}}>Inicie uma conversa pelo produto ou pelo perfil da pessoa.</Text>}
        renderItem={({item}) => <TouchableOpacity style={{paddingVertical:15,borderBottomWidth:1,borderColor:'#eee'}}
          onPress={() => navigation.navigate('Chat 2',{pessoa:item.id,nome:item.nome})}>
          <Text style={{fontWeight:'bold'}}>{item.nome}</Text><Text numberOfLines={1}>{item.texto}</Text>
        </TouchableOpacity>}/>
    </View><BottomBar ativa="chat"/>
  </SafeAreaView>;
}
