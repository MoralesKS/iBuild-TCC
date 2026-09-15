import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation, profissionais, categoriasProfissionais } from '../src/Functions';
import { contratarStyles as styles } from '../src/Styles';

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
              <View style={styles.avatar} />
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