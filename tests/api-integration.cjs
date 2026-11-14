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
 const clienteAvaliacoes='/avaliacoes/perfil/'+users.cliente.idUsuario;
 assert.deepEqual(await call('GET',clienteAvaliacoes),{media:0,quantidade:0,minha:null});
 await call('GET',clienteAvaliacoes,null,'autonomo',404);
 assert.deepEqual(await call('GET','/avaliacoes/perfil/'+users.autonomo.idUsuario),{media:0,quantidade:0,minha:null});
 const publico=await call('GET','/usuarios/'+users.loja.idUsuario,null,null); assert(!('email' in publico)&&!('cpf' in publico));checks++;
 await call('PATCH','/usuarios/'+users.cliente.idUsuario,{nome:'Outro'},'loja',403);
 await call('PATCH','/usuarios/'+users.cliente.idUsuario,{nome:'Cliente Alterado',telefone:'11999999999'});
 assert.equal((await call('GET','/usuarios/me')).nome,'Cliente Alterado');
 await call('GET','/lojas',null,null); await call('GET','/profissionais',null,null);
 const produto={titulo:'Tijolo de teste',categoria:'Tijolos',quantidade:10,preco:1.2,unidade:'un',localizacao:'São Paulo',contato:'11999999999',estado:'Novo',disponibilidade:'Entregar',foto_capa:{base64:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',ext:'png'},fotos:[]};
 const anuncio=await call('POST','/anuncios',produto,'loja',201);
 await call('GET','/anuncios/'+anuncio.id,null,null);
 await call('PATCH','/anuncios/'+anuncio.id,{...produto,id_usuario:users.loja.idUsuario},'cliente',403);
 await call('DELETE','/anuncios/'+anuncio.id,{id_usuario:users.loja.idUsuario},'cliente',403);
 // Ratings: target separation, replacement, concurrent uniqueness and authorization.
 await call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:0},'cliente',400);
 await call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:5},'loja',403);
 await call('PUT','/avaliacoes/perfil/'+users.autonomo.idUsuario,{nota:5},'autonomo',403);
 await call('PUT','/avaliacoes/perfil/999999',{nota:4},'cliente',404);
 await call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:4,comentario:'Bom'});
 await call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:2},'autonomo');
 let rating=await call('GET','/avaliacoes/produto/'+anuncio.id);assert.equal(rating.media,3);assert.equal(rating.quantidade,2);checks++;
 await Promise.all([call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:5}),call('PUT','/avaliacoes/produto/'+anuncio.id,{nota:5})]);
 rating=await call('GET','/avaliacoes/produto/'+anuncio.id);assert.equal(rating.media,3.5);assert.equal(rating.quantidade,2);checks++;
 await call('PUT','/avaliacoes/perfil/'+users.loja.idUsuario,{nota:4});
 assert.equal((await call('GET','/usuarios/'+users.loja.idUsuario,null,null)).notaMedia,4);checks++;
 assert.equal((await call('GET','/anuncios/'+anuncio.id,null,null)).avaliacao,3.5);checks++;
 // Optional CPF, profile photos, no photo and changed photo visible from list.
 assert.equal((await call('GET','/usuarios/me',null,'autonomo')).cpf,null);checks++;
 let profs=await call('GET','/profissionais',null,null);assert.equal(profs[0].foto,null);checks++;
 await call('PUT','/usuarios/'+users.autonomo.idUsuario+'/foto',produto.foto_capa,'autonomo');
 profs=await call('GET','/profissionais',null,null);const fotoAntes=profs[0].foto;assert(fotoAntes.startsWith('/uploads/'));checks++;
 await call('PUT','/usuarios/'+users.autonomo.idUsuario+'/foto',produto.foto_capa,'autonomo');
 assert.notEqual((await call('GET','/profissionais',null,null))[0].foto,fotoAntes);checks++;
 // Checkout: server totals ignore client price, concurrent retries create exactly one order.
 const pedidoDados={chave:'teste-checkout-unico-001',itens:[{id_anuncio:anuncio.id,quantidade:2,preco:0.01}],endereco:'Rua Teste 123, São Paulo',metodo:'Pix',cupom:'IBUILD10',total:0.01};
 await call('POST','/pedidos',pedidoDados,null,401);
 await call('POST','/pedidos',{...pedidoDados,itens:[{id_anuncio:999999,quantidade:1}]},'cliente',409);
 await call('POST','/pedidos',{...pedidoDados,itens:[{id_anuncio:anuncio.id,quantidade:-1}]},'cliente',400);
 await call('POST','/pedidos',{...pedidoDados,itens:[{id_anuncio:anuncio.id,quantidade:1.5}]},'cliente',400);
 await call('POST','/pedidos',{...pedidoDados,itens:[...pedidoDados.itens,...pedidoDados.itens]},'cliente',400);
 await call('POST','/pedidos',{...pedidoDados,cupom:'INVALIDO'},'cliente',400);
 await call('POST','/pedidos',pedidoDados,'loja',409);
 const [r1,r2]=await Promise.all([fetch(url+'/pedidos',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer cliente'},body:JSON.stringify(pedidoDados)}),fetch(url+'/pedidos',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer cliente'},body:JSON.stringify(pedidoDados)})]);
 assert.deepEqual([r1.status,r2.status].sort(),[200,201]);const pedido=await r1.json();assert.equal(pedido.total,15.06);assert.equal(pedido.status,'pendente_pagamento');checks+=3;
 const replay=await call('POST','/pedidos',pedidoDados);assert.equal(replay.id,pedido.id);checks++;
 await call('POST','/pedidos',{...pedidoDados,cupom:''},'cliente',409);
 assert.equal((await call('GET','/anuncios/'+anuncio.id,null,null)).quantidade,8);checks++;
 const [counts]=await pool.query('SELECT COUNT(*) n FROM pedidos_app');assert.equal(counts[0].n,1);checks++;
 const ns=await call('GET','/notificacoes');assert.equal(ns.filter(n=>n.tipo==='compra').length,1);assert(ns.find(n=>n.tipo==='compra').mensagem.includes('pendente'));checks++;
 assert.equal((await call('GET','/notificacoes',null,'loja')).filter(n=>n.tipo==='compra').length,1);checks++;
 await call('GET','/pedidos/'+pedido.id,null,'loja',404);
 await call('GET','/pedidos/'+pedido.id);
 await call('POST','/pedidos',{...pedidoDados,chave:'teste-sem-estoque-002',itens:[{id_anuncio:anuncio.id,quantidade:100}]},'cliente',409);
 // Fail inside transaction and prove stock/order/notification rollback (real SQL failure).
 const originalGet=pool.getConnection.bind(pool);pool.getConnection=async()=>{const c=await originalGet();const query=c.query.bind(c);c.query=async(sql,...args)=>{if(sql.startsWith('INSERT INTO notificacoes'))throw Error('falha intencional de teste');return query(sql,...args)};const release=c.release.bind(c);c.release=()=>{c.query=query;c.release=release;release();};return c;};
 await call('POST','/pedidos',{...pedidoDados,chave:'teste-rollback-003'},'cliente',500);pool.getConnection=originalGet;
 assert.equal((await call('GET','/anuncios/'+anuncio.id,null,null)).quantidade,8);checks++;
 const [aposFalha]=await pool.query('SELECT COUNT(*) n FROM pedidos_app');assert.equal(aposFalha[0].n,1);checks++;

 const retirada=await call('POST','/anuncios',{...produto,titulo:'Produto somente retirada',disponibilidade:'Retirada'},'loja',201);
 await call('POST','/pedidos',{...pedidoDados,chave:'teste-entrega-indisponivel',itens:[{id_anuncio:retirada.id,quantidade:1}]},'cliente',409);
 const pedidoRetirada=await call('POST','/pedidos',{...pedidoDados,chave:'teste-retirada-sem-frete',recebimento:'retirada',endereco:'',itens:[{id_anuncio:retirada.id,quantidade:1}]},'cliente',201);assert.equal(pedidoRetirada.total,1.08);checks++;
 // Competing stock reservations: only one can consume six of the remaining eight units.
 const concorrentes=await Promise.all(['a','b'].map(chave=>fetch(url+'/pedidos',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer cliente'},body:JSON.stringify({...pedidoDados,chave:'teste-estoque-concorrente-'+chave,itens:[{id_anuncio:anuncio.id,quantidade:6}]})})));
 assert.deepEqual(concorrentes.map(r=>r.status).sort(),[201,409]);assert.equal((await call('GET','/anuncios/'+anuncio.id,null,null)).quantidade,2);checks+=2;
 const obra=await call('POST','/obras',{nome:'Obra Teste',endereco:'Rua Teste',cidade:'São Paulo',etapas:[100,50,0]},'cliente',201);
 let detalhes=await call('GET','/obras/'+obra.id+'?usuario=999'); assert.equal(detalhes.nome,'Obra Teste');
 await call('GET','/obras/'+obra.id,null,'loja',403);
 await call('POST','/obras/'+obra.id+'/profissionais',{id_profissional:users.autonomo.idProfissional,funcao:'Pedreiro'});
 await call('GET','/obras/participando',null,'autonomo');
 await call('GET','/obras/'+obra.id,null,'autonomo');
 const tarefa=await call('POST','/obras/'+obra.id+'/tarefas',{texto:'Descrição longa para próxima ação',etapa:'estrutura'},'cliente',201);
 await call('PATCH','/tarefas/'+tarefa.id,{feito:true});
 detalhes=await call('GET','/obras/'+obra.id);assert.equal(detalhes.etapas.estrutura,100);assert.equal(detalhes.etapas.fundacao,100);checks++;
 await call('PATCH','/tarefas/'+tarefa.id,{feito:false});
 detalhes=await call('GET','/obras/'+obra.id);assert.equal(detalhes.etapas.estrutura,0);checks++;
 assert.equal((await call('GET','/obras'))[0].etapas.estrutura,0);checks++;
 await call('POST','/obras/'+obra.id+'/tarefas',{texto:'Sem etapa'},'cliente',400);
 await call('PATCH','/tarefas/'+tarefa.id,{etapa:'invalida'},'cliente',400);
 await call('PATCH','/tarefas/'+tarefa.id,{etapa:'acabamento',texto:'Título alterado',feito:true});
 detalhes=await call('GET','/obras/'+obra.id);assert.equal(detalhes.etapas.acabamento,100);assert.equal(detalhes.etapas.estrutura,50);checks++;
 await pool.query("INSERT INTO tarefas_obra(id_obra,titulo,status) VALUES (?, 'Legada sem etapa', 'concluida')",[obra.id]);
 detalhes=await call('GET','/obras/'+obra.id);assert.equal(detalhes.etapas.estrutura,50);assert(detalhes.proximasAcoes.some(t=>t.etapa===null));checks++;

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
