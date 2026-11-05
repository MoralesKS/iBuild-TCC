import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppNavigation, obras, calcularProgresso } from '../src/Functions';

export default function Gerenciar() {
  const navigation = useNavigation();
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

  const [textoBusca, setTextoBusca] = useState('');

  // Os números do statsGrid continuam vindo do array "obras" completo —
  // eles representam o total geral, não devem mudar conforme a busca.
  const totalObras = obras.length;
  const obrasAndamento = obras.filter((obra) => obra.status === 'andamento').length;
  const obrasConcluidas = obras.filter((obra) => obra.status === 'concluida').length;
  const totalFuncionarios = obras.reduce(
    (total, obra) => total + obra.equipe.funcionariosAtivos,
    0
  );

  // Só a LISTA de cards abaixo é filtrada pela busca
  const obrasFiltradas = obras.filter((obra) => {
    const texto = textoBusca.trim().toLowerCase();
    return (
      texto === '' ||
      obra.nome.toLowerCase().includes(texto) ||
      obra.construtora.toLowerCase().includes(texto)
    );
  });

  function abrirDetalhesObra(obra) {
    navigation.navigate('DetalhesObra', { obra });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          value={textoBusca}
          onChangeText={setTextoBusca}
        />

        <TouchableOpacity>
          <Text style={styles.filtro}>Todas as obras ⌄</Text>
        </TouchableOpacity>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Obras</Text>
            <Text style={styles.statValor}>{totalObras}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Em andamento</Text>
            <Text style={styles.statValor}>{obrasAndamento}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Concluídas</Text>
            <Text style={styles.statValor}>{obrasConcluidas}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Funcionários</Text>
            <Text style={styles.statValor}>{totalFuncionarios}</Text>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Obras Recentes</Text>

        {obrasFiltradas.length === 0 ? (
          <Text style={styles.semResultados}>Nenhuma obra encontrada.</Text>
        ) : (
          obrasFiltradas.map((obra) => (
            <View key={obra.id} style={styles.obraCard}>
              <Image style={styles.foto} source={obra.imagem} />
              <View style={{ marginLeft: '10%', width: '60%' }}>
                <Text style={styles.obraNome}>{obra.nome}</Text>
                <Text style={styles.obraSub}>{obra.construtora}</Text>
                <View style={styles.progressoBarraFundo}>
                  <View
                    style={[
                      styles.progressoBarraPreenchida,
                      { width: `${calcularProgresso(obra)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressoTexto}>{calcularProgresso(obra)}% Concluída</Text>
                <TouchableOpacity
                  style={styles.verDetalhesBotao}
                  onPress={() => abrirDetalhesObra(obra)}
                >
                  <Text style={styles.verDetalhesTexto}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
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
          <Image style={styles.footerIcone1} source={require('../assets/gerenciar.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={mapa}>
          <Image style={styles.footerIcone} source={require('../assets/Bussola.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={contratar}>
          <Image style={styles.footerIcone} source={require('../assets/Trabalho.png')}/>
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
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filtro: {
    marginTop: 12,
    color: '#000000',
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 8,
    width: '35%',
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#828282',
  },
  statValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F57C00',
    marginTop: 6,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  obraCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#828282',
    borderWidth: 1,
  },
  obraNome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  obraSub: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 12,
  },
  progressoBarraFundo: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: 6,
    backgroundColor: '#277D2C',
    borderRadius: 3,
  },
  progressoTexto: {
    fontSize: 12,
    marginTop: 8,
  },
  foto: {
    width: 62,
    height: 62,
    tintColor: '#000000',
  },
  verDetalhesBotao: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  verDetalhesTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
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