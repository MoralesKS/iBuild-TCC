import { useCallback, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { api, useUsuario } from '../src/api';
import { useAreaSegura } from '../src/responsivo';
import BarraInferior from '../src/BarraInferior';

const FILTROS = [
  { label: 'Todas', tipo: null },
  { label: 'Compras', tipo: 'compra' },
  { label: 'Recibos', tipo: 'recibo' },
  { label: 'Obra', tipo: 'obra' },
];

export default function Notificacoes() {
  const areaSegura = useAreaSegura();
  const { usuario } = useUsuario();

  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [busca, setBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      api.notificacoes(usuario.idUsuario)
        .then((l) => {
          setLista(l || []);
          return api.lerNotificacoes(usuario.idUsuario);   // marca como lidas DEPOIS de mostrar
        })
        .catch((e) => console.log(e.message));
    }, [usuario])
  );

  const visiveis = lista.filter((n) => {
    const texto = busca.trim().toLowerCase();
    return (
      (!filtro || n.tipo === filtro) &&
      (texto === '' || `${n.titulo} ${n.mensagem}`.toLowerCase().includes(texto))
    );
  });

  return (
    <View style={[styles.container, areaSegura]}>
      <Text style={styles.titulo}>Notificações</Text>
      <Text style={styles.subtitulo}>Acompanhe compras, recibos e atualizações de obra</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        value={busca}
        onChangeText={setBusca}
      />

      <View style={styles.linhaFiltros}>
        {FILTROS.map((f) => (
          <TouchableOpacity key={f.label} onPress={() => setFiltro(f.tipo)}>
            <Text style={filtro === f.tipo ? styles.filtroAtivo : styles.filtro}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.grupoTitulo}>Recentes</Text>
      <ScrollView>
        {visiveis.length === 0 && (
          <Text style={styles.notificacaoDescricao}>Nenhuma notificação.</Text>
        )}
        {visiveis.map((n) => (
          <View key={n.id} style={styles.notificacaoCard}>
            <Text style={[styles.notificacaoTitulo, !n.lida && { color: '#277D2C' }]}>{n.titulo}</Text>
            <Text style={styles.notificacaoDescricao}>{n.mensagem}  •  {n.quando}</Text>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <BarraInferior ativo="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
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
    color: '#F57C00',
    fontWeight: 'bold',
    marginRight: 16,
  },
  filtro: {
    color: '#828282',
    marginRight: 16,
  },
  grupoTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  notificacaoCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificacaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
  },
  notificacaoDescricao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
});
