import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation, categorias } from '../src/Functions';
import { anunciarStyles as styles } from '../src/Styles';
import { usuario } from '../src/Usuario';

const unidades = ['un.', 'kg', 'm', 'm²', 'm³', 'saco', 'milheiro'];

// Botões "emendados" onde só um fica ativo (ex: Novo | Seminovo | Usado).
// Fica aqui no topo pra não repetir o mesmo JSX pra Estado e Disponibilidade.
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

  function publicarAnuncio() {
    if (nome.trim() === '' || categoria === '' || preco.trim() === '') {
      alert('Preencha pelo menos o nome, a categoria e o preço do produto.');
      return;
    }

    alert('Anúncio publicado!');

    // Limpa o formulário depois de publicar
    setNome('');
    setCategoria('');
    setPreco('');
    setQuantidade('');
    setUnidade('');
    setDescricao('');
    setEstado('Novo');
    setDisponibilidade('Retirada');
    setMenuAberto(null);
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
            <Text style={styles.infoValor}>{usuario.cidade}</Text>
            <Text style={styles.seta}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Image style={styles.infoIcone} source={require('../assets/icones/whatsapp.png')}/>
            <Text style={styles.infoLabel}>Contato</Text>
            <Text style={styles.infoValor}>{usuario.telefone}</Text>
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