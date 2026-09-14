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

  // Guarda qual loja está selecionada no momento — começa já com uma
  // pra o card não aparecer vazio na primeira vez que a tela abre.
  const [lojaSelecionada, setLojaSelecionada] = useState(lojas[5]);

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
        // Isso acontece principalmente em emuladores sem GPS simulado
        // configurado. Nesse caso, mantemos o fallback e avisamos o usuário
        // em vez de deixar a tela travada ou quebrar silenciosamente.
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
        <TextInput style={styles.busca} placeholder="Pesquisar" placeholderTextColor="#828282" />
      </View>

      {/* Aviso discreto se não conseguimos pegar o GPS real */}
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

          {/* Marcadores das lojas — ao tocar, atualiza lojaSelecionada.
              IMPORTANTE: pinColor nunca recebe "undefined" — sempre uma
              cor de verdade, senão o Android quebra ao tentar ler a cor. */}
          {lojas.map((loja) => (
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
          <View style={styles.lojaImagem}>
            {/* IMAGEM: Foto da loja */}
          </View>
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