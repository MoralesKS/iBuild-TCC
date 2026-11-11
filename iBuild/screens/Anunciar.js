import { useCallback, useEffect, useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, ScrollView, Image,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { categorias, useAppNavigation } from '../src/Functions';
import { api, conferirApi, escolherImagens, formatarTelefone, paraNumero, useUsuario, validarAnuncio } from '../src/api';
import BarraInferior from '../src/BarraInferior';
import { useAreaSegura } from '../src/responsivo';

const UNIDADES = ['un.', 'kg', 'm', 'm²', 'm³', 'saco', 'milheiro'];
const MAX_EXTRAS = 4;
const ESTADO_LABEL = { novo: 'Novo', excelente: 'Seminovo', bom: 'Seminovo', regular: 'Usado' };

// Botões "emendados" onde só um fica ativo (ex: Novo | Seminovo | Usado).
function Segmentado({ opcoes, valor, aoMudar }) {
  return (
    <View style={styles.segmentado}>
      {opcoes.map((opcao, indice) => (
        <TouchableOpacity
          key={opcao}
          style={[
            styles.segmentoItem,
            indice > 0 && styles.segmentoItemBorda,
            valor === opcao && styles.segmentoItemAtivo,
          ]}
          onPress={() => aoMudar(opcao)}
        >
          <Text style={[styles.segmentoTexto, valor === opcao && styles.segmentoTextoAtivo]}>
            {opcao}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Esta MESMA tela serve para anunciar (rota "Anunciar") e para editar (rota "EditarAnuncio",
// que recebe o produto em route.params.produto).
export default function Anunciar() {
  const areaSegura = useAreaSegura();
  const navigation = useNavigation();
  const route = useRoute();
  const { home } = useAppNavigation();
  const { usuario } = useUsuario();

  const produtoEdicao = route.params?.produto;
  const editando = !!produtoEdicao?.idAnuncio;

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estado, setEstado] = useState('Novo');
  const [disponibilidade, setDisponibilidade] = useState('Retirada');
  const [localizacao, setLocalizacao] = useState('');
  const [contato, setContato] = useState('');

  // Fotos. capa: { uri, base64?, ext? } (sem base64 = foto que já está salva)
  // extras: [{ chave, uri, id? (já salva), base64?, ext? (nova) }]
  const [capa, setCapa] = useState(null);
  const [extras, setExtras] = useState([]);
  const [removerFotos, setRemoverFotos] = useState([]);

  const [menuAberto, setMenuAberto] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function limpar() {
    setNome(''); setCategoria(''); setPreco(''); setQuantidade(''); setUnidade('');
    setDescricao(''); setEstado('Novo'); setDisponibilidade('Retirada');
    setLocalizacao(usuario?.cidade || '');
    setContato(formatarTelefone(usuario?.telefone || ''));
    setCapa(null); setExtras([]); setRemoverFotos([]); setMenuAberto(null);
  }

  function preencher(p) {
    setNome(p.nome);
    setCategoria(p.tipo);
    setPreco(p.precoNumero != null ? Number(p.precoNumero).toFixed(2).replace('.', ',') : '');
    setQuantidade(p.quantidade != null ? String(p.quantidade) : '');
    setUnidade(p.unidade || '');
    setDescricao(p.descricao === 'Sem descrição.' ? '' : p.descricao);
    setEstado(ESTADO_LABEL[p.estado] || 'Novo');
    setDisponibilidade(p.disponibilidade === 'entrega' ? 'Entregar' : 'Retirada');
    setLocalizacao(p.localizacao || '');
    setContato(formatarTelefone(p.contato || ''));
    setCapa(p.imagem ? { uri: p.imagem.uri } : null);
    setExtras((p.fotos || []).map((f) => ({ chave: 'f' + f.id, id: f.id, uri: f.imagem.uri })));
    setRemoverFotos([]);
    setMenuAberto(null);
  }

  // Anunciar: começa vazio, com localização e contato do seu perfil
  useEffect(() => {
    if (!editando) limpar();
  }, [editando, usuario?.idUsuario]);

  // Editar: preenche com o anúncio toda vez que a tela abre
  useFocusEffect(
    useCallback(() => {
      if (editando) preencher(produtoEdicao);
    }, [produtoEdicao])
  );

  async function escolherCapa() {
    const [imagem] = await escolherImagens({ multiplo: false });
    if (imagem) setCapa(imagem);
  }

  async function adicionarExtras() {
    const vagas = MAX_EXTRAS - extras.length;
    if (vagas <= 0) {
      alert(`Você já adicionou ${MAX_EXTRAS} fotos extras. Remova uma para adicionar outra.`);
      return;
    }
    const imagens = await escolherImagens({ multiplo: true, limite: vagas });
    setExtras((atuais) => [
      ...atuais,
      ...imagens.map((i, n) => ({ ...i, chave: `n${Date.now()}-${n}` })),
    ]);
  }

  function removerExtra(foto) {
    if (foto.id) setRemoverFotos((atuais) => [...atuais, foto.id]);
    setExtras((atuais) => atuais.filter((f) => f.chave !== foto.chave));
  }

  function alternarMenu(nomeDoMenu) {
    setMenuAberto((atual) => (atual === nomeDoMenu ? null : nomeDoMenu));
  }

  async function salvar() {
    const erros = validarAnuncio({
      nome, categoria, preco, quantidade, unidade, localizacao, contato, temCapa: !!capa,
    });
    if (erros.length > 0) {
      alert('Corrija antes de continuar:\n\n' + erros.join('\n'));
      return;
    }
    if (!usuario) {
      alert('Entre na sua conta novamente.');
      return;
    }

    const dados = {
      titulo: nome.trim(),
      categoria,
      preco: paraNumero(preco),
      quantidade: Number(quantidade),
      unidade,
      descricao: descricao.trim(),
      estado,
      disponibilidade,
      localizacao: localizacao.trim(),
      contato,
    };
    const novasExtras = extras.filter((f) => f.base64).map((f) => ({ base64: f.base64, ext: f.ext }));

    setSalvando(true);
    try {
      await conferirApi(); // avisa se o server.js do PC estiver desatualizado (senão as fotos não seriam salvas)
      if (editando) {
        const corpo = { ...dados, id_usuario: usuario.idUsuario, remover_fotos: removerFotos, fotos: novasExtras };
        if (capa?.base64) corpo.foto_capa = { base64: capa.base64, ext: capa.ext };
        const atualizado = await api.atualizarAnuncio(produtoEdicao.idAnuncio, corpo);
        alert('Anúncio atualizado!');
        navigation.navigate('Produto', { produto: atualizado });
      } else {
        await api.anunciar({
          ...dados,
          id_vendedor: usuario.idUsuario,
          foto_capa: { base64: capa.base64, ext: capa.ext },
          fotos: novasExtras,
        });
        alert('Anúncio publicado!');
        limpar();
        home();
      }
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, areaSegura, areaSegura]}>

        <View style={styles.headerRow}>
          {editando && (
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => navigation.navigate('Produto', { produto: produtoEdicao })}
            >
              <Text style={styles.setaVoltar}>{'<'}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.titulo}>{editando ? 'Editar anúncio' : 'Anunciar produto'}</Text>
        </View>

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Fotos */}
          <View style={styles.fotosRow}>
            <TouchableOpacity style={styles.fotoBox} onPress={escolherCapa}>
              {capa ? (
                <>
                  <Image style={styles.fotoPreview} source={{ uri: capa.uri }} />
                  <View style={styles.fotoTrocar}>
                    <Text style={styles.fotoTrocarTexto}>Trocar foto</Text>
                  </View>
                </>
              ) : (
                <>
                  <Image style={styles.fotoIcone} source={require('../assets/icones/camera.png')}/>
                  <Text style={styles.fotoTitulo}>Foto da capa</Text>
                  <Text style={styles.fotoSub}>Toque para adicionar (obrigatória)</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.fotoBox} onPress={adicionarExtras}>
              <View style={styles.fotoCirculoTracejado}>
                <Image style={styles.fotoIconeMenor} source={require('../assets/icones/adicionar.png')}/>
              </View>
              <Text style={styles.fotoTitulo}>Fotos do produto</Text>
              <Text style={styles.fotoSub}>Opcional • {extras.length}/{MAX_EXTRAS}</Text>
            </TouchableOpacity>
          </View>

          {extras.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.extrasRow}>
              {extras.map((foto) => (
                <View key={foto.chave} style={styles.extraItem}>
                  <Image style={styles.extraImagem} source={{ uri: foto.uri }} />
                  <TouchableOpacity style={styles.extraRemover} onPress={() => removerExtra(foto)}>
                    <Text style={styles.extraRemoverTexto}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Formulário */}
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Informações do produto</Text>

            <Text style={styles.label}>Nome do produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Tijolo cerâmico 8 furos"
              placeholderTextColor="#828282"
              value={nome}
              onChangeText={setNome}
              maxLength={150}
            />

            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => alternarMenu('categoria')}>
              <Text style={categoria ? styles.valorTexto : styles.placeholderTexto}>
                {categoria || 'Selecionar uma categoria'}
              </Text>
              <Text style={styles.seta}>⌄</Text>
            </TouchableOpacity>
            {menuAberto === 'categoria' && (
              <View style={styles.menuOpcoes}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.opcaoMenu, categoria === cat.nome && styles.opcaoMenuAtiva]}
                    onPress={() => { setCategoria(cat.nome); setMenuAberto(null); }}
                  >
                    <Text style={styles.opcaoTexto}>{cat.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.linhaCampos}>
              <View style={styles.campoPequeno}>
                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor="#828282"
                  keyboardType="decimal-pad"
                  value={preco}
                  onChangeText={setPreco}
                />
              </View>

              <View style={styles.campoPequeno}>
                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 100"
                  placeholderTextColor="#828282"
                  keyboardType="number-pad"
                  value={quantidade}
                  onChangeText={setQuantidade}
                />
              </View>

              <View style={styles.campoPequeno}>
                <Text style={styles.label}>Unidade</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => alternarMenu('unidade')}>
                  <Text style={unidade ? styles.valorTexto : styles.placeholderTexto}>
                    {unidade || 'Selecione'}
                  </Text>
                  <Text style={styles.seta}>⌄</Text>
                </TouchableOpacity>
              </View>
            </View>
            {menuAberto === 'unidade' && (
              <View style={styles.menuOpcoes}>
                {UNIDADES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.opcaoMenu, unidade === item && styles.opcaoMenuAtiva]}
                    onPress={() => { setUnidade(item); setMenuAberto(null); }}
                  >
                    <Text style={styles.opcaoTexto}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.descricaoInput]}
              placeholder="Descreva seu produto, medidas, marca, etc."
              placeholderTextColor="#828282"
              multiline
              maxLength={200}
              value={descricao}
              onChangeText={setDescricao}
            />
            <Text style={styles.contador}>{descricao.length}/200</Text>

            <View style={styles.linhaSegmentados}>
              <View>
                <Text style={styles.label}>Estado do produto</Text>
                <Segmentado
                  opcoes={['Novo', 'Seminovo', 'Usado']}
                  valor={estado}
                  aoMudar={setEstado}
                />
              </View>
              <View>
                <Text style={styles.label}>Disponibilidade</Text>
                <Segmentado
                  opcoes={['Retirada', 'Entregar']}
                  valor={disponibilidade}
                  aoMudar={setDisponibilidade}
                />
              </View>
            </View>

            <Text style={styles.label}>Localização do produto</Text>
            <View style={styles.campoComIcone}>
              <Image style={styles.infoIcone} source={require('../assets/icones/localizacao.png')}/>
              <TextInput
                style={styles.campoComIconeInput}
                placeholder="Ex: Embu das Artes - SP"
                placeholderTextColor="#828282"
                value={localizacao}
                onChangeText={setLocalizacao}
                maxLength={150}
              />
            </View>

            <Text style={styles.label}>Contato (WhatsApp)</Text>
            <View style={styles.campoComIcone}>
              <Image style={styles.infoIcone} source={require('../assets/icones/whatsapp.png')}/>
              <TextInput
                style={styles.campoComIconeInput}
                placeholder="(XX) XXXXX-XXXX"
                placeholderTextColor="#828282"
                keyboardType="numeric"
                value={contato}
                onChangeText={(t) => setContato(formatarTelefone(t))}
                maxLength={15}
              />
            </View>

            {editando ? (
              <View style={styles.botoesRow}>
                <TouchableOpacity
                  style={styles.cancelarBotao}
                  onPress={() => navigation.navigate('Produto', { produto: produtoEdicao })}
                >
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.salvarBotao, salvando && { opacity: 0.6 }]}
                  onPress={salvar}
                  disabled={salvando}
                >
                  <Text style={styles.publicarTexto}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.publicarBotao, salvando && { opacity: 0.6 }]}
                onPress={salvar}
                disabled={salvando}
              >
                <Image style={styles.publicarIcone} source={require('../assets/icones/enviar.png')}/>
                <Text style={styles.publicarTexto}>{salvando ? 'Publicando...' : 'Publicar anúncio'}</Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>

        <BarraInferior ativo={editando ? 'home' : 'perfil'} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
    paddingTop: '10%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  botaoVoltar: {
    position: 'absolute',
    left: 16,
  },
  setaVoltar: {
    fontSize: 20,
    color: '#000000',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fotosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fotoBox: {
    width: '48%',
    height: 130,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    overflow: 'hidden',
  },
  fotoPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  fotoTrocar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  fotoTrocarTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fotoIcone: {
    width: 32,
    height: 32,
    tintColor: '#F57C00',
  },
  fotoCirculoTracejado: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoIconeMenor: {
    width: 18,
    height: 18,
    tintColor: '#F57C00',
  },
  fotoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  fotoSub: {
    fontSize: 10,
    color: '#828282',
    textAlign: 'center',
  },
  extrasRow: {
    marginTop: 12,
  },
  extraItem: {
    marginRight: 10,
  },
  extraImagem: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  extraRemover: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraRemoverTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  formTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    height: 34,
    paddingHorizontal: 8,
    fontSize: 11,
    color: '#000000',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    height: 34,
    paddingHorizontal: 8,
  },
  placeholderTexto: {
    fontSize: 11,
    color: '#828282',
  },
  valorTexto: {
    fontSize: 11,
    color: '#000000',
  },
  seta: {
    fontSize: 12,
    color: '#828282',
  },
  linhaCampos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campoPequeno: {
    width: '31%',
  },
  menuOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  opcaoMenu: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  opcaoMenuAtiva: {
    borderColor: '#F57C00',
    backgroundColor: '#FFF4E5',
  },
  opcaoTexto: {
    fontSize: 11,
    color: '#000000',
  },
  descricaoInput: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  contador: {
    fontSize: 9,
    color: '#828282',
    textAlign: 'right',
    marginTop: 2,
  },
  linhaSegmentados: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segmentado: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  segmentoItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  segmentoItemBorda: {
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  segmentoItemAtivo: {
    backgroundColor: '#FFF4E5',
  },
  segmentoTexto: {
    fontSize: 10,
    color: '#828282',
  },
  segmentoTextoAtivo: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  campoComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    height: 34,
    paddingHorizontal: 8,
  },
  infoIcone: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  campoComIconeInput: {
    flex: 1,
    height: '100%',
    fontSize: 11,
    color: '#000000',
  },
  publicarBotao: {
    flexDirection: 'row',
    backgroundColor: '#F57C00',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  publicarIcone: {
    width: 14,
    height: 14,
    tintColor: '#FFFFFF',
    marginRight: 6,
  },
  publicarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelarBotao: {
    width: '48%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelarTexto: {
    color: '#F57C00',
    fontWeight: 'bold',
    fontSize: 12,
  },
  salvarBotao: {
    width: '48%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
