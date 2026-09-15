import { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAppNavigation, lojas, abrirNoGoogleMaps } from '../src/Functions';
import { mapaStyles as styles } from '../src/Styles';

export default function Mapa() {
  const { home, contratar, gerenciar, carrinho, perfil, chat } = useAppNavigation();
  const [carregando, setCarregando] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);
  const [minhaLocalizacao, setMinhaLocalizacao] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
  });

  const [textoBusca, setTextoBusca] = useState('');

  const [lojaSelecionada, setLojaSelecionada] = useState(lojas[5]);

  // Só as lojas que batem com a busca aparecem como marcador no mapa.
  // A busca continua funcionando mesmo se a loja selecionada for filtrada
  // pra fora da lista — o card dela continua aparecendo embaixo até o
  // usuário escolher outra ou limpar a busca.
  const lojasFiltradas = lojas.filter((loja) => {
    const texto = textoBusca.trim().toLowerCase();
    return (
      texto === '' ||
      loja.nome.toLowerCase().includes(texto) ||
      loja.endereco.toLowerCase().includes(texto)
    );
  });

  useEffect(() => {
    async function pedirLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissaoNegada(true);
        setCarregando(false);
        return;
      }

      try {
        const posicao = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setMinhaLocalizacao({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        });
      } catch (erro) {
        console.log('Erro ao obter localização:', erro);
        setErroLocalizacao(true);
      } finally {
        setCarregando(false);
      }
    }

    pedirLocalizacao();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#277D2C" />
      </View>
    );
  }

  if (permissaoNegada) {
    return (
      <View style={[styles.container, styles.centralizado, { padding: 24 }]}>
        <Text style={styles.permissaoTexto}>
          Precisamos da sua localização para mostrar as lojas mais próximas no mapa.
        </Text>
        <TouchableOpacity style={styles.selecionarBotao} onPress={() => Linking.openSettings()}>
          <Text style={styles.selecionarTexto}>Abrir configurações</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buscaWrapper}>
        <TextInput
          style={styles.busca}
          placeholder="Pesquisar"
          placeholderTextColor="#828282"
          value={textoBusca}
          onChangeText={setTextoBusca}
        />
      </View>

      {erroLocalizacao && (
        <Text style={styles.avisoLocalizacao}>
          Não conseguimos obter sua localização exata. Mostrando um ponto de referência.
        </Text>
      )}

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

      {/* MAPA FUNCIONAL, já centralizado na posição real do usuário */}
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

          {/* Só renderiza os marcadores das lojas que passaram no filtro de busca */}
          {lojasFiltradas.map((loja) => (
            <Marker
              key={loja.id}
              coordinate={{ latitude: loja.latitude, longitude: loja.longitude }}
              title={loja.nome}
              pinColor={lojaSelecionada?.id === loja.id ? '#277D2C' : 'red'}
              onPress={() => setLojaSelecionada(loja)}
            />
          ))}
        </MapView>
      </View>

      {/* CARD DA LOJA SELECIONADA */}
      {lojaSelecionada && (
        <View style={styles.lojaCard}>
          <Image style={styles.lojaImagem} source={lojaSelecionada.imagem} />
          <View style={styles.lojaInfoRow}>
            <View style={styles.lojaInfo}>
              <Text style={styles.lojaNome}>{lojaSelecionada.nome}</Text>
              <Text style={styles.lojaAvaliacao}>
                {lojaSelecionada.avaliacao} ({lojaSelecionada.numAvaliacoes} avaliações)
              </Text>
              <Text style={styles.lojaEndereco}>{lojaSelecionada.endereco}</Text>
              <Text style={styles.lojaDistancia}>{lojaSelecionada.distancia} km de distância</Text>
            </View>
            <TouchableOpacity
              style={styles.selecionarBotao}
              onPress={() => abrirNoGoogleMaps(lojaSelecionada)}
            >
              <Text style={styles.selecionarTexto}>Selecionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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