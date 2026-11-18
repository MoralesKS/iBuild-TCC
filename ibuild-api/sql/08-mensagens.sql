CREATE TABLE IF NOT EXISTS mensagens_app (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 remetente BIGINT UNSIGNED NOT NULL,
 destinatario BIGINT UNSIGNED NOT NULL,
 texto VARCHAR(2000) NOT NULL,
 criada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 chave VARCHAR(80) NOT NULL,
 UNIQUE KEY envio (remetente,chave),
 KEY conversa (remetente,destinatario,id),
 KEY recebidas (destinatario,id),
 FOREIGN KEY (remetente) REFERENCES usuarios(id_usuario),
 FOREIGN KEY (destinatario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
