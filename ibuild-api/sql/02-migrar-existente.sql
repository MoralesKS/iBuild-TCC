-- Faça backup primeiro. Esquemas legados não versionados exigem revisão dos tipos/chaves.
-- Nunca use --force: interrompa no primeiro erro e compare SHOW CREATE TABLE.
USE ibuild;
DELIMITER $$
DROP PROCEDURE IF EXISTS ibuild_add_column$$
CREATE PROCEDURE ibuild_add_column(IN tabela VARCHAR(64), IN coluna VARCHAR(64), IN definicao TEXT)
BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema=DATABASE() AND table_name=tabela)
 AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name=tabela AND column_name=coluna) THEN
  SET @ddl=CONCAT('ALTER TABLE `',tabela,'` ADD COLUMN `',coluna,'` ',definicao);
  PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
 END IF;
END$$
DELIMITER ;
CALL ibuild_add_column('usuarios', 'firebase_uid', 'VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NULL');
CALL ibuild_add_column('usuarios', 'nome', 'VARCHAR(150) NOT NULL');
CALL ibuild_add_column('usuarios', 'email', 'VARCHAR(254) NOT NULL');
CALL ibuild_add_column('usuarios', 'senha_hash', 'VARCHAR(255) NULL');
CALL ibuild_add_column('usuarios', 'tipo_perfil', 'VARCHAR(30) NOT NULL DEFAULT ''pessoa_fisica''');
CALL ibuild_add_column('usuarios', 'telefone', 'VARCHAR(30) NULL');
CALL ibuild_add_column('usuarios', 'cpf', 'VARCHAR(14) NULL');
CALL ibuild_add_column('usuarios', 'cnpj', 'VARCHAR(18) NULL');
CALL ibuild_add_column('usuarios', 'razao_social', 'VARCHAR(150) NULL');
CALL ibuild_add_column('usuarios', 'data_nascimento', 'DATE NULL');
CALL ibuild_add_column('usuarios', 'cidade', 'VARCHAR(100) NULL');
CALL ibuild_add_column('usuarios', 'bio', 'TEXT NULL');
CALL ibuild_add_column('usuarios', 'foto_perfil', 'VARCHAR(500) NULL');
CALL ibuild_add_column('usuarios', 'foto_loja', 'VARCHAR(500) NULL');
CALL ibuild_add_column('usuarios', 'status', 'VARCHAR(30) NOT NULL DEFAULT ''ativo''');
CALL ibuild_add_column('usuarios', 'versao_documentos', 'VARCHAR(20) NULL');
CALL ibuild_add_column('usuarios', 'aceite_documentos_em', 'TIMESTAMP NULL DEFAULT NULL');
CALL ibuild_add_column('usuarios', 'data_criacao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
CALL ibuild_add_column('especialidades', 'nome', 'VARCHAR(100) NOT NULL');
CALL ibuild_add_column('categorias_materiais', 'nome', 'VARCHAR(100) NOT NULL');
CALL ibuild_add_column('profissionais', 'profissao', 'VARCHAR(100) NULL');
CALL ibuild_add_column('profissionais', 'descricao', 'TEXT NULL');
CALL ibuild_add_column('profissionais', 'experiencia_anos', 'INT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('profissionais', 'media_avaliacoes', 'DECIMAL(3,2) NOT NULL DEFAULT 0');
CALL ibuild_add_column('enderecos', 'nome_endereco', 'VARCHAR(100) NULL');
CALL ibuild_add_column('enderecos', 'logradouro', 'VARCHAR(255) NULL');
CALL ibuild_add_column('enderecos', 'numero', 'VARCHAR(30) NULL');
CALL ibuild_add_column('enderecos', 'bairro', 'VARCHAR(100) NULL');
CALL ibuild_add_column('enderecos', 'cidade', 'VARCHAR(100) NULL');
CALL ibuild_add_column('enderecos', 'estado', 'VARCHAR(2) NULL');
CALL ibuild_add_column('enderecos', 'latitude', 'DECIMAL(10,7) NULL');
CALL ibuild_add_column('enderecos', 'longitude', 'DECIMAL(10,7) NULL');
CALL ibuild_add_column('enderecos', 'principal', 'TINYINT NOT NULL DEFAULT 0');
CALL ibuild_add_column('avaliacoes', 'nota', 'DECIMAL(3,2) NOT NULL');
CALL ibuild_add_column('avaliacoes', 'comentario', 'TEXT NULL');
CALL ibuild_add_column('avaliacoes', 'status', 'VARCHAR(30) NOT NULL DEFAULT ''ativo''');
CALL ibuild_add_column('avaliacoes', 'data_criacao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
CALL ibuild_add_column('anuncios', 'titulo', 'VARCHAR(150) NOT NULL');
CALL ibuild_add_column('anuncios', 'descricao', 'TEXT NULL');
CALL ibuild_add_column('anuncios', 'quantidade', 'DECIMAL(12,2) NOT NULL');
CALL ibuild_add_column('anuncios', 'unidade', 'VARCHAR(30) NULL');
CALL ibuild_add_column('anuncios', 'preco_unitario', 'DECIMAL(12,2) NOT NULL');
CALL ibuild_add_column('anuncios', 'estado_material', 'VARCHAR(30) NOT NULL DEFAULT ''novo''');
CALL ibuild_add_column('anuncios', 'classe_material', 'VARCHAR(10) NOT NULL DEFAULT ''A''');
CALL ibuild_add_column('anuncios', 'disponibilidade', 'VARCHAR(30) NOT NULL DEFAULT ''retirada''');
CALL ibuild_add_column('anuncios', 'status_curadoria', 'VARCHAR(30) NOT NULL DEFAULT ''aprovado''');
CALL ibuild_add_column('anuncios', 'status', 'VARCHAR(30) NOT NULL DEFAULT ''ativo''');
CALL ibuild_add_column('anuncios', 'localizacao', 'VARCHAR(255) NULL');
CALL ibuild_add_column('anuncios', 'contato', 'VARCHAR(30) NULL');
CALL ibuild_add_column('anuncios', 'data_publicacao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
CALL ibuild_add_column('fotos_anuncio', 'url_foto', 'VARCHAR(500) NOT NULL');
CALL ibuild_add_column('fotos_anuncio', 'ordem', 'INT NOT NULL DEFAULT 1');
CALL ibuild_add_column('fotos_anuncio', 'principal', 'TINYINT NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'nome', 'VARCHAR(150) NOT NULL');
CALL ibuild_add_column('obras', 'tipo', 'VARCHAR(60) NULL');
CALL ibuild_add_column('obras', 'responsavel_tecnico', 'VARCHAR(120) NULL');
CALL ibuild_add_column('obras', 'mestre_obras', 'VARCHAR(120) NULL');
CALL ibuild_add_column('obras', 'horas_trabalhadas', 'INT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'orcamento_previsto', 'DECIMAL(14,2) NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'data_previsao_fim', 'DATE NULL');
CALL ibuild_add_column('obras', 'status', 'VARCHAR(30) NOT NULL DEFAULT ''em_andamento''');
CALL ibuild_add_column('obras', 'etapa_fundacao', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'etapa_estrutura', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'etapa_acabamento', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('obras', 'data_criacao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
CALL ibuild_add_column('tarefas_obra', 'titulo', 'VARCHAR(255) NOT NULL');
CALL ibuild_add_column('tarefas_obra', 'status', 'VARCHAR(30) NOT NULL DEFAULT ''pendente''');
CALL ibuild_add_column('tarefas_obra', 'progresso', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
CALL ibuild_add_column('obra_profissionais', 'funcao', 'VARCHAR(80) NULL');
CALL ibuild_add_column('obra_profissionais', 'data_atribuicao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
CALL ibuild_add_column('notificacoes', 'tipo', 'VARCHAR(30) NOT NULL DEFAULT ''sistema''');
CALL ibuild_add_column('notificacoes', 'titulo', 'VARCHAR(150) NOT NULL');
CALL ibuild_add_column('notificacoes', 'mensagem', 'VARCHAR(255) NULL');
CALL ibuild_add_column('notificacoes', 'lida', 'TINYINT NOT NULL DEFAULT 0');
CALL ibuild_add_column('notificacoes', 'data_criacao', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
DROP PROCEDURE ibuild_add_column;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firebase_uid` VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `senha_hash` VARCHAR(255) NULL,
  `tipo_perfil` VARCHAR(30) NOT NULL DEFAULT 'pessoa_fisica',
  `telefone` VARCHAR(30) NULL,
  `cpf` VARCHAR(14) NULL,
  `cnpj` VARCHAR(18) NULL,
  `razao_social` VARCHAR(150) NULL,
  `data_nascimento` DATE NULL,
  `cidade` VARCHAR(100) NULL,
  `bio` TEXT NULL,
  `foto_perfil` VARCHAR(500) NULL,
  `foto_loja` VARCHAR(500) NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'ativo',
  `versao_documentos` VARCHAR(20) NULL,
  `aceite_documentos_em` TIMESTAMP NULL DEFAULT NULL,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuarios_firebase (firebase_uid),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `especialidades` (
  `id_especialidade` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_especialidade_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categorias_materiais` (
  `id_categoria` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_categoria_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `profissionais` (
  `id_profissional` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` BIGINT UNSIGNED NOT NULL,
  `profissao` VARCHAR(100) NULL,
  `descricao` TEXT NULL,
  `experiencia_anos` INT UNSIGNED NOT NULL DEFAULT 0,
  `media_avaliacoes` DECIMAL(3,2) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_prof_usuario (id_usuario),
  CONSTRAINT fk_profissionais_id_usuario FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `profissional_especialidade` (
  `id_profissional` BIGINT UNSIGNED NOT NULL,
  `id_especialidade` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_profissional,id_especialidade),
  CONSTRAINT fk_profissional_especialidade_id_profissional FOREIGN KEY (`id_profissional`) REFERENCES `profissionais` (`id_profissional`),
  CONSTRAINT fk_profissional_especialidade_id_especialidade FOREIGN KEY (`id_especialidade`) REFERENCES `especialidades` (`id_especialidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enderecos` (
  `id_endereco` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` BIGINT UNSIGNED NOT NULL,
  `nome_endereco` VARCHAR(100) NULL,
  `logradouro` VARCHAR(255) NULL,
  `numero` VARCHAR(30) NULL,
  `bairro` VARCHAR(100) NULL,
  `cidade` VARCHAR(100) NULL,
  `estado` VARCHAR(2) NULL,
  `latitude` DECIMAL(10,7) NULL,
  `longitude` DECIMAL(10,7) NULL,
  `principal` TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_enderecos_id_usuario FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id_avaliacao` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_avaliado` BIGINT UNSIGNED NOT NULL,
  `id_avaliador` BIGINT UNSIGNED NULL,
  `nota` DECIMAL(3,2) NOT NULL,
  `comentario` TEXT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'ativo',
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_avaliacoes_id_avaliado FOREIGN KEY (`id_avaliado`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT fk_avaliacoes_id_avaliador FOREIGN KEY (`id_avaliador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `anuncios` (
  `id_anuncio` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_vendedor` BIGINT UNSIGNED NOT NULL,
  `id_categoria` BIGINT UNSIGNED NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `descricao` TEXT NULL,
  `quantidade` DECIMAL(12,2) NOT NULL,
  `unidade` VARCHAR(30) NULL,
  `preco_unitario` DECIMAL(12,2) NOT NULL,
  `estado_material` VARCHAR(30) NOT NULL DEFAULT 'novo',
  `classe_material` VARCHAR(10) NOT NULL DEFAULT 'A',
  `disponibilidade` VARCHAR(30) NOT NULL DEFAULT 'retirada',
  `status_curadoria` VARCHAR(30) NOT NULL DEFAULT 'aprovado',
  `status` VARCHAR(30) NOT NULL DEFAULT 'ativo',
  `localizacao` VARCHAR(255) NULL,
  `contato` VARCHAR(30) NULL,
  `data_publicacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_anuncios_id_vendedor FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT fk_anuncios_id_categoria FOREIGN KEY (`id_categoria`) REFERENCES `categorias_materiais` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fotos_anuncio` (
  `id_foto` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_anuncio` BIGINT UNSIGNED NOT NULL,
  `url_foto` VARCHAR(500) NOT NULL,
  `ordem` INT NOT NULL DEFAULT 1,
  `principal` TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_fotos_anuncio_id_anuncio FOREIGN KEY (`id_anuncio`) REFERENCES `anuncios` (`id_anuncio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `obras` (
  `id_obra` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_proprietario` BIGINT UNSIGNED NOT NULL,
  `id_endereco` BIGINT UNSIGNED NULL,
  `nome` VARCHAR(150) NOT NULL,
  `tipo` VARCHAR(60) NULL,
  `responsavel_tecnico` VARCHAR(120) NULL,
  `mestre_obras` VARCHAR(120) NULL,
  `horas_trabalhadas` INT UNSIGNED NOT NULL DEFAULT 0,
  `orcamento_previsto` DECIMAL(14,2) NOT NULL DEFAULT 0,
  `data_previsao_fim` DATE NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'em_andamento',
  `etapa_fundacao` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `etapa_estrutura` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `etapa_acabamento` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_obras_id_proprietario FOREIGN KEY (`id_proprietario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT fk_obras_id_endereco FOREIGN KEY (`id_endereco`) REFERENCES `enderecos` (`id_endereco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tarefas_obra` (
  `id_tarefa` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_obra` BIGINT UNSIGNED NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'pendente',
  `progresso` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_tarefas_obra_id_obra FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `obra_profissionais` (
  `id_obra` BIGINT UNSIGNED NOT NULL,
  `id_profissional` BIGINT UNSIGNED NOT NULL,
  `funcao` VARCHAR(80) NULL,
  `data_atribuicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_obra,id_profissional),
  CONSTRAINT fk_obra_profissionais_id_obra FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`),
  CONSTRAINT fk_obra_profissionais_id_profissional FOREIGN KEY (`id_profissional`) REFERENCES `profissionais` (`id_profissional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notificacoes` (
  `id_notificacao` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` BIGINT UNSIGNED NOT NULL,
  `tipo` VARCHAR(30) NOT NULL DEFAULT 'sistema',
  `titulo` VARCHAR(150) NOT NULL,
  `mensagem` VARCHAR(255) NULL,
  `lida` TINYINT NOT NULL DEFAULT 0,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notificacoes_id_usuario FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Binary UID comparison prevents case-insensitive account collisions.
ALTER TABLE usuarios MODIFY firebase_uid VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NULL,
 MODIFY senha_hash VARCHAR(255) NULL;
ALTER TABLE anuncios MODIFY status VARCHAR(30) NOT NULL DEFAULT 'ativo';
ALTER TABLE anuncios ALTER COLUMN classe_material SET DEFAULT 'A';
ALTER TABLE anuncios ALTER COLUMN status_curadoria SET DEFAULT 'aprovado';
DELIMITER $$
DROP PROCEDURE IF EXISTS ibuild_unique_uid$$
CREATE PROCEDURE ibuild_unique_uid()
BEGIN
 IF NOT EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name='usuarios' AND column_name='firebase_uid' AND non_unique=0) THEN
  ALTER TABLE usuarios ADD UNIQUE KEY uq_usuarios_firebase (firebase_uid);
 END IF;
END$$
DELIMITER ;
CALL ibuild_unique_uid();
DROP PROCEDURE ibuild_unique_uid;
INSERT IGNORE INTO especialidades (nome) VALUES ('Pedreiro'),('Eletricista'),('Encanador'),('Pintor'),('Carpinteiro'),('Marceneiro'),('Outros');
INSERT IGNORE INTO categorias_materiais (nome) VALUES ('Tijolos e Blocos'),('Cimento'),('Areia'),('Madeira'),('Outros');
