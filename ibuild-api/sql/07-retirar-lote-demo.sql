-- Retira o lote das listas públicas sem perder histórico de pedidos feitos durante testes.
-- Backup e revisão obrigatórios. Não remove contas Firebase, não reativa estoque reservado.
USE ibuild;
SET @lote='ibuild-demo-final-v1';
SELECT * FROM lotes_demo WHERE lote=@lote ORDER BY entidade,chave;
START TRANSACTION;
UPDATE anuncios a JOIN lotes_demo l ON l.registro_id=a.id_anuncio AND l.entidade='anuncio'
 SET a.status='inativo' WHERE l.lote=@lote;
UPDATE usuarios u JOIN lotes_demo l ON l.registro_id=u.id_usuario AND l.entidade='usuario'
 SET u.status='inativo' WHERE l.lote=@lote;
-- substituir por COMMIT após revisão
ROLLBACK;
