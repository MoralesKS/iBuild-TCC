import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';

export default function Chat2() {
  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text></Text>
        <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil}/>
        <TouchableOpacity><Text> </Text></TouchableOpacity>
        <TouchableOpacity><Text> </Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.mensagens}> 
      
      </ScrollView>

      <View style={styles.barraMensagem}> 
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: '10%',
    paddingBottom: '10%',
  },
  header: {
    width: '100%',
    height: 65,
    backgroundColor: 'red',
    borderBottomWidth: 1,
    marginBottom: 8,
    flexDirection: 'row'
  },
  mensagens: {
    width: 375,
    backgroundColor: 'blue'
  },
  barraMensagem: {
    height: 82,
    width: 375,
  },
  fotoPerfil: {
    height: 48,
    width: 48,
  }
});