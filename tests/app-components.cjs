// React component tests with mocked native primitives, navigation, network and Firebase.
// These do not substitute Android/iOS device validation.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const appRoot=path.resolve(__dirname,'../iBuild');
const React=require(appRoot+'/node_modules/react');
const renderer=require(appRoot+'/node_modules/react-test-renderer');
const babel=require(appRoot+'/node_modules/@babel/core');
global.IS_REACT_ACT_ENVIRONMENT=true;
const {act}=renderer;
let currentRoute={params:{}},calls=[],alerts=[],authListener;
const navigation={navigate:(...v)=>calls.push(v),goBack:()=>calls.push(['BACK']),canGoBack:()=>true,addListener:()=>()=>{},getState:()=>({routes:[]})};
const auth={currentUser:null};
const native={};
for(const n of ['View','Text','TextInput','TouchableOpacity','Pressable','ScrollView','Image','KeyboardAvoidingView','Modal','FlatList'])native[n]=n;
native.StyleSheet={create:v=>v,hairlineWidth:1};native.Platform={OS:'android'};native.useWindowDimensions=()=>({width:320,height:640});native.Alert={alert:(...a)=>alerts.push(a)};native.Linking={openURL:async()=>{}};
let uid=0,apiFailure=false,fetches=[];
function fakeUser(id='test-user') {return {uid:id,email:'teste@example.test',getIdToken:async()=>id};}
const firebase={onAuthStateChanged:(a,fn)=>{authListener=fn;fn(auth.currentUser);return()=>{}},signInWithEmailAndPassword:async()=>{auth.currentUser=fakeUser();authListener?.(auth.currentUser);return{user:auth.currentUser}},createUserWithEmailAndPassword:async()=>{auth.currentUser=fakeUser('new-'+(++uid));authListener?.(auth.currentUser);return{user:auth.currentUser}},signOut:async()=>{auth.currentUser=null;authListener?.(null)},sendPasswordResetEmail:async()=>{}};
const cache=new Map();
const navMock={useNavigation:()=>navigation,useRoute:()=>currentRoute,useFocusEffect:fn=>React.useEffect(fn,[fn]),NavigationContainer:'NavigationContainer'};
function load(file) {
 file=path.resolve(file);if(!path.extname(file))file+='.js';if(!file.endsWith('.js'))return 1;
 if(cache.has(file))return cache.get(file).exports;
 const m={exports:{}};cache.set(file,m);
 const req=name=>{
 if(name==='react')return React;if(name==='react-native')return native;
 if(name==='firebase/auth')return firebase;
 if(name.includes('firebase.config'))return {auth};
 if(name==='@react-navigation/native')return navMock;
 if(name==='@react-navigation/native-stack')return {createNativeStackNavigator:()=>({Navigator:'Navigator',Screen:'Screen'})};
 if(name==='react-native-safe-area-context')return {SafeAreaProvider:'SafeAreaProvider',SafeAreaView:'SafeAreaView',useSafeAreaInsets:()=>({top:24,bottom:16})};
 if(name==='@expo/vector-icons')return {Ionicons:'Ionicons'};
 if(name==='expo-checkbox')return {__esModule:true,default:'Checkbox'};
 if(name==='expo-location'||name==='expo-image-picker')return {};
 if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{getItem:async()=>null,setItem:async()=>{}}};
 if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name));
 throw Error('Unmocked '+name);
 };
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{babelrc:false,configFile:false,plugins:[require.resolve(appRoot+'/node_modules/@babel/plugin-transform-modules-commonjs'),[require.resolve(appRoot+'/node_modules/@babel/plugin-transform-react-jsx'),{runtime:'automatic'}]]}).code;
 const wrappedRequire=name=>name==='react/jsx-runtime'?require(appRoot+'/node_modules/react/jsx-runtime'):req(name);
 vm.runInNewContext('(function(require,module,exports){'+code+'\n})',{console,process,setTimeout,clearTimeout,AbortController,URL,alert:(...a)=>alerts.push(a),fetch:async(url,opts)=>{
 fetches.push([url,opts]);if(apiFailure)throw Error('offline');let data={idUsuario:1,nome:'Usuário teste',email:'teste@example.test',tipoPerfil:'pessoa_fisica',foto:null};
 if(/\/(obras|anuncios|notificacoes|profissionais|lojas)(\?|$|\/participando)/.test(url))data=[];
 return {ok:true,status:200,json:async()=>data};
 }})(wrappedRequire,m,m.exports);return m.exports;
}
const apiModule=load(appRoot+'/src/api.js');const chats=load(appRoot+'/screens/Chat1.js');
let context;
function Capture(){context=apiModule.useUsuario();return null;}
let tree;
async function mount(element){await act(async()=>{tree=renderer.create(element);});}
async function unmount(){await act(async()=>tree.unmount());}
function text(node){return typeof node==='string'?node:node?.children?.map(text).join('')||'';}
function button(label){return tree.root.findAll(n=>['TouchableOpacity','Pressable'].includes(n.type)).find(n=>text(n).includes(label)||n.props.accessibilityLabel===label);}
let checks=0;
(async()=>{
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Capture)));
 assert.equal(context.usuarioFirebase,null); checks++;
 await act(async()=>firebase.signInWithEmailAndPassword());assert.equal(context.usuarioFirebase.uid,'test-user');assert.equal(context.usuario.nome,'Usuário teste');checks++;
 assert(fetches.some(([u,o])=>u.endsWith('/usuarios/me')&&o.headers.Authorization==='Bearer test-user'));checks++;
 context.sessao.perfil={nome:'Temporário'};
 await act(async()=>apiModule.sair());assert.equal(context.usuarioFirebase,null);assert.equal(Object.keys(context.sessao).length,0);checks++;
 await assert.rejects(()=>context.cadastrarUsuario('a','b',{},false));checks++;
 await act(async()=>context.cadastrarUsuario('a','b',{nome:'Teste',tipo_perfil:'pessoa_fisica'},true));assert.equal(context.usuarioFirebase,null);assert.equal(auth.currentUser,null);checks++;
 assert(fetches.some(([u,o])=>u.endsWith('/usuarios')&&JSON.parse(o.body).versao_documentos==='1'));checks++;
 apiFailure=true;await act(async()=>firebase.signInWithEmailAndPassword());assert(context.erroPerfil);assert.equal(context.usuarioFirebase.uid,'test-user');checks++;apiFailure=false;
 await unmount();
 // Session chat data, correct seller, list screen and Back action.
 let conversations;function ChatCapture(){conversations=chats.useConversas();return null;}
 await mount(React.createElement(chats.ConversasProvider,null,React.createElement(ChatCapture),React.createElement(chats.default,{navigation})));
 const id=chats.garantirConversa(conversations,{id:'u-123',nome:'Loja Teste'});assert.equal(chats.garantirConversa(conversations,{id:'u-123',nome:'Loja Teste'}),id);assert.equal(conversations.filter(c=>c.id===id).length,1);checks++;
 const Chat2=load(appRoot+'/screens/Chat2.js').default;
 await act(async()=>tree.update(React.createElement(chats.ConversasProvider,null,React.createElement(ChatCapture),React.createElement(Chat2,{navigation,route:{params:{conversaId:id}}}))));
 assert(tree.root.findAllByType('Text').some(t=>text(t)==='Loja Teste'));await act(async()=>button('Voltar da conversa').props.onPress());assert.equal(calls.at(-1)[0],'BACK');checks++;
 await unmount();await mount(React.createElement(chats.ConversasProvider,null,React.createElement(ChatCapture)));assert(!conversations.some(c=>c.id==='u-123'));checks++;await unmount();
 // Obras with missing optionals and inaccessible route.
 const Details=load(appRoot+'/screens/DetalheObras.js').default;
 currentRoute={params:{obra:{id:'demo-test',nome:'Obra sem opcionais'}}};
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Details)));
 assert(tree.root.findAllByType('Text').some(t=>text(t)==='Próxima Ação'));checks++;await unmount();
 currentRoute={params:{}};await mount(React.createElement(Details));assert(tree.root.findAllByType('Text').some(t=>text(t)==='Obra indisponível.'));checks++;await unmount();
 // Progress is mean and clamps missing/invalid values.
 const f=load(appRoot+'/src/Functions.js');assert.equal(f.calcularProgresso({etapas:{fundacao:100,estrutura:50,acabamento:0}}),50);assert.equal(f.calcularProgresso({}),0);checks+=2;
 // Main bottom bar sends Chat to list; active item is selected.
 const Bottom=load(appRoot+'/componentes/BottomBar.js').default;await mount(React.createElement(Bottom,{ativa:'chat'}));const tab=tree.root.findAllByType('TouchableOpacity').find(t=>t.props.accessibilityLabel==='Chat');assert.equal(tab.props.accessibilityState.selected,true);await act(async()=>tab.props.onPress());assert.equal(calls.at(-1)[0],'Chat 1');checks++;await unmount();
 // Profile fallback remains editable only in session; cancellation discards draft.
 currentRoute={params:{}};const Profile=load(appRoot+'/screens/Perfil.js').default;apiFailure=true;
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(chats.ConversasProvider,null,React.createElement(Capture),React.createElement(Profile))));
 assert(tree.root.findAllByType('Text').some(t=>text(t).includes('Servidor indisponível')));checks++;
 await act(async()=>button('Editar perfil nesta sessão').props.onPress());
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.accessibilityLabel==='Nome').props.onChangeText('Rascunho descartado'));
 await act(async()=>button('Cancelar').props.onPress());assert(!context.sessao.perfil);checks++;
 await act(async()=>button('Editar perfil nesta sessão').props.onPress());
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.accessibilityLabel==='Nome').props.onChangeText('Nome temporário'));
 await act(async()=>button('Salvar nesta sessão').props.onPress());assert.equal(context.sessao.perfil.nome,'Nome temporário');checks++;
 await act(async()=>button('Sair da conta').props.onPress());await act(async()=>alerts.at(-1)[2].find(b=>b.text==='Sair').onPress());assert.equal(auth.currentUser,null);checks++;await unmount();apiFailure=false;
 // Obras search/filter/favorite and footer separate from scroll.
 await firebase.signInWithEmailAndPassword();const Works=load(appRoot+'/screens/Gerenciar.js').default;
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Capture),React.createElement(Works)));
 assert(button('Adicionar aos favoritos'));await act(async()=>button('Adicionar aos favoritos').props.onPress());assert.equal(context.sessao.obras.favoritos.length,1);checks++;
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder==='Pesquisar obra ou construtora').props.onChangeText('inexistente-xyz'));
 assert(tree.root.findAllByType('Text').some(t=>text(t)==='Nenhuma obra encontrada.'));checks++;
 const bar=tree.root.findAllByType('SafeAreaView').find(t=>t.props.edges?.includes('bottom'));let parent=bar.parent;while(parent){assert.notEqual(parent.type,'ScrollView');parent=parent.parent;}checks++;
 await unmount();
 // Checkout arithmetic: coupon tracks quantity and confirmation never calls API.
 const cartModule=load(appRoot+'/src/CarrinhoItens.js');const Checkout=load(appRoot+'/screens/Carrinho.js').default;let cart;
 function CartCapture(){cart=cartModule.useCarrinho();return null;}
 await mount(React.createElement(cartModule.CarrinhoProvider,null,React.createElement(CartCapture),React.createElement(Checkout)));
 await act(async()=>cart.adicionarAoCarrinho({id:'test',nome:'Tijolo',preco:'R$ 10,00'}));
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder==='Digite IBUILD10').props.onChangeText('IBUILD10'));
 await act(async()=>button('Aplicar').props.onPress());assert(tree.root.findAllByType('Text').some(t=>text(t)==='R$ 9,00'));checks++;
 await act(async()=>cart.atualizarQuantidade('test',2));assert(tree.root.findAllByType('Text').some(t=>text(t)==='R$ 18,00'));checks++;
 const before=fetches.length;await act(async()=>button('Validar pedido demonstrativo').props.onPress());assert.equal(alerts.at(-1)[0],'Faltam dados');assert.equal(fetches.length,before);checks++;
 await unmount();
 console.log(`PASS: ${checks} component/state checks with mocked native services.`);
})().catch(e=>{console.error(e);process.exitCode=1});
