import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../src/Functions';
import { detalhesObraStyles as styles } from '../src/Styles';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';

export default function DetalhesObra() {
  const { home, mapa, contratar, gerenciar, perfil, chat } = useAppNavigation();
  const [marcado, setMarcado] = useState(false);

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
          <View style={{ flexDirection: 'row'}}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: .5}}>
                <View style={{borderWidth: 1, borderRadius: 8, margin: 8}}>
                  <Image style={styles.foto1} source={require('../assets/Home.png')}/>
                </View>
                <Text style={styles.infoLinha}>Tipo: </Text>
                <Text style={styles.infoLinha}>Residencial</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: .5}}>
                <View style={{borderWidth: 1, borderRadius: 8, margin: 8}}>
                  <Image style={styles.foto1} source={require('../assets/Home.png')}/>
                </View>
                <Text style={styles.infoLinha}>Endereço: </Text>
                <Text style={styles.infoLinha}>Rua das Acacias, 245</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: .5}}>
                <View style={{borderWidth: 1, borderRadius: 8, margin: 8}}>
                  <Image style={styles.foto1} source={require('../assets/Home.png')}/>
                </View>
                <Text style={styles.infoLinha}>Responsável técnico: </Text>
                <Text style={styles.infoLinha}>Eng. Carlos Mendes</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: .5}}>
                <View style={{borderWidth: 1, borderRadius: 8, margin: 8}}>
                  <Image style={styles.foto1} source={require('../assets/Home.png')}/>
                </View>
                <Text style={styles.infoLinha}>Orçamento: </Text>
                <Text style={styles.infoLinha}>R$ 2.400.000</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Etapas da Obra</Text>
        <View style={styles.infoCard}>
          <View style={{alignItems: 'center',}}>
            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
              <Text style={styles.infoLinha}>Fundação </Text>
              <View style={[styles.progressoBarraFundo, {width: '70%', margin: 8, marginTop: -1}]}>
                <View style={[styles.progressoBarraPreenchida, { width: '100%',}]} />
              </View>
              <Text style={styles.infoLinha}>100%</Text>
            </View>

            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
              <Text style={styles.infoLinha}>Estrutura </Text>
              <View style={[styles.progressoBarraFundo, {width: '70%', margin: 8, marginTop: -1}]}>
                <View style={[styles.progressoBarraPreenchida, { width: '70%',}]} />
              </View>
              <Text style={styles.infoLinha}>70%</Text>
            </View>

            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
              <Text style={styles.infoLinha}>Acabamento </Text>
              <View style={[styles.progressoBarraFundo, {width: '70%', margin: 8, marginTop: -1}]}>
                <View style={[styles.progressoBarraPreenchida, { width: '45%',}]} />
              </View>
              <Text style={styles.infoLinha}>45%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Equipe</Text>
        <View style={[styles.infoCard, {flexDirection: 'row'}]}>
          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/Home.png')}/>
            <Text style={[styles.infoLinha,{fontSize: 8}]}>Mestre de Obras</Text>
            <Text style={[styles.infoLinha,{fontSize: 14}]}>João Neves</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/Home.png')}/>
            <Text style={[styles.infoLinha,{fontSize: 8}]}>Funcionários Ativos</Text>
            <Text style={[styles.infoLinha,{fontSize: 14, color: '#F57C00'}]}>34</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/Home.png')}/>
            <Text style={[styles.infoLinha,{fontSize: 8}]}>Horas Trabalhadas</Text>
            <Text style={[styles.infoLinha,{fontSize: 14, color: '#F57C00'}]}>192h</Text>
          </View>

          <View style={styles.divisao}>
            <Image style={styles.foto1} source={require('../assets/Home.png')}/>
            <Text style={[styles.infoLinha,{fontSize: 8}]}>Próxima Ação</Text>
            <Text style={[styles.infoLinha,{fontSize: 14, color: '#F57C00'}]}>14h00</Text>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Próximas Ações</Text>
        <View style={styles.infoCard}>
          <View style={{flexDirection: 'row'}}>
            <Checkbox value={marcado} onValueChange={setMarcado} color={marcado ? '#277D2C' : undefined}/>
            <Text style={styles.infoLinha}> Instalação elétrica do bloco A</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Checkbox value={marcado} onValueChange={setMarcado} color={marcado ? '#277D2C' : undefined}/>
            <Text style={styles.infoLinha}> Instalação elétrica do bloco B</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Checkbox value={marcado} onValueChange={setMarcado} color={marcado ? '#277D2C' : undefined}/>
            <Text style={styles.infoLinha}> Instalação elétrica do bloco C</Text>
          </View>
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