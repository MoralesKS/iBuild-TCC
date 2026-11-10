import { useCallback, useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAppNavigation } from '../src/Functions';
import { api } from '../src/api';
import BarraInferior from '../src/BarraInferior';

export default function AtribuirFuncionarios() {
  const navigation = useNavigation();
  const route = useRoute();
  const { gerenciar } = useAppNavigation();

  const [obra, setObra] = useState(route.params?.obra || null);
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState('');
  const [ocupado, setOcupado] = useState(null);   // id do profissional em andamento

  useEffect(() => {
    if (route.params?.obra) setObra(route.params.obra);
  }, [route.params?.obra]);

  useFocusEffect(
    useCallback(() => {
      api.profissionais()
        .then((l) => setProfissionais(l || []))
        .catch((e) => console.log(e.message));
      if (obra?.doBanco) {
        api.obra(obra.id).then(setObra).catch(() => {});
      }
    }, [obra?.id])
  );

  function voltar() {
    if (obra) navigation.navigate('DetalhesObra', { obra });
    else gerenciar();
  }

  const naObra = (p) => !!obra?.profissionais?.some((x) => x.id === p.idProfissional);

  async function alternar(p) {
    setOcupado(p.idProfissional);
    try {
      const atualizada = naObra(p)
        ? await api.removerProfissional(obra.id, p.idProfissional)
        : await api.adicionarProfissional(obra.id, p.idProfissional, p.categoria);
      setObra(atualizada);
    } catch (e) {
      alert(e.message);
    } finally {
      setOcupado(null);
    }
  }

  const texto = busca.trim().toLowerCase();
  const filtrados = profissionais.filter(
    (p) =>
      texto === '' ||
      p.nome.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
  );

  // Sem obra (ou obra de exemplo): explica o que fazer
  if (!obra || !obra.doBanco) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Atribuir funcionários</Text>
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            {!obra
              ? 'Abra esta tela pelos detalhes de uma obra.'
              : 'Esta é uma obra de exemplo. Crie uma obra nova para atribuir funcionários.'}
          </Text>
          <TouchableOpacity style={styles.botaoPrincipal} onPress={() => navigation.navigate('NovaObra')}>
            <Text style={styles.botaoPrincipalTexto}>Criar nova obra</Text>
          </TouchableOpacity>
        </View>
        <BarraInferior ativo="gerenciar" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={voltar}>
        <Text style={styles.seta}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>Atribuir funcionários</Text>
      <Text style={styles.subtitulo}>
        {obra.nome} • {obra.profissionais?.length || 0} na equipe
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por profissão ou nome..."
        placeholderTextColor="#828282"
        value={busca}
        onChangeText={setBusca}
      />

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {filtrados.length === 0 ? (
          <Text style={styles.semResultados}>
            Nenhum autônomo cadastrado ainda. Cadastre uma conta de autônomo para aparecer aqui.
          </Text>
        ) : (
          filtrados.map((p) => {
            const dentro = naObra(p);
            return (
              <View key={p.id} style={styles.card}>
                <Image style={styles.avatar} source={p.imagem} />
                <TouchableOpacity
                  style={styles.cardInfo}
                  onPress={() => navigation.navigate('PerfilAutonomo', { usuarioId: p.idUsuario })}
                >
                  <Text style={styles.nome}>{p.nome}</Text>
                  <Text style={styles.profissao}>{p.categoria} • ★ {p.avaliacao}</Text>
                  <Text style={styles.descricao}>{p.cidade} - {p.experiencia}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botao, dentro ? styles.botaoRemover : styles.botaoAdicionar, ocupado === p.idProfissional && { opacity: 0.5 }]}
                  onPress={() => alternar(p)}
                  disabled={ocupado === p.idProfissional}
                >
                  <Text style={dentro ? styles.botaoRemoverTexto : styles.botaoAdicionarTexto}>
                    {dentro ? 'Remover' : 'Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <BarraInferior ativo="gerenciar" />
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
  seta: {
    fontSize: 20,
    color: '#000000',
    marginLeft: '5%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -24,
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
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
  botao: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botaoAdicionar: {
    backgroundColor: '#F57C00',
  },
  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoRemover: {
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  botaoRemoverTexto: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  semResultados: {
    fontSize: 13,
    color: '#828282',
    marginTop: 16,
    textAlign: 'center',
  },
  aviso: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  avisoTexto: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoPrincipal: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoPrincipalTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});