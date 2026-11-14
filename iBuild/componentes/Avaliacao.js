import { useCallback, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api, useUsuario } from '../src/api';
export default function Avaliacao({tipo, id, dono, onAtualizar}) {
  const {usuario} = useUsuario();
  const [resumo,setResumo] = useState(null);
  const [nota,setNota] = useState(0);
  const [comentario,setComentario] = useState('');
  const [erro,setErro] = useState('');
  const [ocupado,setOcupado] = useState(false);
  const [tentativa,setTentativa] = useState(0);
  const enviando=useRef(false);
  useFocusEffect(useCallback(() => {
    let ativo=true;
    setErro('');
    api.avaliacoes(tipo,id).then(r=>{if(ativo){setResumo(r);setNota(Number(r.minha?.nota || 0));setComentario(r.minha?.comentario || '');}}).catch(e=>{if(ativo)setErro(e.message);});
    return ()=>{ativo=false;};
  },[tipo,id,tentativa]));
  async function enviar() {
    if(enviando.current || !nota)return;
    enviando.current=true;setOcupado(true);setErro('');
    try {const r=await api.avaliar(tipo,id,{nota,comentario});setResumo(r);onAtualizar?.(r);}
    catch(e){setErro(e.message);}finally{enviando.current=false;setOcupado(false);}
  }
  return <View style={{padding:12,borderWidth:1,borderColor:'#DDD',borderRadius:8,marginVertical:12}}>
    <Text style={{fontWeight:'bold'}}>{tipo==='produto'?'Avaliações do produto':'Avaliações do perfil'}</Text>
    <Text>{resumo ? `★ ${resumo.media} • ${resumo.quantidade} avaliações` : 'Carregando avaliações…'}</Text>
    {!!erro && <View><Text accessibilityRole="alert">{erro}</Text><TouchableOpacity onPress={()=>setTentativa(t=>t+1)}><Text>Tentar novamente</Text></TouchableOpacity></View>}
    {usuario && String(usuario.idUsuario)!==String(dono) && <>
      <View style={{flexDirection:'row',gap:12,marginVertical:8}}>{[1,2,3,4,5].map(n=><TouchableOpacity key={n} disabled={ocupado} accessibilityLabel={`Nota ${n}`} onPress={()=>setNota(n)}><Text style={{fontSize:28,color:n<=nota?'#F57C00':'#777'}}>{n<=nota?'★':'☆'}</Text></TouchableOpacity>)}</View>
      <TextInput accessibilityLabel="Comentário da avaliação" placeholder="Comentário (opcional)" maxLength={1000} value={comentario} onChangeText={setComentario} editable={!ocupado} multiline style={{borderWidth:1,borderColor:'#DDD',padding:8}} />
      <TouchableOpacity disabled={!nota||ocupado} onPress={enviar} style={{padding:12,backgroundColor:!nota||ocupado?'#AAA':'#277D2C',marginTop:8,borderRadius:8}}><Text style={{color:'white',textAlign:'center'}}>{ocupado?'Salvando…':resumo?.minha?'Atualizar avaliação':'Enviar avaliação'}</Text></TouchableOpacity>
      {!!resumo?.minha && <Text>Sua avaliação está salva. Você pode atualizá-la.</Text>}
    </>}
  </View>;
}
