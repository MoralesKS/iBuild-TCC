import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useUsuario } from '../src/api';
import { useChat } from '../src/useChat';
import Voltar from '../componentes/Voltar';

export default function Chat2({route,navigation}) {
  const {pessoa,nome} = route.params || {};
  return pessoa ? <Conversa key={pessoa} {...{pessoa,nome,navigation}}/> : <Voltar destino="Chat 1"/>;
}
function Conversa({pessoa,nome,navigation}) {
  const {usuario} = useUsuario();
  const [texto,setTexto] = useState('');
  const [versao,setVersao] = useState(0);
  const [enviando,setEnviando] = useState(false);
  const tentativa = useRef(null), trava = useRef(false);
  const {dados,erro} = useChat(pessoa,versao);
  async function enviar() {
    const mensagem = texto.trim();
    if (!mensagem || trava.current) return;
    trava.current = true; setEnviando(true);
    if (tentativa.current?.mensagem !== mensagem) tentativa.current = {mensagem,chave:Date.now()+'-'+Math.random().toString(36).slice(2)};
    try {
      await api.enviarMensagem(pessoa,mensagem,tentativa.current.chave);
      tentativa.current = null; setTexto(''); setVersao(v=>v+1);
    } catch(e) { Alert.alert('Mensagem não confirmada',e.message); }
    finally { trava.current = false; setEnviando(false); }
  }
  return <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{flex:1,paddingHorizontal:12}}>
      <Voltar destino="Chat 1"/><TouchableOpacity onPress={()=>navigation.push('PerfilAutonomo',{usuarioId:pessoa})}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>{nome}</Text><Text>Ver perfil</Text>
      </TouchableOpacity>
      {!!erro && <Text accessibilityRole="alert">{erro}</Text>}
      <FlatList inverted data={[...dados].reverse()} keyExtractor={m=>String(m.id)} renderItem={({item})=>{
        const minha = String(item.remetente) === String(usuario?.idUsuario);
        return <View style={{alignSelf:minha?'flex-end':'flex-start',borderRadius:12,padding:10,marginVertical:4,maxWidth:'85%',backgroundColor:minha?'#DCEEDB':'#eee'}}>
          <Text>{item.texto}</Text><Text style={{fontSize:11,color:'#555'}}>{item.criada_em}</Text>
        </View>;
      }}/>
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        <TextInput value={texto} onChangeText={setTexto} editable={!enviando} maxLength={2000} placeholder="Mensagem…" style={{flex:1,padding:12}}/>
        <TouchableOpacity disabled={!texto.trim() || enviando} onPress={enviar} style={{padding:12}}><Text>{enviando?'Enviando…':'Enviar'}</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
