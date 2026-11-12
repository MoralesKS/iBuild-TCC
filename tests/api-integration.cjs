// Run ONLY against an isolated empty test database. Firebase verification is stubbed in this process.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const uploads = fs.mkdtempSync(path.join(os.tmpdir(), 'ibuild-api-test-'));
process.env.UPLOAD_DIR = uploads;
const { app, pool, firebaseAuth } = require('../ibuild-api/server');
let server;
(async () => {
 const [rows] = await pool.query('SELECT COUNT(*) n FROM usuarios');
 assert.equal(rows[0].n, 0, 'Use a disposable, empty database');
 firebaseAuth.verifyIdToken = async token => {
   if (!['cliente','autonomo','loja'].includes(token)) throw new Error('invalid test token');
   return {uid:'test-'+token, email:token+'@example.test',email_verified:true};
 };
 server=app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r));
 const url='http://127.0.0.1:'+server.address().port;
 let checks=0;
 async function call(method,path,body,token='cliente',expected=200) {
   const r=await fetch(url+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
   const data=await r.json(); assert.equal(r.status,expected,`${method} ${path}: ${JSON.stringify(data)}`); checks++; return data;
 }
 await call('GET','/',null,null);
 await call('GET','/usuarios/me',null,null,401);
 await call('GET','/usuarios/me',null,'invalid',401);
 await call('POST','/usuarios',{nome:'Teste',tipo_perfil:'pessoa_fisica'},'cliente',400);
 const users={};
 for(const [token,tipo] of [['cliente','pessoa_fisica'],['autonomo','autonomo'],['loja','loja']]) {
  users[token]=await call('POST','/usuarios',{nome:'Teste '+token,tipo_perfil:tipo,profissao:'Pedreiro',versao_documentos:'1',endereco:tipo==='loja'?{logradouro:'Rua Teste',cidade:'São Paulo',estado:'SP',latitude:-23.5,longitude:-46.6}:undefined},token,201);
  assert.equal((await call('GET','/usuarios/me',null,token)).idUsuario,users[token].idUsuario);
 }
 const [aceites]=await pool.query('SELECT versao_documentos, aceite_documentos_em FROM usuarios');
 assert(aceites.every(u=>u.versao_documentos==='1'&&u.aceite_documentos_em));checks++;
 await call('POST','/usuarios',{nome:'Duplicado',tipo_perfil:'pessoa_fisica',versao_documentos:'1'},'cliente',409);
 await call('GET','/usuarios/'+users.cliente.idUsuario,null,null,404);
 const publico=await call('GET','/usuarios/'+users.loja.idUsuario,null,null); assert(!('email' in publico)&&!('cpf' in publico));checks++;
 await call('PATCH','/usuarios/'+users.cliente.idUsuario,{nome:'Outro'},'loja',403);
 await call('PATCH','/usuarios/'+users.cliente.idUsuario,{nome:'Cliente Alterado',telefone:'11999999999'});
 assert.equal((await call('GET','/usuarios/me')).nome,'Cliente Alterado');
 await call('GET','/lojas',null,null); await call('GET','/profissionais',null,null);
 const produto={titulo:'Tijolo de teste',categoria:'Tijolos',quantidade:10,preco:1.2,unidade:'un',localizacao:'São Paulo',contato:'11999999999',estado:'Novo',disponibilidade:'Retirada',foto_capa:{base64:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',ext:'png'},fotos:[]};
 const anuncio=await call('POST','/anuncios',produto,'loja',201);
 await call('GET','/anuncios/'+anuncio.id,null,null);
 await call('PATCH','/anuncios/'+anuncio.id,{...produto,id_usuario:users.loja.idUsuario},'cliente',403);
 await call('DELETE','/anuncios/'+anuncio.id,{id_usuario:users.loja.idUsuario},'cliente',403);
 await call('POST','/pedidos',{itens:[{id_anuncio:anuncio.id,quantidade:1}]},'cliente',501);
 const obra=await call('POST','/obras',{nome:'Obra Teste',endereco:'Rua Teste',cidade:'São Paulo',etapas:[100,50,0]},'cliente',201);
 let detalhes=await call('GET','/obras/'+obra.id+'?usuario=999'); assert.equal(detalhes.nome,'Obra Teste');
 await call('GET','/obras/'+obra.id,null,'loja',403);
 await call('POST','/obras/'+obra.id+'/profissionais',{id_profissional:users.autonomo.idProfissional,funcao:'Pedreiro'});
 await call('GET','/obras/participando',null,'autonomo');
 await call('GET','/obras/'+obra.id,null,'autonomo');
 const tarefa=await call('POST','/obras/'+obra.id+'/tarefas',{texto:'Descrição longa para próxima ação'},'cliente',201);
 await call('PATCH','/tarefas/'+tarefa.id,{feito:true});
 await call('PATCH','/tarefas/'+tarefa.id,{feito:false},'loja',403);
 await call('PATCH','/obras/'+obra.id,{nome:'Obra Editada',endereco:'Rua Nova',cidade:'São Paulo',entrega:'12/12/2026'});
 await call('GET','/notificacoes',null,'autonomo');
 await call('POST','/notificacoes/lidas',{},'autonomo');
 await call('DELETE','/obras/'+obra.id+'/profissionais/'+users.autonomo.idProfissional,{});
 await call('DELETE','/obras/'+obra.id);
 await call('GET','/obras/'+obra.id,null,'cliente',404);
 await call('DELETE','/anuncios/'+anuncio.id,{},'loja');
 await call('GET','/anuncios/'+anuncio.id,null,null,404);
 await call('GET','/usuarios/me',null,null,401);
 console.log(`PASS: ${checks} HTTP/DB checks; Firebase token verification simulated.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(server) await new Promise(r=>server.close(r));await pool.end();fs.rmSync(uploads,{recursive:true,force:true});});
