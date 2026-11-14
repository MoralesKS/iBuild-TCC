# Validação — 13/11/2026

## Fontes e escopo

Main: `94931e66ac1f7f31f58ab7ff032d893146256141`. Planilha lida pelo acesso conectado: https://docs.google.com/spreadsheets/d/1yZsB_OJFZFOTKzmHRk5w9HyVOouChtNb1RvATM7TYq8/edit, aba **Todos os testes**. Nenhuma célula foi alterada. Os status antigos não foram reaproveitados como prova desta entrega.

Mapeamento revisado: `iBuild/screens`, `src/api.js`, `src/Functions.js`, `Route.js`, `ibuild-api/server.js`, SQL `01`, `02` e histórico de pedidos. O histórico `0828de1` confirmou que o endpoint legado marcava pedidos como pagos. A main atual foi mantida como base.

## Executado

- Instalações `npm ci` de app e API, preservando os lockfiles existentes.
- Auditoria de sintaxe/identificadores/assets em 40 arquivos do app e `node --check` na API; sem erros.
- **117 verificações HTTP/banco** contra Express e MariaDB **real local 10.11.18**, banco isolado: cadastro/autorização, aceite de documentos, CPF NULL, privacidade do perfil, anúncio, avaliações separadas e reavaliação concorrente, média/quantidade, notas/alvos inválidos, bloqueio de autoavaliação, upload/troca de foto e resposta da listagem.
- Pedidos: total enviado pelo cliente ignorado, cupom/frete calculados no servidor, item inválido/repetido, quantidade negativa/fracionária, próprio produto, estoque insuficiente, pedidos concorrentes, replay com mesma chave, conflito de conteúdo, notificações únicas e visibilidade. Falha intencional ao inserir notificação demonstrou rollback de pedido e estoque. Entrega indisponível rejeitada; retirada sem frete validada.
- Tarefas: criação com etapa, marcar/desmarcar, leitura subsequente de detalhes/lista, editar etapa, etapa inválida rejeitada, tarefa histórica NULL não altera progresso; etapa sem tarefas preserva valor histórico. Outro usuário não modifica tarefas/obra.
- SQL novo; SQL anterior exato da main + `02` + `03`; repetição de `03`; seed executado duas vezes com contagens iguais. Avaliações antigas mantidas (mais antiga `historico`, mais nova ativa), tarefa antiga preservada sem etapa e percentual anterior mantido. Diagnóstico e scripts de inativação em ROLLBACK, sem perda de registros.
- **53 verificações de componentes/estado**, com React Test Renderer e serviços nativos/rede/Firebase simulados: sessão e saída, chat, perfil sem edição temporária, favoritos de obra, navegação para edição real, tarefa e atualização de progresso, falha/retry do checkout com mesma chave, bloqueio de toque duplo, limpeza só no sucesso, mapa usando ID real, avatar sem foto/com falha/trocado, logo proporcional em largura de 320 px, cadastro completo de autônomo sem CPF e avaliação enviada pela interface.
- Exportação do bundle Android com Expo/Metro. Isso valida resolução/compilação, **não execução em Android**.

Testes reproduzíveis estão em `tests/`; as fixtures só contêm schema e dados fictícios.

## Relação com a planilha

| Casos | Tratamento nesta rodada |
|---|---|
| CAD-07, CAD-11, CAD-13, CAD-16 | CPF não obrigatório no autônomo; cadastro e aceite cobertos por testes simulados/API; voltar usa pilha. |
| REC-05, REC-07 | Mensagem genérica de recuperação preservada; voltar usa pilha. Entrega real de e-mail depende do Firebase. |
| CAR-03 a CAR-16 | Navegação, dados de checkout, cupom, quantidade e confirmação agora conduzem ao pedido persistente pendente, com testes de falha/retry. |
| GOB-02, GOB-08, GOB-09, GOB-11, GOB-15, GOB-18 | Contadores/lista reais, favorito preservado, edição persistente, média das etapas e recarga ao ganhar foco. |
| GOB-13 e DOB-12 | BottomBar e chat preservados; destino Chat 1 verificado no teste de componente. |
| DOB-05, DOB-08, DOB-09 | Percentuais derivados das tarefas persistidas, marcar/desmarcar/reabrir cobertos. |
| DOB-06, DOB-07 | Bloco obsoleto removido; equipe própria e checklist preservadas, com edição de etapa. |
| DOB-14 a DOB-16 | Estado sem dados/obra ausente e erro/retry; componente sem opcionais e API sem acesso testados. |

## Não executado e roteiro verificável

Não houve credenciais administrativas, acesso SQL ao Railway, login Firebase real, aparelho/emulador ou ensaio visual nativo. A verificação de token Firebase foi substituída **somente nos testes**, nunca no servidor entregue. A injeção de falha na notificação foi feita no teste, com banco real. O MySQL específico do Railway não foi usado: validar a migração numa cópia antes da implantação.

1. Em cópia do Railway, backup + `02` + `03`; confirmar colunas/índices. Usar seed opcional e vincular as contas reais Firebase conforme README.
2. Autônomo sem CPF: cadastrar, sair/entrar e abrir Configurações. Confirmar nome, tipo, profissão, aceite e CPF NULL.
3. Com conta A, avaliar produto e profissional B; sair/reabrir e reavaliar. Conferir uma avaliação por alvo/autor. Com B, tentar autoavaliar e confirmar bloqueio.
4. Na obra do cliente do seed, marcar/desmarcar tarefas e mudar etapa. Reabrir detalhes/lista após reiniciar o app; conferir média. Associar explicitamente uma tarefa antiga sem etapa.
5. Produto → perfil loja → voltar; Mapa → loja → voltar; Produto → Chat → voltar; cadastro/recuperação/edição de obra. Repetir usando botão físico Android.
6. Em tela pequena e teclado aberto, revisar logo e rolagem de todas as modalidades e recuperação; conferir que o teclado não encobre o campo/botão.
7. Comprar com IBUILD10, retirada/entrega; confirmar no banco `pendente_pagamento`, itens, estoque e uma notificação por destinatário. Repetir toque/retry, desligar a rede durante confirmação, reabrir carrinho e consultar a tentativa anterior. Não esperar cobrança/recibo.
8. Profissional com foto e sem foto: ver Contratar; alterar a foto do primeiro em Configurações, voltar e reabrir lista. Confirmar URL HTTPS, avatar padrão se imagem falhar e persistência dos uploads após reinício da API.
9. Banco vazio: Home, Mapa, Obras e Contratar sem exemplos locais. Simular API indisponível e usar Tentar novamente. Chat continua demonstrativo em memória.

Os scripts de limpeza não inferem quais clientes são testes. É necessário revisar IDs e dependências. O seed não cria usuários Firebase. Pedidos pendentes reservam estoque sem expiração/cancelamento automático; conciliação é manual até existir esse fluxo.
