import BottomBar from '../componentes/BottomBar';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, Image, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppNavigation, abrirNoGoogleMaps } from '../src/Functions';
import { api, distanciaKm, useUsuario } from '../src/api';
import FotoProduto from '../src/FotoProduto';
import { useAreaSegura } from '../src/responsivo';

export default function Mapa() {
  const { usuario } = useUsuario();
  const [obras, setObras] = useState([]);
  const [erroObras, setErroObras] = useState('');
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setObras([]); setErroObras('');
    const id = usuario?.idUsuario;
    if (id) Promise.all([api.obras(id), api.obrasParticipando(id)]).then(listas => {
      if (ativo) setObras([...new Map(listas.flat().map(o => [o.id, o])).values()]);
    }).catch(e => { if (ativo) setErroObras(e.message); });
    return () => { ativo = false; };
  }, [usuario?.idUsuario]));
  const navigation = useNavigation();
  const areaSegura = useAreaSegura();
  const [erroLista, setErroLista] = useState('');
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const { home, contratar, gerenciar, carrinho, perfil, chat } = useAppNavigation();
  const [carregando, setCarregando] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);
  const [minhaLocalizacao, setMinhaLocalizacao] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
  });
  const [textoBusca, setTextoBusca] = useState('');
  const [lojasDb, setLojasDb] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  useFocusEffect(useCallback(() => {
    let ativo = true;
    setErroLista(''); setCarregandoLista(true);
    api.lojas().then(l => { if (ativo) setLojasDb(l || []); })
      .catch(e => { if (ativo) { setLojasDb([]); setErroLista(e.message); } })
      .finally(() => { if (ativo) setCarregandoLista(false); });
    return () => { ativo = false; };
  }, [tentativa]));

  // Depois de editar o card da loja, atualiza o card que já estava aberto
  useEffect(() => {
    setLojaSelecionada((sel) => (sel ? lojasDb.map(l=>({...l,distancia:distanciaKm(minhaLocalizacao,l).toFixed(1)})).find((l) => l.id === sel.id) || null : sel));
  }, [lojasDb]);

  // Lojas reais com distância calculada.
  const lojas = [
    ...lojasDb.map((l) => ({ ...l, distancia: distanciaKm(minhaLocalizacao, l).toFixed(1) })),
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

    pedirLocalizacao().catch(() => { setErroLocalizacao(true); setCarregando(false); });
  }, []);

  const termo = textoBusca.trim().toLocaleLowerCase();
  const obrasFiltradas = obras.filter(o => [o.nome,o.endereco,o.cidade].join(' ').toLocaleLowerCase().includes(termo));
  return (
    <View style={[styles.container, areaSegura]}>
      <View style={styles.buscaWrapper}>
        <TextInput
          style={styles.busca}
          placeholder="Pesquisar lojas e minhas obras"
          placeholderTextColor="#828282"
          value={textoBusca}
          onChangeText={setTextoBusca}
        />
      </View>

      {(erroLocalizacao || permissaoNegada) && (
        <Text style={styles.avisoLocalizacao}>
          Não conseguimos obter sua localização exata. Mostrando um ponto de referência.
        </Text>
      )}


      {carregandoLista && <Text>Carregando…</Text>}
      {!!erroLista && <View><Text>{erroLista}</Text><TouchableOpacity onPress={() => setTentativa(t => t + 1)}><Text>Tentar novamente</Text></TouchableOpacity></View>}
      {!carregandoLista && !erroLista && lojasFiltradas.length === 0 && <Text>Nenhuma loja encontrada.</Text>}
      {!!erroObras && <Text>{erroObras}</Text>}
      {!!textoBusca.trim() && <ScrollView keyboardShouldPersistTaps="handled" style={{maxHeight:180}}>
        {obrasFiltradas.map(o =>
          <View key={o.id}><TouchableOpacity style={{padding:12}} onPress={() => navigation.navigate('DetalhesObra', { obra:o })}>
            <Text>{o.nome}</Text><Text>{o.endereco}</Text>
          </TouchableOpacity>
          {!!o.logradouro && <TouchableOpacity style={{padding:10}} onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent([o.logradouro,o.cidade].filter(Boolean).join(', '))).catch(()=>alert('Não foi possível abrir a rota no aplicativo de mapas.'))}><Text>Como chegar</Text></TouchableOpacity>}
          </View>)}
        {!obrasFiltradas.length && !erroObras && <Text>Nenhuma obra encontrada.</Text>}
      </ScrollView>}
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
          {!carregando && !permissaoNegada && !erroLocalizacao && <Marker coordinate={minhaLocalizacao} title="Você">
            <View style={styles.marcadorVoce}>
              <Text style={styles.marcadorVoceTexto}>Você</Text>
            </View>
          </Marker>}

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
          <TouchableOpacity style={styles.selecionarBotao} onPress={() => navigation.push('PerfilAutonomo', { usuarioId: lojaSelecionada.idUsuario })}><Text style={styles.selecionarTexto}>Ver perfil da loja</Text></TouchableOpacity>
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
      <BottomBar ativa="mapa" />
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
