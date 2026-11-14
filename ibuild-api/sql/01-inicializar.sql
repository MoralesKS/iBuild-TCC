-- Instalação NOVA. Cria o esquema exigido pela API, sem dados pessoais.
-- Não atualiza tabelas preexistentes; use 02-migrar-existente.sql nesse caso.
CREATE DATABASE IF NOT EXISTS ibuild CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ibuild;

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

CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id_avaliacao` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_avaliado` BIGINT UNSIGNED NULL,
  `id_anuncio` BIGINT UNSIGNED NULL,
  `id_avaliador` BIGINT UNSIGNED NULL,
  `nota` DECIMAL(3,2) NOT NULL,
  `comentario` TEXT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'ativo',
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `perfil_ativo` BIGINT UNSIGNED GENERATED ALWAYS AS (CASE WHEN status='ativo' THEN id_avaliado ELSE NULL END) STORED,
  `produto_ativo` BIGINT UNSIGNED GENERATED ALWAYS AS (CASE WHEN status='ativo' THEN id_anuncio ELSE NULL END) STORED,
  UNIQUE KEY uq_avaliacao_perfil (id_avaliador,perfil_ativo),
  UNIQUE KEY uq_avaliacao_produto (id_avaliador,produto_ativo),
  CONSTRAINT ck_avaliacao_alvo CHECK ((id_avaliado IS NULL) <> (id_anuncio IS NULL)),
  CONSTRAINT ck_avaliacao_nota CHECK (nota >= 1 AND nota <= 5),
  CONSTRAINT fk_avaliacoes_id_avaliado FOREIGN KEY (`id_avaliado`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT fk_avaliacoes_anuncio FOREIGN KEY (id_anuncio) REFERENCES anuncios(id_anuncio),
  CONSTRAINT fk_avaliacoes_id_avaliador FOREIGN KEY (`id_avaliador`) REFERENCES `usuarios` (`id_usuario`)
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
  `etapa` VARCHAR(20) NULL,
  CONSTRAINT ck_tarefa_etapa CHECK (etapa IS NULL OR etapa IN ('fundacao','estrutura','acabamento')),
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

INSERT IGNORE INTO especialidades (nome) VALUES ('Pedreiro'),('Eletricista'),('Encanador'),('Pintor'),('Carpinteiro'),('Marceneiro'),('Outros');
INSERT IGNORE INTO categorias_materiais (nome) VALUES ('Tijolos e Blocos'),('Cimento'),('Areia'),('Madeira'),('Outros');


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
