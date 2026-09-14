import { createDrawerNavigator } from '@react-navigation/drawer';
import { CarrinhoProvider } from './src/CarrinhoItens';

import HomeScreen from './screens/Home'
import ProdutoScreen from './screens/Produto'
import MapaScreen from './screens/Mapa'
import CarrinhoScreen from './screens/Carrinho'
import LoginScreen from './screens/Login'
import CadastroScreen from './screens/Cadastro'
import RedefinicaoSenhaScreen from './screens/RedefinicaoSenha'
import CadastroAScreen from './screens/CadastroAutonomos'
import CadastroPFScreen from './screens/CadastroPessoaFisica'
import CadastroEScreen from './screens/CadastroEmpresa'
import Chat1Screen from './screens/Chat1'
import Chat2Screen from './screens/Chat2'
import PerfilScreen from './screens/Perfil'
import ContratarScreen from './screens/Contratar'
import GerenciarScreen from './screens/Gerenciar'
import AtribuirFuncionariosScreen from './screens/AtribuirFuncionarios'
import NotificacaoScreen from './screens/Notificacao'
import DetalhesObrasScreen from './screens/DetalheObras'

const Drawer = createDrawerNavigator()

export default function Route(){
  return(
    // Tudo que fica DENTRO do CarrinhoProvider consegue chamar useCarrinho()
    // e enxergar o MESMO carrinho — não importa se a pessoa está na Home,
    // no Produto, ou em qualquer outra tela do Drawer.
    <CarrinhoProvider>
      <Drawer.Navigator>
        <Drawer.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Produto' component={ProdutoScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='DetalhesObra' component={DetalhesObrasScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Gerenciar' component={GerenciarScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Contratar' component={ContratarScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Atribuir Funcionários' component={AtribuirFuncionariosScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Notificação' component={NotificacaoScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='RedefinicaoSenha' component={RedefinicaoSenhaScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Cadastro' component={CadastroScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='CadastroPessoaFisica' component={CadastroPFScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='CadastroAutonomo' component={CadastroAScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='CadastroEmpresa' component={CadastroEScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Mapa' component={MapaScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Carrinho' component={CarrinhoScreen} options={{headerShown: false}}/>
        <Drawer.Screen name='Chat 1' component={Chat1Screen} options={{headerShown: false}}/>
        <Drawer.Screen name='Chat 2' component={Chat2Screen} options={{headerShown: false}}/>
        <Drawer.Screen name='Perfil' component={PerfilScreen} options={{headerShown: false}}/>
      </Drawer.Navigator>
    </CarrinhoProvider>
  )
}