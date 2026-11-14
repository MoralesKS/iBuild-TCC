// ONLY a disposable database named ibuild_test_*; never points at production ibuild.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const mysql=require('../ibuild-api/node_modules/mysql2/promise');
const db=process.env.DB_NAME;
if(!/^ibuild_test_[a-z0-9_]+$/.test(db||'')) throw Error('DB_NAME must be a disposable ibuild_test_* database. This test DROPS it.');
let c;
async function script(file) {
 let source=fs.readFileSync(file,'utf8').replace(/CREATE DATABASE IF NOT EXISTS ibuild\b/g,`CREATE DATABASE IF NOT EXISTS ${db}`).replace(/USE ibuild;/g,`USE ${db};`);
 let delimiter=';',pending='';
 for(const line of source.split('\n')) {
  if(/^DELIMITER /.test(line)){delimiter=line.slice(10).trim();continue;}
  if(line.trim().startsWith('--')||!line.trim())continue;
  pending+=line+'\n';
  if(pending.trimEnd().endsWith(delimiter)){
   const sql=pending.trimEnd().slice(0,-delimiter.length);pending='';
   await c.query(sql);
  }
 }
 if(pending.trim())throw Error('Unterminated SQL in '+file);
}
async function counts() {
 const out={};for(const t of ['usuarios','profissionais','anuncios','enderecos','obras','tarefas_obra','avaliacoes','lotes_demo']){const [rows]=await c.query(`SELECT COUNT(*) n FROM ${t}`);out[t]=rows[0].n;}return out;
}
(async()=>{
 c=await mysql.createConnection({host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD||'',decimalNumbers:true});
 const sql=path.resolve(__dirname,'../ibuild-api/sql');
 await c.query(`DROP DATABASE IF EXISTS ${db}`);
 await script(sql+'/01-inicializar.sql');
 await script(sql+'/03-correcoes-finais.sql');
 await script(sql+'/04-seed-demonstracao.sql');const first=await counts();await script(sql+'/04-seed-demonstracao.sql');assert.deepEqual(await counts(),first);
 assert.equal(first.usuarios,5);assert.equal(first.anuncios,3);assert.equal(first.obras,2);assert.equal(first.tarefas_obra,8);assert.equal(first.avaliacoes,6);
 const [p]=await c.query("SELECT foto_perfil,firebase_uid,cpf FROM usuarios WHERE tipo_perfil='autonomo'");assert.equal(p.length,2);assert(p.some(x=>x.foto_perfil));assert(p.some(x=>x.foto_perfil===null));assert(p.every(x=>x.firebase_uid===null&&x.cpf===null));
 await script(sql+'/05-diagnosticar-cadastros.sql');await script(sql+'/06-inativar-ids-confirmados.sql');await script(sql+'/07-retirar-lote-demo.sql');assert.deepEqual(await counts(),first);
 const [active]=await c.query("SELECT COUNT(*) n FROM usuarios WHERE status='ativo'");assert.equal(active[0].n,5);
 await c.query(`DROP DATABASE ${db}`);await script(__dirname+'/fixtures/schema-base.sql');
 await c.query("INSERT INTO usuarios(nome,email) VALUES ('Antigo A','a@example.invalid'),('Antigo B','b@example.invalid')");
 await c.query('INSERT INTO avaliacoes(id_avaliado,id_avaliador,nota) VALUES (1,2,3),(1,2,5)');
 await c.query("INSERT INTO obras(id_proprietario,nome,etapa_estrutura) VALUES (1,'Legada',50)");
 await c.query("INSERT INTO tarefas_obra(id_obra,titulo,status) VALUES (1,'Tarefa antiga','concluida')");
 await script(sql+'/02-migrar-existente.sql');await script(sql+'/03-correcoes-finais.sql');await script(sql+'/03-correcoes-finais.sql');
 const [a]=await c.query('SELECT nota,status FROM avaliacoes ORDER BY id_avaliacao');assert.deepEqual(a,[{nota:3,status:'historico'},{nota:5,status:'ativo'}]);
 const [t]=await c.query('SELECT etapa FROM tarefas_obra');assert.equal(t[0].etapa,null);
 const [o]=await c.query('SELECT etapa_estrutura FROM obras');assert.equal(o[0].etapa_estrutura,50);
 await script(sql+'/04-seed-demonstracao.sql');
 console.log('PASS: new and base schema, repeat migration, repeat seed, legacy preservation, two professional photo cases and cleanup dry runs.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(c)await c.end();});
