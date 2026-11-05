import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useAppNavigation, profissionais, categoriasProfissionais } from '../src/Functions';

export default function Contratar() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
 
  // null representa o filtro "Todos" (nenhuma categoria específica selecionada)
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [textoBusca, setTextoBusca] = useState('');
 
  // Filtra a lista por categoria E pelo texto digitado na busca ao mesmo tempo.
  // Os dois filtros são independentes: um profissional só aparece se passar
  // NAS DUAS condições (categoria certa E nome/profissão batendo com a busca).
  const profissionaisFiltrados = profissionais.filter((profissional) => {
    const passaCategoria = categoriaAtiva === null || profissional.categoria === categoriaAtiva;
 
    const textoNormalizado = textoBusca.trim().toLowerCase();
    const passaBusca =
      textoNormalizado === '' ||
      profissional.nome.toLowerCase().includes(textoNormalizado) ||
      profissional.categoria.toLowerCase().includes(textoNormalizado);
 
    return passaCategoria && passaBusca;
  });
 
  return (
    <View style={styles.container}>
 
      <Text style={styles.titulo}>Contratar Ajudantes</Text>
 
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por profissão ou nome..."
        placeholderTextColor="#828282"
        value={textoBusca}
        onChangeText={setTextoBusca}
      />
 
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View style={styles.linhaFiltros}>
          {categoriasProfissionais.map((item) => (
            <TouchableOpacity key={item.label} onPress={() => setCategoriaAtiva(item.categoria)}>
              <Text style={categoriaAtiva === item.categoria ? styles.filtroAtivo : styles.filtro}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
 
        {profissionaisFiltrados.length === 0 ? (
          <Text style={styles.semResultados}>Nenhum profissional encontrado.</Text>
        ) : (
          profissionaisFiltrados.map((profissional) => (
            <View key={profissional.id} style={styles.card}>
              <Image style={styles.avatar} source={profissional.imagem} />
              <View style={styles.cardInfo}>
                <Text style={styles.nome}>{profissional.nome}</Text>
                <Text style={styles.profissao}>
                  {profissional.categoria} • ★ {profissional.avaliacao}
                </Text>
                <Text style={styles.descricao}>
                  {profissional.cidade} - {profissional.experiencia}
                </Text>
              </View>
              <TouchableOpacity style={styles.verPerfilBotao} onPress={chat}>
                <Text style={styles.verPerfilTexto}>Ver perfil</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
 
      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone} source={require('../assets/gerenciar.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={mapa}>
          <Image style={styles.footerIcone} source={require('../assets/Bussola.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={contratar}>
          <Image style={styles.footerIcone1} source={require('../assets/Trabalho.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={chat}>
          <Image style={styles.footerIcone} source={require('../assets/Chat.png')}/>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.footerItem} onPress={perfil}>
          <Image style={styles.footerIcone} source={require('../assets/Perfil.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  linhaFiltros: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  filtroAtivo: {
    color: '#277D2C',
    fontWeight: 'bold',
    marginRight: 16,
  },
  filtro: {
    color: '#828282',
    marginRight: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  profissao: {
    fontSize: 12,
    color: '#F57C00',
  },
  descricao: {
    fontSize: 12,
    color: '#828282',
  },
  verPerfilBotao: {
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  verPerfilTexto: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: 'bold',
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
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});