-- Opcional. Rodar SOMENTE após schema final e backup. Contas fictícias sem Firebase UID.
-- Reexecutar conserva as edições existentes: cada entidade é identificada no lote.
USE ibuild;
DELIMITER $$
DROP PROCEDURE IF EXISTS ibuild_seed_final$$
CREATE PROCEDURE ibuild_seed_final()
BEGIN
 DECLARE loja1,loja2,cliente,prof1,prof2,p1,p2,produto1,produto2,produto3,obra1,obra2,cat,reg BIGINT UNSIGNED;
 DECLARE v_lote VARCHAR(80) DEFAULT 'ibuild-demo-final-v1';
 DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;
 START TRANSACTION;
 -- Serialização entre duas execuções concorrentes do mesmo lote.
 INSERT IGNORE INTO lotes_demo VALUES (v_lote,'controle','seed',0);
 SELECT registro_id INTO reg FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='controle' AND chave='seed' FOR UPDATE;
 SET loja1=NULL;
 SELECT registro_id INTO loja1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='usuario' AND chave='loja1' LIMIT 1;
 IF loja1 IS NULL THEN
  IF EXISTS(SELECT 1 FROM usuarios WHERE email='loja1@ibuild-demo.example.invalid') THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Email reservado ja existe fora do lote; revisar antes do seed';
  END IF;
  INSERT INTO usuarios(nome,email,tipo_perfil,cidade,bio,foto_perfil) VALUES ('Loja Horizonte Demo','loja1@ibuild-demo.example.invalid','loja','São Paulo','Perfil fictício para demonstração do TCC.',NULL);
  SET loja1=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'usuario','loja1',loja1);
 END IF;
 SET loja2=NULL;
 SELECT registro_id INTO loja2 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='usuario' AND chave='loja2' LIMIT 1;
 IF loja2 IS NULL THEN
  IF EXISTS(SELECT 1 FROM usuarios WHERE email='loja2@ibuild-demo.example.invalid') THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Email reservado ja existe fora do lote; revisar antes do seed';
  END IF;
  INSERT INTO usuarios(nome,email,tipo_perfil,cidade,bio,foto_perfil) VALUES ('Materiais Aurora Demo','loja2@ibuild-demo.example.invalid','loja','São Paulo','Perfil fictício para demonstração do TCC.',NULL);
  SET loja2=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'usuario','loja2',loja2);
 END IF;
 SET cliente=NULL;
 SELECT registro_id INTO cliente FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='usuario' AND chave='cliente' LIMIT 1;
 IF cliente IS NULL THEN
  IF EXISTS(SELECT 1 FROM usuarios WHERE email='cliente@ibuild-demo.example.invalid') THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Email reservado ja existe fora do lote; revisar antes do seed';
  END IF;
  INSERT INTO usuarios(nome,email,tipo_perfil,cidade,bio,foto_perfil) VALUES ('Cliente Demonstração','cliente@ibuild-demo.example.invalid','pessoa_fisica','São Paulo','Perfil fictício para demonstração do TCC.',NULL);
  SET cliente=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'usuario','cliente',cliente);
 END IF;
 SET prof1=NULL;
 SELECT registro_id INTO prof1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='usuario' AND chave='prof1' LIMIT 1;
 IF prof1 IS NULL THEN
  IF EXISTS(SELECT 1 FROM usuarios WHERE email='prof1@ibuild-demo.example.invalid') THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Email reservado ja existe fora do lote; revisar antes do seed';
  END IF;
  INSERT INTO usuarios(nome,email,tipo_perfil,cidade,bio,foto_perfil) VALUES ('Ana Pedreira Demo','prof1@ibuild-demo.example.invalid','autonomo','São Paulo','Perfil fictício para demonstração do TCC.','/demo-assets/avatar.png');
  SET prof1=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'usuario','prof1',prof1);
 END IF;
 SET prof2=NULL;
 SELECT registro_id INTO prof2 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='usuario' AND chave='prof2' LIMIT 1;
 IF prof2 IS NULL THEN
  IF EXISTS(SELECT 1 FROM usuarios WHERE email='prof2@ibuild-demo.example.invalid') THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Email reservado ja existe fora do lote; revisar antes do seed';
  END IF;
  INSERT INTO usuarios(nome,email,tipo_perfil,cidade,bio,foto_perfil) VALUES ('Bruno Eletricista Demo','prof2@ibuild-demo.example.invalid','autonomo','São Paulo','Perfil fictício para demonstração do TCC.',NULL);
  SET prof2=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'usuario','prof2',prof2);
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='endereco' AND chave='loja1') THEN
  INSERT INTO enderecos(id_usuario,nome_endereco,logradouro,numero,cidade,estado,latitude,longitude,principal) VALUES(loja1,'Localização demonstrativa','Praça da Sé','s/n','São Paulo','SP',-23.5505,-46.6333,1);
  INSERT INTO lotes_demo VALUES(v_lote,'endereco','loja1',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='endereco' AND chave='loja2') THEN
  INSERT INTO enderecos(id_usuario,nome_endereco,logradouro,numero,cidade,estado,latitude,longitude,principal) VALUES(loja2,'Localização demonstrativa','Avenida Paulista','s/n','São Paulo','SP',-23.5614,-46.6559,1);
  INSERT INTO lotes_demo VALUES(v_lote,'endereco','loja2',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM profissionais WHERE id_usuario=prof1) THEN
  INSERT INTO profissionais(id_usuario,profissao,descricao,experiencia_anos) VALUES(prof1,'Pedreiro','Profissional fictício',5);
 END IF;
 SELECT id_profissional INTO p1 FROM profissionais WHERE id_usuario=prof1;
 INSERT IGNORE INTO lotes_demo VALUES(v_lote,'profissional','prof1',p1);
 INSERT IGNORE INTO profissional_especialidade SELECT p1,id_especialidade FROM especialidades WHERE nome='Pedreiro';
 IF NOT EXISTS(SELECT 1 FROM profissionais WHERE id_usuario=prof2) THEN
  INSERT INTO profissionais(id_usuario,profissao,descricao,experiencia_anos) VALUES(prof2,'Eletricista','Profissional fictício',5);
 END IF;
 SELECT id_profissional INTO p2 FROM profissionais WHERE id_usuario=prof2;
 INSERT IGNORE INTO lotes_demo VALUES(v_lote,'profissional','prof2',p2);
 INSERT IGNORE INTO profissional_especialidade SELECT p2,id_especialidade FROM especialidades WHERE nome='Eletricista';
 SET produto1=NULL;
 SELECT registro_id INTO produto1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='anuncio' AND chave='produto1' LIMIT 1;
 IF produto1 IS NULL THEN
  SELECT id_categoria INTO cat FROM categorias_materiais WHERE nome='Outros' LIMIT 1;
  INSERT INTO anuncios(id_vendedor,id_categoria,titulo,descricao,quantidade,unidade,preco_unitario,localizacao,disponibilidade) VALUES(loja1,cat,'Cimento — demonstração','Material fictício para testar o pedido pendente.',100,'un',32.9,'São Paulo','entrega');
  SET produto1=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'anuncio','produto1',produto1);
  INSERT INTO fotos_anuncio(id_anuncio,url_foto,principal) VALUES(produto1,'/demo-assets/cimento.jpg',1);
 END IF;
 SET produto2=NULL;
 SELECT registro_id INTO produto2 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='anuncio' AND chave='produto2' LIMIT 1;
 IF produto2 IS NULL THEN
  SELECT id_categoria INTO cat FROM categorias_materiais WHERE nome='Outros' LIMIT 1;
  INSERT INTO anuncios(id_vendedor,id_categoria,titulo,descricao,quantidade,unidade,preco_unitario,localizacao,disponibilidade) VALUES(loja1,cat,'Tijolo — demonstração','Material fictício para testar o pedido pendente.',100,'un',1.5,'São Paulo','entrega');
  SET produto2=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'anuncio','produto2',produto2);
  INSERT INTO fotos_anuncio(id_anuncio,url_foto,principal) VALUES(produto2,'/demo-assets/tijolo.jpg',1);
 END IF;
 SET produto3=NULL;
 SELECT registro_id INTO produto3 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='anuncio' AND chave='produto3' LIMIT 1;
 IF produto3 IS NULL THEN
  SELECT id_categoria INTO cat FROM categorias_materiais WHERE nome='Outros' LIMIT 1;
  INSERT INTO anuncios(id_vendedor,id_categoria,titulo,descricao,quantidade,unidade,preco_unitario,localizacao,disponibilidade) VALUES(loja2,cat,'Tijolos reutilizados — demonstração','Material fictício para testar o pedido pendente.',100,'un',1.2,'São Paulo','entrega');
  SET produto3=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'anuncio','produto3',produto3);
  INSERT INTO fotos_anuncio(id_anuncio,url_foto,principal) VALUES(produto3,'/demo-assets/tijolo.jpg',1);
 END IF;
 SET obra1=NULL;
 SELECT registro_id INTO obra1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='obra' AND chave='obra1' LIMIT 1;
 IF obra1 IS NULL THEN
  INSERT INTO enderecos(id_usuario,nome_endereco,logradouro,cidade) VALUES(cliente,'Obra demo','Endereço fictício','São Paulo');
  SET reg=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'endereco','obra1',reg);
  INSERT INTO obras(id_proprietario,id_endereco,nome,tipo,orcamento_previsto) VALUES(cliente,reg,'Reforma demonstrativa','Reforma',50000);
  SET obra1=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'obra','obra1',obra1);
  INSERT INTO tarefas_obra(id_obra,titulo,etapa,status,progresso) VALUES
   (obra1,'Preparar terreno','fundacao','concluida',100),(obra1,'Concretar base','fundacao','pendente',0),
   (obra1,'Montar pilares','estrutura','pendente',0),(obra1,'Pintar paredes','acabamento','pendente',0);
  INSERT INTO obra_profissionais(id_obra,id_profissional,funcao) VALUES(obra1,p1,'Pedreiro'),(obra1,p2,'Eletricista');
 END IF;
 SET obra2=NULL;
 SELECT registro_id INTO obra2 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='obra' AND chave='obra2' LIMIT 1;
 IF obra2 IS NULL THEN
  INSERT INTO enderecos(id_usuario,nome_endereco,logradouro,cidade) VALUES(cliente,'Obra demo','Endereço fictício','São Paulo');
  SET reg=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'endereco','obra2',reg);
  INSERT INTO obras(id_proprietario,id_endereco,nome,tipo,orcamento_previsto) VALUES(cliente,reg,'Casa demonstrativa','Reforma',50000);
  SET obra2=LAST_INSERT_ID();
  INSERT INTO lotes_demo VALUES(v_lote,'obra','obra2',obra2);
  INSERT INTO tarefas_obra(id_obra,titulo,etapa,status,progresso) VALUES
   (obra2,'Preparar terreno','fundacao','concluida',100),(obra2,'Concretar base','fundacao','pendente',0),
   (obra2,'Montar pilares','estrutura','pendente',0),(obra2,'Pintar paredes','acabamento','pendente',0);
  INSERT INTO obra_profissionais(id_obra,id_profissional,funcao) VALUES(obra2,p1,'Pedreiro'),(obra2,p2,'Eletricista');
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av0') THEN
  INSERT INTO avaliacoes(id_avaliado,id_avaliador,nota,comentario) VALUES(prof1,cliente,5,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av0',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av1') THEN
  INSERT INTO avaliacoes(id_avaliado,id_avaliador,nota,comentario) VALUES(prof2,cliente,4,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av1',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av2') THEN
  INSERT INTO avaliacoes(id_avaliado,id_avaliador,nota,comentario) VALUES(loja1,cliente,4,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av2',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av3') THEN
  INSERT INTO avaliacoes(id_anuncio,id_avaliador,nota,comentario) VALUES(produto1,cliente,5,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av3',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av4') THEN
  INSERT INTO avaliacoes(id_anuncio,id_avaliador,nota,comentario) VALUES(produto1,prof1,4,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av4',LAST_INSERT_ID());
 END IF;
 IF NOT EXISTS(SELECT 1 FROM lotes_demo WHERE lotes_demo.lote=v_lote AND entidade='avaliacao' AND chave='av5') THEN
  INSERT INTO avaliacoes(id_anuncio,id_avaliador,nota,comentario) VALUES(produto2,prof2,4,'Avaliação fictícia de demonstração.');
  INSERT INTO lotes_demo VALUES(v_lote,'avaliacao','av5',LAST_INSERT_ID());
 END IF;
 COMMIT;
END$$
DELIMITER ;
CALL ibuild_seed_final();
DROP PROCEDURE ibuild_seed_final;
SELECT * FROM lotes_demo WHERE lote='ibuild-demo-final-v1' ORDER BY entidade,chave;
