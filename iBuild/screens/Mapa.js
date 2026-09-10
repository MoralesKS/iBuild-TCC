import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAppNavigation } from '../src/Functions';
import { mapaStyles as styles } from '../src/Styles';

export default function Mapa() {
  // Coordenadas de exemplo - troque pelas coordenadas reais das lojas
  const minhaLocalizacao = { latitude: -23.5505, longitude: -46.6333 };

  const lojas = [
    { id: 1, nome: 'Loja 1', latitude: -23.549, longitude: -46.629 },
    { id: 2, nome: 'Loja 2', latitude: -23.552, longitude: -46.637 },
    { id: 3, nome: 'Loja 3', latitude: -23.5545, longitude: -46.633 },
    { id: 4, nome: 'Loja 4', latitude: -23.5495, longitude: -46.638 },
    { id: 5, nome: 'Loja 5', latitude: -23.548, longitude: -46.6315 },
    { id: 67, nome: 'Loja 67', latitude: -23.551, longitude: -46.6295 },
  ];

  const { home, contratar, gerenciar, carrinho, perfil, chat } = useAppNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buscaWrapper}>
        <TextInput style={styles.busca} placeholder="Pesquisar" placeholderTextColor="#828282" />
        {/* ICONE: editar/pesquisar */}
      </View>

      {/* FILTRAR / CLASSIFICAR */}
      <View style={styles.filtrosRow}>
        <TouchableOpacity style={styles.filtroBotao}>
          <Text style={styles.filtroTexto}>Filtrar</Text>
          <Text style={styles.filtroSeta}> v</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroBotao}>
          <Text style={styles.filtroTexto}>Classificar</Text>
          <Text style={styles.filtroSeta}> v</Text>
        </TouchableOpacity>
      </View>

      {/* MAPA FUNCIONAL */}
      <View style={styles.mapaWrapper}>
        <MapView
          style={styles.mapa}
          initialRegion={{
            latitude: minhaLocalizacao.latitude,
            longitude: minhaLocalizacao.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Marcador do usuário */}
          <Marker coordinate={minhaLocalizacao} title="Você">
            <View style={styles.marcadorVoce}>
              <Text style={styles.marcadorVoceTexto}>Você</Text>
            </View>
          </Marker>

          {/* Marcadores das lojas */}
          {lojas.map((loja) => (
            <Marker
              key={loja.id}
              coordinate={{ latitude: loja.latitude, longitude: loja.longitude }}
              title={loja.nome}
            />
          ))}
        </MapView>
      </View>

      {/* CARD DA LOJA SELECIONADA */}
      <View style={styles.lojaCard}>
        <View style={styles.lojaImagem}>
          {/* IMAGEM: Foto da loja */}
        </View>
        <View style={styles.lojaInfoRow}>
          <View style={styles.lojaInfo}>
            <Text style={styles.lojaNome}>Loja 67</Text>
            <Text style={styles.lojaAvaliacao}>4,8 (500 avaliações)</Text>
            <Text style={styles.lojaEndereco}>Rua D. Pedro, 67, Osas...</Text>
            <Text style={styles.lojaDistancia}>6,7 /km de distância</Text>
          </View>
          <TouchableOpacity style={styles.selecionarBotao}>
            <Text style={styles.selecionarTexto}>Selecionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM TAB BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={home}>
          <Image style={styles.footerIcone} source={require('../assets/Home.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={gerenciar}>
          <Image style={styles.footerIcone} source={require('../assets/gerenciar.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Image style={styles.footerIcone1} source={require('../assets/Bussola.png')}/>
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