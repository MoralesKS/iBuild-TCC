import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { detalhesObraStyles as styles } from '../src/Styles';

export default function DetalhesObra() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Detalhes da obra</Text>

      <ScrollView>
        <View style={styles.resumoCard}>
          <Image style={styles.foto} source={require('../assets/Home.png')}/>
          <View style={{ marginLeft: '10%', width: '60%' }}>
            <Text style={styles.resumoNome}>Residencial Aurora</Text>
            <Text style={styles.resumoSub}>São Paulo • Entrega 18/08/26</Text>
            <View style={styles.progressoBarraFundo}>
              <View style={[styles.progressoBarraPreenchida, { width: '78%' }]} />
            </View>
            <Text style={styles.progressoTexto}>78% Concluída • Em andamento</Text>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Informações gerais</Text>

        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.foto1} source={require('../assets/Home.png')}/>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.infoLinha}>Tipo: </Text>
                <Text style={styles.infoLinha}>Residencial</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.infoLinha}>Endereço: </Text>
                <Text style={styles.infoLinha}>Rua das Acacias, 245</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.infoLinha}>Responsável técnico: </Text>
                <Text style={styles.infoLinha}>Eng. Carlos Mendes</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.infoLinha}>Orçamento: </Text>
                <Text style={styles.infoLinha}>R$ 2.400.000</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Etapas da Obra</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>Fundação - 100%</Text>
          <Text style={styles.infoLinha}>Estrutura - 70%</Text>
          <Text style={styles.infoLinha}>Acabamento - 45%</Text>
        </View>

        <Text style={styles.tituloSecao}>Equipe</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>Mestre de obras: João Neves</Text>
          <Text style={styles.infoLinha}>Funcionários ativos: 34</Text>
          <Text style={styles.infoLinha}>Horas trabalhadas: 192h</Text>
        </View>

        <Text style={styles.tituloSecao}>Próximas Ações</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLinha}>✓ Instalação elétrica do bloco B</Text>
          <Text style={styles.infoLinha}>◻ Instalação elétrica do bloco C</Text>
        </View>

        <TouchableOpacity style={styles.contratarBotao} onPress={contratar}>
          <Text style={styles.contratarTexto}>Contratar funcionários</Text>
        </TouchableOpacity>
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
          <Image style={styles.footerIcone} source={require('../assets/Perfil.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}