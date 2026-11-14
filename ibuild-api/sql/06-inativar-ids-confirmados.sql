-- Não executado automaticamente. Backup + diagnóstico + confirmação humana dos IDs.
-- Arquiva, NÃO apaga: preserva obras, pedidos, equipe, anúncios, fotos e avaliações.
USE ibuild;
CREATE TEMPORARY TABLE ids_confirmados (id_usuario BIGINT UNSIGNED PRIMARY KEY);
-- Insira SOMENTE IDs confirmados pelo responsável, por exemplo:
-- INSERT INTO ids_confirmados VALUES (...), (...);
START TRANSACTION;
SELECT u.id_usuario,u.nome,u.email,u.tipo_perfil,u.status FROM usuarios u JOIN ids_confirmados c USING(id_usuario) FOR UPDATE;
-- Desativação do perfil impede mutações pela API. Anúncios saem do catálogo.
UPDATE anuncios a JOIN ids_confirmados c ON c.id_usuario=a.id_vendedor SET a.status='inativo';
UPDATE usuarios u JOIN ids_confirmados c USING(id_usuario) SET u.status='inativo';
-- Troque ROLLBACK por COMMIT só após revisar IDs e dependências. Vazio não altera nada.
ROLLBACK;
DROP TEMPORARY TABLE ids_confirmados;
-- Corrigir tipo: somente com evidência. Existir profissionais pode indicar autonomo,
-- mas NÃO prova sozinho. Loja exige confirmar razão social/endereço/localização.
-- Após confirmar, em transação: UPDATE usuarios SET tipo_perfil='autonomo' WHERE id_usuario=<ID>;
-- Se não existe profissionais para esse ID, criar o registro e especialidade na mesma transação.
-- Nunca reclassificar clientes em massa nem excluir Firebase.
