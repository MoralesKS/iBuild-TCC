import { useCallback, useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { lojas as lojasExemplo, abrirNoGoogleMaps } from '../src/Functions';
import { api, distanciaKm, MOSTRAR_EXEMPLOS } from '../src/api';
import FotoProduto from '../src/FotoProduto';
import { useAreaSegura } from '../src/responsivo';
import BarraInferior from '../src/BarraInferior';

export default function Mapa() {
  const areaSegura = useAreaSegura();
  const [carregando, setCarregando] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);
  const [minhaLocalizacao, setMinhaLocalizacao] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
  });
  const [textoBusca, setTextoBusca] = useState('');
  const [lojasDb, setLojasDb] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(
    MOSTRAR_EXEMPLOS && lojasExemplo ? lojasExemplo[5] || null : null
  );

  useFocusEffect(
    useCallback(() => {
      api.lojas()
        .then((l) => setLojasDb(l || []))
        .catch((e) => console.log(e.message));
    }, [])
  );

  // Depois de editar o card da loja, atualiza o card que já estava aberto
  useEffect(() => {
    setLojaSelecionada((sel) => (sel ? lojasDb.find((l) => l.id === sel.id) || sel : sel));
  }, [lojasDb]);

  // lojas do banco (com distância calculada) + as de exemplo que já existiam
  const lojas = [
    ...lojasDb.map((l) => ({ ...l, distancia: distanciaKm(minhaLocalizacao, l).toFixed(1) })),
    ...(MOSTRAR_EXEMPLOS ? (lojasExemplo || []) : []),
  ];

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
      <View style={[styles.container, areaSegura, styles.centralizado]}>
        <ActivityIndicator size="large" color="#277D2C" />
      </View>
    );
  }

  if (permissaoNegada) {
    return (
      <View style={[styles.container, areaSegura, styles.centralizado, { padding: 24 }]}>
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
    <View style={[styles.container, areaSegura, areaSegura]}>
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
          <FotoProduto style={styles.lojaImagem} source={lojaSelecionada.imagem} />
          <View style={styles.lojaInfoRow}>
            <View style={styles.lojaInfo}>
              <Text style={styles.lojaNome}>{lojaSelecionada.nome}</Text>
              <Text style={styles.lojaAvaliacao}>
                {lojaSelecionada.avaliacao} ({lojaSelecionada.numAvaliacoes} avaliações)
              </Text>
              <Text style={styles.lojaEndereco}>{lojaSelecionada.endereco}</Text>
              {!!lojaSelecionada.sobre && (
                <Text style={styles.lojaSobre} numberOfLines={2}>{lojaSelecionada.sobre}</Text>
              )}
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
      <BarraInferior ativo="mapa" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: '10%',
    marginBottom: '10%',
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissaoTexto: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  avisoLocalizacao: {
    fontSize: 11,
    color: '#F57C00',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  buscaWrapper: {
    paddingHorizontal: 16,
  },
  busca: {
    backgroundColor: '#F5F5F5',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#000000',
  },
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filtroBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filtroTexto: {
    fontSize: 12,
    color: '#000000',
  },
  filtroSeta: {
    fontSize: 12,
    color: '#828282',
  },
  mapaWrapper: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapa: {
    flex: 1,
  },
  marcadorVoce: {
    backgroundColor: '#24BF1E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  marcadorVoceTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lojaCard: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  lojaImagem: {
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  lojaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  lojaInfo: {
    flex: 1,
  },
  lojaNome: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  lojaAvaliacao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  lojaEndereco: {
    fontSize: 12,
    color: '#828282',
  },
  lojaSobre: {
    fontSize: 12,
    color: '#000000',
    marginTop: 2,
  },
  lojaDistancia: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  selecionarBotao: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  selecionarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
