USE ibuild;

ALTER TABLE usuarios
  ADD COLUMN versao_documentos VARCHAR(20) NULL,
  ADD COLUMN aceite_documentos_em TIMESTAMP NULL DEFAULT NULL;
