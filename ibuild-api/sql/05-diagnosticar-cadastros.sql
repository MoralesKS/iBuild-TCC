-- SOMENTE LEITURA. O tipo sozinho NÃO prova que um usuário é teste.
USE ibuild;
SELECT u.id_usuario,u.nome,u.email,u.tipo_perfil,u.status,u.data_criacao,
 (u.firebase_uid IS NOT NULL) AS vinculado_firebase,
 p.id_profissional,p.profissao,
 (SELECT COUNT(*) FROM enderecos e WHERE e.id_usuario=u.id_usuario AND e.principal=1) enderecos_principais,
 (SELECT COUNT(*) FROM anuncios a WHERE a.id_vendedor=u.id_usuario) anuncios,
 (SELECT COUNT(*) FROM obras o WHERE o.id_proprietario=u.id_usuario) obras_proprias,
 (SELECT COUNT(*) FROM obra_profissionais op WHERE op.id_profissional=p.id_profissional) participacoes,
 (SELECT COUNT(*) FROM pedidos_app pe WHERE pe.id_comprador=u.id_usuario) pedidos_comprador,
 (SELECT COUNT(*) FROM itens_pedido_app i WHERE i.id_vendedor=u.id_usuario) itens_vendedor,
 (SELECT COUNT(*) FROM avaliacoes a WHERE a.id_avaliado=u.id_usuario OR a.id_avaliador=u.id_usuario) avaliacoes,
 (SELECT COUNT(*) FROM notificacoes n WHERE n.id_usuario=u.id_usuario) notificacoes,
 CASE WHEN u.tipo_perfil='pessoa_fisica' AND p.id_profissional IS NOT NULL
 THEN 'Revisar: tem registro profissional; confirmar tipo original' ELSE 'Sem evidencia suficiente de erro' END diagnostico
FROM usuarios u LEFT JOIN profissionais p ON p.id_usuario=u.id_usuario ORDER BY u.data_criacao,u.id_usuario;
-- Dependências inclusive tabelas legadas/não versionadas: inspecionar ANTES de qualquer exclusão.
SELECT TABLE_NAME,COLUMN_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME,CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY REFERENCED_TABLE_NAME,TABLE_NAME;
-- Gera consultas, não executa: inclui pedidos/itens_pedido históricos se existirem.
SELECT CONCAT('SELECT * FROM `',TABLE_NAME,'` WHERE `',COLUMN_NAME,'` IN (/* IDs CONFIRMADOS */);') AS consulta_revisao
FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=DATABASE()
AND REFERENCED_TABLE_NAME IN ('usuarios','profissionais','obras','anuncios');
