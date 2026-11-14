-- Backup obrigatório. Executar após 02, sem --force. Compatível com MySQL 8 / MariaDB.
USE ibuild;
DELIMITER $$
DROP PROCEDURE IF EXISTS ibuild_final$$
CREATE PROCEDURE ibuild_final()
BEGIN
 IF EXISTS (SELECT 1 FROM avaliacoes WHERE nota<1 OR nota>5) THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Notas legadas fora de 1..5: revisar antes da migracao';
 END IF;
 ALTER TABLE usuarios MODIFY cpf VARCHAR(14) NULL;
 ALTER TABLE avaliacoes MODIFY id_avaliado BIGINT UNSIGNED NULL;
 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='avaliacoes' AND column_name='id_anuncio') THEN
  ALTER TABLE avaliacoes ADD id_anuncio BIGINT UNSIGNED NULL,
    ADD CONSTRAINT fk_avaliacoes_anuncio FOREIGN KEY(id_anuncio) REFERENCES anuncios(id_anuncio);
 END IF;
 -- Mantém todas as linhas antigas: apenas a avaliação ativa mais recente por autor/alvo conta.
 UPDATE avaliacoes antiga JOIN avaliacoes nova ON antiga.id_avaliador=nova.id_avaliador
  AND antiga.id_avaliado=nova.id_avaliado AND antiga.id_avaliacao<nova.id_avaliacao
  AND nova.status='ativo' SET antiga.status='historico' WHERE antiga.status='ativo';
 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='avaliacoes' AND column_name='perfil_ativo') THEN
  ALTER TABLE avaliacoes
   ADD perfil_ativo BIGINT UNSIGNED GENERATED ALWAYS AS (CASE WHEN status='ativo' THEN id_avaliado ELSE NULL END) STORED,
   ADD produto_ativo BIGINT UNSIGNED GENERATED ALWAYS AS (CASE WHEN status='ativo' THEN id_anuncio ELSE NULL END) STORED,
   ADD UNIQUE KEY uq_avaliacao_perfil(id_avaliador,perfil_ativo),
   ADD UNIQUE KEY uq_avaliacao_produto(id_avaliador,produto_ativo),
   ADD CONSTRAINT ck_avaliacao_alvo CHECK ((id_avaliado IS NULL) <> (id_anuncio IS NULL)),
   ADD CONSTRAINT ck_avaliacao_nota CHECK (nota >= 1 AND nota <= 5);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='tarefas_obra' AND column_name='etapa') THEN
  ALTER TABLE tarefas_obra ADD etapa VARCHAR(20) NULL,
   ADD CONSTRAINT ck_tarefa_etapa CHECK (etapa IS NULL OR etapa IN ('fundacao','estrutura','acabamento'));
 END IF;
END$$
DELIMITER ;
CALL ibuild_final();
DROP PROCEDURE ibuild_final;

-- Pedidos desta versão: separados do legado que registrava "pago" sem cobrança.
CREATE TABLE IF NOT EXISTS pedidos_app (
 id_pedido BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 id_comprador BIGINT UNSIGNED NOT NULL,
 chave VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 conteudo_hash CHAR(64) NOT NULL,
 endereco VARCHAR(500) NOT NULL,
 metodo VARCHAR(40) NOT NULL,
 cupom VARCHAR(30) NULL,
 subtotal DECIMAL(14,2) NOT NULL,
 frete DECIMAL(14,2) NOT NULL,
 desconto DECIMAL(14,2) NOT NULL,
 total DECIMAL(14,2) NOT NULL,
 status VARCHAR(30) NOT NULL DEFAULT 'pendente_pagamento',
 data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_pedido_tentativa (id_comprador,chave),
 FOREIGN KEY (id_comprador) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS itens_pedido_app (
 id_item BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 id_pedido BIGINT UNSIGNED NOT NULL,
 id_anuncio BIGINT UNSIGNED NOT NULL,
 id_vendedor BIGINT UNSIGNED NOT NULL,
 titulo VARCHAR(150) NOT NULL,
 quantidade DECIMAL(12,2) NOT NULL,
 preco_unitario DECIMAL(12,2) NOT NULL,
 UNIQUE KEY uq_item_pedido (id_pedido,id_anuncio),
 FOREIGN KEY(id_pedido) REFERENCES pedidos_app(id_pedido),
 FOREIGN KEY(id_anuncio) REFERENCES anuncios(id_anuncio),
 FOREIGN KEY(id_vendedor) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS lotes_demo (
 lote VARCHAR(80) NOT NULL,
 entidade VARCHAR(40) NOT NULL,
 chave VARCHAR(80) NOT NULL,
 registro_id BIGINT UNSIGNED NOT NULL,
 PRIMARY KEY(lote,entidade,chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
