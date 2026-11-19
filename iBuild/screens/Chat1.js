import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomBar from '../componentes/BottomBar';
import Avatar from '../componentes/Avatar';
import { useChat } from '../src/useChat';
import { imagemDoServidor, useUsuario } from '../src/api';

function dataCurta(valor) {
  if (!valor) return '';
  const [dia, hora] = valor.split(' ');
  const hoje = new Date();
  const local = [hoje.getFullYear(), String(hoje.getMonth()+1).padStart(2,'0'), String(hoje.getDate()).padStart(2,'0')].join('-');
  return dia === local ? hora?.slice(0,5) : dia.slice(8,10)+'/'+dia.slice(5,7);
}

export default function Chat1({navigation}) {
  const {dados,erro} = useChat();
  const {usuario} = useUsuario();
  const [filtro,setFiltro] = useState('Geral');
  const lista = filtro === 'Geral' ? dados : dados.filter(c => c.remetente && String(c.remetente) !== String(usuario?.idUsuario));
  return <SafeAreaView style={s.tela} edges={['top']}>
    <Text style={s.titulo}>Conversas</Text>
    <View style={s.filtros}>{['Geral','A responder'].map(f =>
      <TouchableOpacity key={f} style={[s.chip,f===filtro && s.ativo]} accessibilityRole="button"
        accessibilityState={{selected:f===filtro}} onPress={()=>setFiltro(f)}>
        <Text style={{color:f===filtro?'white':'#171717'}}>{f}</Text>
      </TouchableOpacity>)}</View>
    {!!erro && <Text accessibilityRole="alert" style={s.aviso}>{erro}</Text>}
    <FlatList data={lista} keyExtractor={c=>String(c.id)}
      ListEmptyComponent={erro ? null : <Text style={s.aviso}>{filtro==='Geral'?'Inicie uma conversa pelo produto ou pelo perfil da pessoa.':'Nenhuma conversa aguardando sua resposta.'}</Text>}
      renderItem={({item})=><TouchableOpacity style={s.linha} accessibilityRole="button"
        onPress={()=>navigation.navigate('Chat 2',{pessoa:item.id,nome:item.nome})}>
        <Avatar style={s.foto} source={item.foto ? imagemDoServidor(item.foto) : null}/>
        <View style={s.coluna}><View style={s.identificacao}>
          <Text numberOfLines={1} style={s.nome}>{item.nome}</Text>
          <Text style={s.hora}>{dataCurta(item.criada_em)}</Text>
        </View><Text numberOfLines={1} style={s.previa}>{item.texto}</Text></View>
      </TouchableOpacity>}/>
    <BottomBar ativa="chat"/>
  </SafeAreaView>;
}
const s=StyleSheet.create({
  tela:{flex:1,backgroundColor:'white'},titulo:{marginHorizontal:18,marginTop:18,fontSize:22,fontWeight:'700',color:'#111'},
  filtros:{flexDirection:'row',gap:8,paddingHorizontal:18,paddingVertical:12},
  chip:{borderWidth:1,borderColor:'#ddd',borderRadius:20,paddingHorizontal:15,paddingVertical:7},
  ativo:{backgroundColor:'#328545',borderColor:'#328545'},linha:{flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:18,minHeight:72},
  foto:{width:46,height:46,borderRadius:23},coluna:{flex:1},identificacao:{flexDirection:'row',alignItems:'center',gap:6},
  nome:{fontWeight:'600',color:'#131313',fontSize:15,flexShrink:1},hora:{fontSize:12,color:'#777'},
  previa:{fontSize:14,color:'#777',marginTop:4},aviso:{padding:18,color:'#555'}
});
