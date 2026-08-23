import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';

export default function Chat1() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Conversas</Text>
        <ScrollView horizontal style={styles.alinharHeader}> 
          <TouchableOpacity style={styles.botaoHeader1}><Text style={{color: 'white'}}>Geral</Text></TouchableOpacity>
          <TouchableOpacity style={styles.botaoHeader}><Text>Amigos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.botaoHeader}><Text>Favoritos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.botaoHeader}><Text>Bloqueados</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.alinharHeader}
      > 
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Kauê </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Joaquim </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
           <Text style={styles.nome}> Arthur Ribeiro </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> João Marcelo </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Hadan </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Seu Zé </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Huggo </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Bruno </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Ribas </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Jocas </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoConversas}> 
          <Image source={require('../assets/foto-do-perfil.png')} style={styles.fotoPerfil} />
          <View>
            <Text style={styles.nome}> Kauê Antigo </Text>
            <Text style={styles.mensagem}> AAAAAAA </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone} source={require('../assets/Bussola.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone} source={require('../assets/Trabalho.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone1} source={require('../assets/Chat.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone} source={require('../assets/Perfil.png')}/>
        </TouchableOpacity>
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
    paddingTop: '15%',
  },
  header: {
    width: 375,
    height: 84,
    marginBottom: 16,
  },
  conversas: {
    width: 375,
    height: 593,
  },
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
    backgroundColor: 'gray',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alinharHeader: {
    height: 32,
    width: '100%',
  },
  botaoHeader: {
    margin: 8,
    height: 32,
    width: 90,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoHeader1: {
    margin: 8,
    height: 32,
    width: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#277D2C'
  },
  botaoConversas: {
    height: 72,
    width: 375,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  fotoPerfil: {
    height: 48,
    width: 48,
    marginRight: 8,
  },
  nome: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mensagem: {
    fontSize: 14,
    opacity: 0.5,
  },
});