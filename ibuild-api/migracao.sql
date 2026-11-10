-- ============================================================
-- MIGRAÇÃO DO BANCO iBuild  (rode UMA vez no MySQL Workbench)
-- ============================================================
USE ibuild;

-- 1) USUÁRIOS: perfil (pessoa física / autônomo / loja) + dados extras.
--    O login continua no Firebase; o BD guarda o perfil e se liga pelo firebase_uid.
ALTER TABLE usuarios
  MODIFY senha_hash VARCHAR(255) NULL,
  ADD COLUMN firebase_uid VARCHAR(128) NULL UNIQUE AFTER id_usuario,
  ADD COLUMN tipo_perfil ENUM('pessoa_fisica','autonomo','loja') NOT NULL DEFAULT 'pessoa_fisica',
  ADD COLUMN cpf VARCHAR(14) NULL,
  ADD COLUMN cnpj VARCHAR(18) NULL,
  ADD COLUMN razao_social VARCHAR(150) NULL,
  ADD COLUMN data_nascimento DATE NULL,
  ADD COLUMN cidade VARCHAR(100) NULL,
  ADD COLUMN bio TEXT NULL;

-- 2) PROFISSIONAIS: profissão digitada no cadastro do autônomo
ALTER TABLE profissionais
  ADD COLUMN profissao VARCHAR(100) NULL;

-- 3) ANÚNCIOS: campos que a tela Anunciar usa
ALTER TABLE anuncios
  ADD COLUMN disponibilidade ENUM('retirada','entrega') NOT NULL DEFAULT 'retirada';
ALTER TABLE anuncios ALTER COLUMN classe_material SET DEFAULT 'A';
ALTER TABLE anuncios ALTER COLUMN status_curadoria SET DEFAULT 'aprovado';  -- sem curadoria por enquanto

-- 4) OBRAS: campos que Gerenciar / Detalhes da obra mostram
ALTER TABLE obras
  ADD COLUMN tipo VARCHAR(60) NULL,
  ADD COLUMN responsavel_tecnico VARCHAR(120) NULL,
  ADD COLUMN mestre_obras VARCHAR(120) NULL,
  ADD COLUMN horas_trabalhadas INT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN etapa_fundacao TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN etapa_estrutura TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN etapa_acabamento TINYINT UNSIGNED NOT NULL DEFAULT 0;

-- 5) NOVA TABELA: autônomos adicionados às obras
CREATE TABLE obra_profissionais (
  id_obra bigint unsigned NOT NULL,
  id_profissional bigint unsigned NOT NULL,
  funcao varchar(80) DEFAULT NULL,
  data_atribuicao datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_obra, id_profissional),
  KEY idx_op_profissional (id_profissional),
  CONSTRAINT fk_op_obra FOREIGN KEY (id_obra) REFERENCES obras (id_obra) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_op_profissional FOREIGN KEY (id_profissional) REFERENCES profissionais (id_profissional) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) NOVA TABELA: notificações
CREATE TABLE notificacoes (
  id_notificacao bigint unsigned NOT NULL AUTO_INCREMENT,
  id_usuario bigint unsigned NOT NULL,
  tipo ENUM('compra','recibo','obra','sistema') NOT NULL DEFAULT 'sistema',
  titulo varchar(150) NOT NULL,
  mensagem varchar(255) DEFAULT NULL,
  lida tinyint(1) NOT NULL DEFAULT 0,
  data_criacao datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacao),
  KEY idx_notif_usuario (id_usuario, data_criacao),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
