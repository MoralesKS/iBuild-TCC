import {createDrawerNavigator} from '@react-navigation/drawer';
""
import HomeScreen from './screens/Home'
import MapaScreen from './screens/Mapa'
import CarrinhoScreen from './screens/Carrinho'
import LoginScreen from './screens/Login'
import CadastroScreen from './screens/Cadastro'
import CadastroAScreen from './screens/CadastroAutonomos'
import CadastroPFScreen from './screens/CadastroPessoaFisica'
import CadastroEScreen from './screens/CadastroEmpresa'
import Chat1Screen from './screens/Chat1'
import Chat2Screen from './screens/Chat2'
import PerfilScreen from './screens/Perfil'
import ContratarScreen from './screens/Contratar'
import GerenciarScreen from './screens/Gerenciar'

const Drawer = createDrawerNavigator()

export default function Route(){
  return(
    <Drawer.Navigator>
      <Drawer.Screen name='Cadastro' component={CadastroScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='CadastroEmpresa' component={CadastroEScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='CadastroPessoaFisica' component={CadastroPFScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='CadastroAutonomo' component={CadastroAScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Mapa' component={MapaScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Carrinho' component={CarrinhoScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Contratar' component={ContratarScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Gerenciar' component={GerenciarScreen} options={{headerShown: false}}/>
      <Drawer.Screen name='Chat 1' component={Chat1Screen} options={{headerShown: false}}/>
      <Drawer.Screen name='Chat 2' component={Chat2Screen} options={{headerShown: false}}/>
      <Drawer.Screen name='Perfil' component={PerfilScreen} options={{headerShown: false}}/>
    </Drawer.Navigator>
  )
}