import { createDrawerNavigator } from '@react-navigation/drawer';
import { CarrinhoProvider } from './src/CarrinhoItens';
import { UsuarioProvider } from './src/api';

import LoginScreen from './screens/Login'
import CadastroScreen from './screens/Cadastro'
import CadastroAScreen from './screens/CadastroAutonomos'
import CadastroPFScreen from './screens/CadastroPessoaFisica'
import CadastroEScreen from './screens/CadastroEmpresa'
import HomeScreen from './screens/Home'
import ProdutoScreen from './screens/Produto'
import MapaScreen from './screens/Mapa'
import CarrinhoScreen from './screens/Carrinho'
import RedefinicaoSenhaScreen from './screens/RedefinicaoSenha'
import Chat1Screen from './screens/Chat1'
import Chat2Screen from './screens/Chat2'
import PerfilScreen from './screens/Perfil'
import ContratarScreen from './screens/Contratar'
import GerenciarScreen from './screens/Gerenciar'
import AtribuirFuncionariosScreen from './screens/AtribuirFuncionarios'
import NotificacaoScreen from './screens/Notificacao'
import DetalhesObrasScreen from './screens/DetalheObras'
import AnunciarScreen from './screens/Anunciar'
import NovaObraScreen from './screens/NovaObra'
import ConfiguracoesScreen from './screens/Configuracoes'

const Drawer = createDrawerNavigator();

export default function Route({ usuario }) {
  return (
    <UsuarioProvider>
      <CarrinhoProvider>
        <Drawer.Navigator>
          <Drawer.Screen name='NovaObra' component={NovaObraScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Configuracoes' component={ConfiguracoesScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Cadastro' component={CadastroScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroPessoaFisica' component={CadastroPFScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroAutonomo' component={CadastroAScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroEmpresa' component={CadastroEScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Produto' component={ProdutoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='DetalhesObra' component={DetalhesObrasScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Gerenciar' component={GerenciarScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Contratar' component={ContratarScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Atribuir Funcionários' component={AtribuirFuncionariosScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Notificação' component={NotificacaoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='RedefinicaoSenha' component={RedefinicaoSenhaScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Mapa' component={MapaScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Carrinho' component={CarrinhoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Chat 1' component={Chat1Screen} options={{headerShown: false}}/>
          <Drawer.Screen name='Chat 2' component={Chat2Screen} options={{headerShown: false}}/>
          <Drawer.Screen name='Perfil' component={PerfilScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Anunciar' component={AnunciarScreen} options={{headerShown: false}}/>
        </Drawer.Navigator>
      </CarrinhoProvider>
    </UsuarioProvider>
  );
}