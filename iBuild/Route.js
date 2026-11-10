import { createDrawerNavigator } from '@react-navigation/drawer';
import { CarrinhoProvider } from './src/CarrinhoItens';

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

const Drawer = createDrawerNavigator();

export default function Route({ autenticado }) {
  return (
    <CarrinhoProvider>
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        {autenticado ? (
          <>
            <Drawer.Screen name='Home' component={HomeScreen} />
            <Drawer.Screen name='Produto' component={ProdutoScreen} />
            <Drawer.Screen name='DetalhesObra' component={DetalhesObrasScreen} />
            <Drawer.Screen name='Gerenciar' component={GerenciarScreen} />
            <Drawer.Screen name='Contratar' component={ContratarScreen} />
            <Drawer.Screen name='Atribuir Funcionários' component={AtribuirFuncionariosScreen} />
            <Drawer.Screen name='Notificação' component={NotificacaoScreen} />
            <Drawer.Screen name='Mapa' component={MapaScreen} />
            <Drawer.Screen name='Carrinho' component={CarrinhoScreen} />
            <Drawer.Screen name='Chat 1' component={Chat1Screen} />
            <Drawer.Screen name='Chat 2' component={Chat2Screen} />
            <Drawer.Screen name='Perfil' component={PerfilScreen} />
            <Drawer.Screen
              name='PerfilAutonomo'
              component={PerfilScreen}
              options={{ drawerItemStyle: { display: 'none' } }}
            />
            <Drawer.Screen name='Anunciar' component={AnunciarScreen} />
          </>
        ) : (
          <>
            <Drawer.Screen name='Login' component={LoginScreen} />
            <Drawer.Screen name='Cadastro' component={CadastroScreen} />
            <Drawer.Screen name='CadastroPessoaFisica' component={CadastroPFScreen} />
            <Drawer.Screen name='CadastroAutonomo' component={CadastroAScreen} />
            <Drawer.Screen name='CadastroEmpresa' component={CadastroEScreen} />
            <Drawer.Screen name='RedefinicaoSenha' component={RedefinicaoSenhaScreen} />
          </>
        )}
      </Drawer.Navigator>
    </CarrinhoProvider>
  );
}