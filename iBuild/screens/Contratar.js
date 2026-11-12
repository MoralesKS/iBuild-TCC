import { useCallback, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { profissionais as profissionaisExemplo, categoriasProfissionais } from '../src/Functions';
import { api, MOSTRAR_EXEMPLOS } from '../src/api';
import { useAreaSegura } from '../src/responsivo';
import BarraInferior from '../src/BarraInferior';

export default function Contratar() {
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();

  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [textoBusca, setTextoBusca] = useState('');
  const [profissionaisDb, setProfissionaisDb] = useState([]);

  useFocusEffect(
    useCallback(() => {
      api.profissionais()
        .then((l) => setProfissionaisDb(l || []))
        .catch((e) => console.log(e.message));
    }, [])
  );

  // autônomos do banco + os de exemplo que já existiam
  const profissionais = [...profissionaisDb, ...(MOSTRAR_EXEMPLOS ? (profissionaisExemplo || []) : [])];

  const profissionaisFiltrados = profissionais.filter((profissional) => {
    const passaCategoria = categoriaAtiva === null || profissional.categoria === categoriaAtiva;
    const textoNormalizado = textoBusca.trim().toLowerCase();
    const passaBusca =
      textoNormalizado === '' ||
      profissional.nome.toLowerCase().includes(textoNormalizado) ||
      profissional.categoria.toLowerCase().includes(textoNormalizado);
    return passaCategoria && passaBusca;
  });
 
  // Abre o perfil do autônomo (do banco ou de exemplo)
  function abrirPerfil(profissional) {
    if (profissional.idUsuario) {
      navigation.navigate('PerfilAutonomo', { usuarioId: profissional.idUsuario });
    } else {
      navigation.navigate('PerfilAutonomo', { profissional });
    }
  }

  return (
    <View style={[styles.container, areaSegura, areaSegura]}>
 
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
            <TouchableOpacity
              key={profissional.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => abrirPerfil(profissional)}
            >
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
              <View style={styles.verPerfilBotao}>
                <Text style={styles.verPerfilTexto}>Ver perfil</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
 
      {/* BOTTOM TAB BAR */}
      <BarraInferior ativo="contratar" />
    </View>
  );
}

const styles = StyleSheet.create({
  semResultados: {
    marginTop: 16,
    textAlign: 'center',
    color: '#828282',
  },
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
    flexWrap: 'wrap',
    rowGap: 6,
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
});
