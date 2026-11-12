import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversasProvider } from './screens/Chat1';
import { CarrinhoProvider } from './src/CarrinhoItens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

const Drawer = createNativeStackNavigator();

// "usuario" é o usuário do Firebase (null se ninguém estiver logado).
// Quem já está logado abre direto na Home; os outros começam no Login.
// IMPORTANTE: a primeira tela da lista NÃO decide mais a tela inicial (initialRouteName decide).
export default function Route({ autenticado }) {
  return (
    <SafeAreaProvider>
    <ConversasProvider>
      <CarrinhoProvider>
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
        {!autenticado ? <>
          <Drawer.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Cadastro' component={CadastroScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroPessoaFisica' component={CadastroPFScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroAutonomo' component={CadastroAScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='CadastroEmpresa' component={CadastroEScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='RedefinicaoSenha' component={RedefinicaoSenhaScreen} />
        </> : <>
          <Drawer.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Produto' component={ProdutoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='DetalhesObra' component={DetalhesObrasScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Gerenciar' component={GerenciarScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='NovaObra' component={NovaObraScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Contratar' component={ContratarScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Atribuir Funcionários' component={AtribuirFuncionariosScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Notificação' component={NotificacaoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Mapa' component={MapaScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Carrinho' component={CarrinhoScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Chat 1' component={Chat1Screen} options={{headerShown: false}}/>
          <Drawer.Screen name='Chat 2' component={Chat2Screen} options={{headerShown: false}}/>
          <Drawer.Screen name='Perfil' component={PerfilScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='PerfilAutonomo' component={PerfilScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Configuracoes' component={ConfiguracoesScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='Anunciar' component={AnunciarScreen} options={{headerShown: false}}/>
          <Drawer.Screen name='EditarAnuncio' component={AnunciarScreen} options={{headerShown: false}}/>
        </>}
        </Drawer.Navigator>
      </CarrinhoProvider>
    </ConversasProvider>
    </SafeAreaProvider>
  );
}