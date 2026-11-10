import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useAppNavigation, categorias } from '../src/Functions';
import { api, useUsuario } from '../src/api'; 


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

export default function Anunciar() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

  const unidades = ['un.', 'kg', 'm', 'm²', 'm³', 'saco', 'milheiro'];
  const { usuario } = useUsuario();

  // Botões "emendados" onde só um fica ativo (ex: Novo | Seminovo | Usado).
  // Fica aqui no topo pra não repetir o mesmo JSX pra Estado e Disponibilidade.

  // Um useState pra cada campo do formulário
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estado, setEstado] = useState('Novo');
  const [disponibilidade, setDisponibilidade] = useState('Retirada');

  // Qual lista de opções está aberta: 'categoria', 'unidade' ou null (nenhuma)
  const [menuAberto, setMenuAberto] = useState(null);

  function alternarMenu(nomeDoMenu) {
    setMenuAberto((atual) => (atual === nomeDoMenu ? null : nomeDoMenu));
  }

  function escolherCategoria(nomeCategoria) {
    setCategoria(nomeCategoria);
    setMenuAberto(null);
  }

  function escolherUnidade(nomeUnidade) {
    setUnidade(nomeUnidade);
    setMenuAberto(null);
  }

  // Troque por expo-image-picker quando for implementar a escolha de fotos
  function escolherFoto() {
    alert('Tela em construção, aguardando orçamento');
  }

  async function publicarAnuncio() {
    if (nome.trim() === '' || categoria === '' || preco.trim() === '') {
      alert('Preencha pelo menos o nome, a categoria e o preço do produto.');
      return;
    }
    if (!usuario) { alert('Entre na sua conta novamente.'); return; }
    try {
      await api.anunciar({
        id_vendedor: usuario.idUsuario, titulo: nome.trim(), categoria,
        preco: Number(preco.replace(',', '.')), quantidade: Number(quantidade.replace(',', '.')) || 1,
        unidade, descricao, estado, disponibilidade,
      });
      alert('Anúncio publicado!');
      setNome(''); setCategoria(''); setPreco(''); setQuantidade(''); setUnidade('');
      setDescricao(''); setEstado('Novo'); setDisponibilidade('Retirada'); setMenuAberto(null);
      home();
    } catch (e) { alert('Erro ao publicar: ' + e.message); }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Anunciar produto</Text>

      <ScrollView
        style={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Fotos */}
        <View style={styles.fotosRow}>
          <TouchableOpacity style={styles.fotoBox} onPress={escolherFoto}>
            <Image style={styles.fotoIcone} source={require('../assets/icones/camera.png')}/>
            <Text style={styles.fotoTitulo}>Foto da capa</Text>
            <Text style={styles.fotoSub}>Toque para adicionar (obrigatória)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fotoBox} onPress={escolherFoto}>
            <View style={styles.fotoCirculoTracejado}>
              <Image style={styles.fotoIconeMenor} source={require('../assets/icones/adicionar.png')}/>
            </View>
            <Text style={styles.fotoTitulo}>Fotos do produto</Text>
            <Text style={styles.fotoSub}>Imagem Opcional</Text>
          </TouchableOpacity>
        </View>

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
                  onPress={() => escolherCategoria(cat.nome)}
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
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
              />
            </View>

            <View style={styles.campoPequeno}>
              <Text style={styles.label}>Unidade max.</Text>
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
              {unidades.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.opcaoMenu, unidade === item && styles.opcaoMenuAtiva]}
                  onPress={() => escolherUnidade(item)}
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

          <TouchableOpacity style={styles.infoRow}>
            <Image style={styles.infoIcone} source={require('../assets/icones/localizacao.png')}/>
            <Text style={styles.infoLabel}>Localização</Text>
            <Text style={styles.infoValor}>{usuario?.cidade}</Text>
            <Text style={styles.seta}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Image style={styles.infoIcone} source={require('../assets/icones/whatsapp.png')}/>
            <Text style={styles.infoLabel}>Contato</Text>
            <Text style={styles.infoValor}>{usuario?.telefone}</Text>
            <Text style={styles.seta}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publicarBotao} onPress={publicarAnuncio}>
            <Image style={styles.publicarIcone} source={require('../assets/icones/enviar.png')}/>
            <Text style={styles.publicarTexto}>Publicar anúncio</Text>
          </TouchableOpacity>
        </View>

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
          <Image style={styles.footerIcone} source={require('../assets/Trabalho.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={chat}>
          <Image style={styles.footerIcone} source={require('../assets/Chat.png')}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={perfil}>
          <Image style={styles.footerIcone1} source={require('../assets/Perfil.png')}/>
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
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  infoIcone: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 11,
    color: '#000000',
  },
  infoValor: {
    fontSize: 10,
    color: '#828282',
    marginRight: 6,
  },
  publicarBotao: {
    flexDirection: 'row',
    backgroundColor: '#F57C00',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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