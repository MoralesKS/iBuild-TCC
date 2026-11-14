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
let respond=null; const storage=new Map();
const navigation={navigate:(...v)=>calls.push(v),push:(...v)=>calls.push(v),goBack:()=>calls.push(['BACK']),canGoBack:()=>true,addListener:()=>()=>{},getState:()=>({routes:[]})};
const auth={currentUser:null};
const native={};
for(const n of ['View','Text','TextInput','TouchableOpacity','Pressable','ScrollView','Image','KeyboardAvoidingView','Modal','FlatList','ActivityIndicator'])native[n]=n;
native.Image = props=>React.createElement('Image',props);native.Image.resolveAssetSource=()=>({width:1024,height:512});
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
 if(name==='expo-image-picker')return {};
 if(name==='expo-location')return {requestForegroundPermissionsAsync:async()=>({status:'granted'}),getCurrentPositionAsync:async()=>({coords:{latitude:-23.5,longitude:-46.6}}),Accuracy:{Balanced:1}};
 if(name==='react-native-maps')return {__esModule:true,default:'MapView',Marker:'Marker'};
 if(name==='@react-native-community/datetimepicker')return {__esModule:true,default:'DateTimePicker'};
 if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{getItem:async k=>storage.get(k)||null,setItem:async(k,v)=>{storage.set(k,v)},removeItem:async k=>{storage.delete(k)}}};
 if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name));
 throw Error('Unmocked '+name);
 };
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{babelrc:false,configFile:false,plugins:[require.resolve(appRoot+'/node_modules/@babel/plugin-transform-modules-commonjs'),[require.resolve(appRoot+'/node_modules/@babel/plugin-transform-react-jsx'),{runtime:'automatic'}]]}).code;
 const wrappedRequire=name=>name==='react/jsx-runtime'?require(appRoot+'/node_modules/react/jsx-runtime'):req(name);
 vm.runInNewContext('(function(require,module,exports){'+code+'\n})',{console,process,setTimeout,clearTimeout,AbortController,URL,alert:(...a)=>alerts.push(a),fetch:async(url,opts)=>{
 fetches.push([url,opts]);if(respond){const r=await respond(url,opts);if(r)return r;}if(apiFailure)throw Error('offline');let data={idUsuario:1,nome:'Usuário teste',email:'teste@example.test',tipoPerfil:'pessoa_fisica',foto:null};
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
 assert(!tree.root.findAllByType('Text').some(t=>text(t)==='Próxima Ação'));checks++;await unmount();
 currentRoute={params:{}};await mount(React.createElement(Details));assert(tree.root.findAllByType('Text').some(t=>text(t)==='Obra indisponível.'));checks++;await unmount();
 // Progress is mean and clamps missing/invalid values.
 const f=load(appRoot+'/src/Functions.js');assert.equal(f.calcularProgresso({etapas:{fundacao:100,estrutura:50,acabamento:0}}),50);assert.equal(f.calcularProgresso({}),0);checks+=2;
 // Main bottom bar sends Chat to list; active item is selected.
 const Bottom=load(appRoot+'/componentes/BottomBar.js').default;await mount(React.createElement(Bottom,{ativa:'chat'}));const tab=tree.root.findAllByType('TouchableOpacity').find(t=>t.props.accessibilityLabel==='Chat');assert.equal(tab.props.accessibilityState.selected,true);await act(async()=>tab.props.onPress());assert.equal(calls.at(-1)[0],'Chat 1');checks++;await unmount();
 // Profile has only persistent settings; session overlay must not override authenticated data.
 currentRoute={params:{}};const Profile=load(appRoot+'/screens/Perfil.js').default;apiFailure=true;
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(chats.ConversasProvider,null,React.createElement(Capture),React.createElement(Profile))));
 assert(tree.root.findAllByType('Text').some(t=>text(t).includes('Servidor indisponível')));assert(!button('Editar perfil nesta sessão'));checks+=2;
 await act(async()=>button('Sair da conta').props.onPress());await act(async()=>alerts.at(-1)[2].find(b=>b.text==='Sair').onPress());assert.equal(auth.currentUser,null);checks++;await unmount();apiFailure=false;
 const ok=data=>({ok:true,status:200,json:async()=>data});
 const work={id:10,idProprietario:1,nome:'Obra real',etapas:{fundacao:0,estrutura:0,acabamento:0},equipe:{},proximasAcoes:[{id:1,texto:'Uma tarefa',etapa:'estrutura',feito:false}]};
 respond=async(url,o)=>{
   if(url.includes('/obras/participando'))return ok([]);
   if(/\/obras(\?|$)/.test(url))return ok([work]);
   if(url.includes('/obras/10'))return ok(work);
   if(url.includes('/tarefas/1')){const b=JSON.parse(o.body);work.proximasAcoes[0].feito=b.feito;work.etapas.estrutura=b.feito?100:0;return ok({ok:true});}
 };
 await firebase.signInWithEmailAndPassword();const Works=load(appRoot+'/screens/Gerenciar.js').default;
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Capture),React.createElement(Works)));
 assert(button('Adicionar aos favoritos'));await act(async()=>button('Adicionar aos favoritos').props.onPress());assert.equal(context.sessao.obras.favoritos.length,1);checks++;
 await act(async()=>button('Editar').props.onPress());assert.equal(calls.at(-1)[0],'NovaObra');assert.equal(calls.at(-1)[1].obra.id,10);checks++;
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder==='Pesquisar obra ou construtora').props.onChangeText('inexistente-xyz'));
 assert(tree.root.findAllByType('Text').some(t=>text(t)==='Nenhuma obra encontrada.'));checks++;
 const bar=tree.root.findAllByType('SafeAreaView').find(t=>t.props.edges?.includes('bottom'));let parent=bar.parent;while(parent){assert.notEqual(parent.type,'ScrollView');parent=parent.parent;}checks++;await unmount();
 currentRoute={params:{obra:{...work,doBanco:true}}};
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Details)));
 await act(async()=>tree.root.findByType('Checkbox').props.onValueChange());assert(work.proximasAcoes[0].feito);assert(tree.root.findAllByType('Text').some(t=>text(t).includes('33%')));checks++;
 await act(async()=>tree.root.findByType('Checkbox').props.onValueChange());assert(!work.proximasAcoes[0].feito);checks++;await unmount();
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Details)));assert.equal(tree.root.findByType('Checkbox').props.value,false);checks++;await unmount();
 // Checkout: failed call keeps cart and persisted key; repeat sends same request and clears on success.
 respond=null;const cartModule=load(appRoot+'/src/CarrinhoItens.js');const Checkout=load(appRoot+'/screens/Carrinho.js').default;let cart;
 function CartCapture(){cart=cartModule.useCarrinho();return null;}
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(cartModule.CarrinhoProvider,null,React.createElement(CartCapture),React.createElement(Checkout))));
 await act(async()=>cart.adicionarAoCarrinho({id:'db-10',idAnuncio:10,nome:'Tijolo',preco:'R$ 10,00'}));
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder==='Digite IBUILD10').props.onChangeText('IBUILD10'));
 await act(async()=>button('Aplicar').props.onPress());assert(tree.root.findAllByType('Text').some(t=>text(t)==='R$ 9,00'));checks++;
 await act(async()=>cart.atualizarQuantidade('db-10',2));assert(tree.root.findAllByType('Text').some(t=>text(t)==='R$ 18,00'));checks++;
 await act(async()=>button('Registrar pedido').props.onPress());assert.equal(alerts.at(-1)[0],'Faltam dados');checks++;
 await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder==='Rua, número, bairro e cidade').props.onChangeText('Rua Teste 123, São Paulo'));
 await act(async()=>button('Salvar endereço').props.onPress());await act(async()=>button('Pix').props.onPress());
 let pedidoCalls=[];let offline=true;
 respond=async(u,o)=>{if(u.endsWith('/pedidos')){pedidoCalls.push(JSON.parse(o.body));if(offline)throw Error('offline');return ok({id:44,total:30.9,status:'pendente_pagamento'});}};
 await act(async()=>{const click=button('Registrar pedido').props.onPress;await Promise.all([click(),click()]);});
 assert.equal(pedidoCalls.length,1);assert.equal(cart.itens.length,1);assert(storage.size>0);checks+=3;
 offline=false;await act(async()=>button('Confirmar tentativa anterior').props.onPress());assert.equal(pedidoCalls[0].chave,pedidoCalls[1].chave);assert.equal(cart.itens.length,0);assert.equal(storage.size,0);assert.equal(alerts.at(-1)[0],'Pedido registrado');checks+=4;await unmount();
 // Shared avatar handles missing/failed/updated URLs.
 const Avatar=load(appRoot+'/componentes/Avatar.js').default;
 await mount(React.createElement(Avatar,{source:{uri:'https://api.test/uploads/a.png'}}));
 await act(async()=>tree.root.findByType('Image').props.onError());assert.equal(tree.root.findByType('Image').props.source,1);checks++;
 await act(async()=>tree.update(React.createElement(Avatar,{source:{uri:'https://api.test/uploads/b.png'}})));assert.equal(tree.root.findByType('Image').props.source.uri,'https://api.test/uploads/b.png');checks++;
 await act(async()=>tree.update(React.createElement(Avatar,{})));assert.equal(tree.root.findByType('Image').props.source,1);checks++;await unmount();
 // Map real user ID is independent of the display key.
 respond=async(u)=>u.endsWith('/lojas')?ok([{id:73,nome:'Loja real',endereco:'São Paulo',latitude:-23.5,longitude:-46.6}]):undefined;
 const Map=load(appRoot+'/screens/Mapa.js').default;await mount(React.createElement(Map));
 const marker=tree.root.findAllByType('Marker').find(n=>n.props.title==='Loja real');await act(async()=>marker.props.onPress());await act(async()=>button('Ver perfil da loja').props.onPress());assert.deepEqual(calls.at(-1).slice(0,1),['PerfilAutonomo']);assert.equal(calls.at(-1)[1].usuarioId,73);checks++;await unmount();
 const back=load(appRoot+'/src/navegacao.js');back.voltar(navigation,'Home');assert.equal(calls.at(-1)[0],'BACK');const fallbackCalls=[];back.voltar({canGoBack:()=>false,navigate:r=>fallbackCalls.push(r)},'Cadastro');assert.equal(fallbackCalls[0],'Cadastro');checks+=2;
 // Logos use contain and fit a 320px screen; keyboard layouts are scrollable.
 respond=null;const Logo=load(appRoot+'/componentes/Logo.js').default;await mount(React.createElement(Logo));assert.equal(tree.root.findByType('Image').props.resizeMode,'contain');assert(tree.root.findByType('Image').props.style.width<=272);checks+=2;await unmount();
 // Cadastro autônomo: formulário completo e aceite, com CPF vazio.
 await firebase.signOut();const Signup=load(appRoot+'/screens/CadastroAutonomos.js').default;
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Signup)));
 for(const [placeholder,value] of [['Nome completo','Pessoa Teste'],['Profissão / área de atuação','Pedreiro'],['Telefone: (XX) XXXXX-XXXX','11987654321'],['Email','autonomo@example.test'],['Senha','senha-teste'],['Confirme sua senha','senha-teste']]) await act(async()=>tree.root.findAllByType('TextInput').find(t=>t.props.placeholder===placeholder).props.onChangeText(value));
 await act(async()=>button('Aceito os Termos').props.onPress());const antesCadastro=fetches.length;await act(async()=>button('Cadastrar').props.onPress());
 const cadastro=fetches.slice(antesCadastro).find(([u,o])=>u.endsWith('/usuarios')&&o.method==='POST');assert(cadastro);assert.equal(JSON.parse(cadastro[1].body).cpf,null);assert.equal(JSON.parse(cadastro[1].body).tipo_perfil,'autonomo');checks+=3;await unmount();
 // Avaliação envia nota escolhida e mostra o resumo atualizado.
 await firebase.signInWithEmailAndPassword();let resumo={media:0,quantidade:0,minha:null};
 respond=async(u,o)=>{if(u.includes('/avaliacoes/')){if(o.method==='PUT'){const b=JSON.parse(o.body);resumo={media:b.nota,quantidade:1,minha:b};}return ok(resumo);}};
 const Rating=load(appRoot+'/componentes/Avaliacao.js').default;await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Rating,{tipo:'produto',id:10,dono:2})));
 await act(async()=>button('Nota 4').props.onPress());await act(async()=>button('Enviar avaliação').props.onPress());assert.equal(resumo.media,4);assert(button('Atualizar avaliação'));checks+=2;await unmount();
 // A failed read stops loading, and retry restores the evaluation form.
 let falhaAvaliacoes=true;
 respond=async(u)=>{
  if (!u.includes('/avaliacoes/')) return;
  return falhaAvaliacoes ? {ok:false,status:404,json:async()=>({})} : ok(resumo);
 };
 await mount(React.createElement(apiModule.UsuarioProvider,null,React.createElement(Rating,{tipo:'perfil',id:2,dono:2})));
 assert(tree.root.findAllByType('Text').some(n=>n.props.children==='Avaliações indisponíveis no momento.'));
 assert(!tree.root.findAllByType('Text').some(n=>n.props.children==='Carregando avaliações…'));
 assert(!button('Nota 4'));
 falhaAvaliacoes=false;await act(async()=>button('Tentar novamente').props.onPress());
 assert(button('Nota 4'));checks+=4;await unmount();
 // Contratar: duas pessoas, foto relativa convertida para HTTPS e avatar padrão.
 let fotoLista='/uploads/foto-v1.png';
 respond=async(u)=>u.endsWith('/profissionais')?ok([{id:11,idUsuario:21,nome:'Com foto',categoria:'Pedreiro',foto:fotoLista},{id:12,idUsuario:22,nome:'Sem foto',categoria:'Eletricista',foto:null}]):undefined;
 const Hire=load(appRoot+'/screens/Contratar.js').default;await mount(React.createElement(Hire));
 let avatars=tree.root.findAllByType(Avatar);assert.equal(avatars.length,2);assert(avatars[0].props.source.uri.endsWith('/uploads/foto-v1.png'));assert(avatars[0].props.source.uri.startsWith('https://'));assert.equal(avatars[1].props.source,1);checks+=3;await unmount();
 fotoLista='/uploads/foto-v2.png';await mount(React.createElement(Hire));avatars=tree.root.findAllByType(Avatar);assert(avatars[0].props.source.uri.endsWith('/uploads/foto-v2.png'));checks++;await unmount();respond=null;
 console.log(`PASS: ${checks} component/state checks with mocked native services.`);
})().catch(e=>{console.error(e);process.exitCode=1});
