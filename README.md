# iBuild — correções finais

Base: **main `94931e66ac1f7f31f58ab7ff032d893146256141`**, obtida de https://github.com/MoralesKS/iBuild-TCC em 13/11/2026. Nenhum merge, push, deploy ou alteração no Railway/Firebase foi feito. O ZIP pode ser revisado e publicado na main. Código Expo preservado na versão da main (SDK 58); não houve downgrade para o SDK 54 citado no AGENTS.md.

## Alterações

| Item | Entrega e decisão |
|---|---|
| 1 | Avaliação de 1–5, comentário opcional, média/quantidade e reavaliação. Produto usa `id_anuncio`; pessoa/loja/vendedor usa `id_avaliado`. Autoria vem do token; autoavaliação bloqueada; índice único evita duplicação concorrente. Avaliações antigas duplicadas ficam como `historico`, sem apagar linhas. |
| 2 | Avisos de demonstração removidos de Obras; botão “Nova obra”. Carrinho explica pedido pendente, sem cobrança, e a tarifa simulada. |
| 3 | Tarefa tem etapa explícita e seletor na criação/edição. Com tarefas: concluídas/total; sem tarefas: conserva percentual histórico (zero em obra nova). Tarefas antigas sem etapa não alteram percentuais até o dono vinculá-las. API calcula sempre a partir das tarefas persistidas; geral é a média das três etapas, arredondada. |
| 4 | Removidos “Próxima Ação” e lista avulsa de autônomos. Equipe e associação continuam em Atribuir funcionários. Campos históricos mantidos. |
| 5 | Voltar usa a pilha e fallback apenas sem anterior. Produto → perfil → voltar preserva o produto; Mapa → perfil → voltar preserva o mapa. |
| 6 | Removidos botão, modal e sobreposição temporária de perfil. Configurações, leitura e Sair preservados. |
| 7 | Logo existente em componente proporcional com `contain`, largura limitada pela tela e formulários roláveis; recuperação de senha com ajuste ao teclado. |
| 8 | Pedido persistente, cálculo no servidor, reserva de estoque, notificações comprador/vendedores, transação e chave de repetição. Sempre `pendente_pagamento`; não gera recibo de pagamento. |
| 9 | Removidos arrays de produtos/lojas/obras/profissionais fictícios e seus fallbacks. Listas reais com vazio/erro/retry; chat em memória preservado. Editar/excluir obra usa API, sem sobreposição temporária. Favoritos por obra e produto preservados. |
| 10 | Mapa abre perfil pelo `idUsuario` real, separado da chave visual `db-…`. |
| 11 | CPF opcional no autônomo, ausência enviada como NULL. Banco permite NULL; Configurações não exige CPF. Pessoa Física/Empresa mantêm seu comportamento. |
| 12 | Diagnóstico, inativação por IDs explícitos e seed separado e reaplicável. Nenhuma limpeza online executada. |
| 13 | `/profissionais` retorna foto; conversor monta URL pública; lista atualiza ao ganhar foco; avatar padrão cobre ausência/falha. Upload gera URL nova, evitando foto antiga em cache. |

## Banco: ordem de execução

Faça backup externo do schema/dados e do volume de uploads, e teste a restauração. **Nunca use `--force`**. SQL usa `USE ibuild`; se seu nome for diferente, ajuste antes. Use cliente MySQL que suporte `DELIMITER` e mantenha cada script na mesma conexão. A migração requer MySQL 8 ou MariaDB compatível; foi executada localmente em MariaDB 10.11.18, não no MySQL remoto.

- **Banco novo vazio:** `ibuild-api/sql/01-inicializar.sql`. Opcionalmente, `04-seed-demonstracao.sql`. O inicializador não insere usuários/exemplos; apenas categorias e especialidades legítimas.
- **Railway existente:** coloque a API em manutenção, faça backup; execute `02-migrar-existente.sql` e depois `03-correcoes-finais.sql`; publique a API nova e o app em conjunto. Opcionalmente aplique `04-seed-demonstracao.sql`. Não execute o inicializador sobre banco legado para substituir uma migração.
- `03` e `04` são reaplicáveis. `03` preserva tarefas antigas sem inferir etapa por texto. Notas legadas fora de 1–5 interrompem a migração para revisão. DDL faz commits implícitos: em falha, revise o ponto e restaure o backup se necessário.
- O legado consultado usava `pedidos`/`itens_pedido` e gravava “pago” sem cobrança. Esses registros não foram reinterpretados nem apagados. Novos pedidos usam **`pedidos_app` e `itens_pedido_app`**, com schema conhecido e chave de idempotência. `GET /pedidos/:id` só expõe o pedido ao comprador; vendedor recebe aviso apenas dos próprios itens, sem dados privados do comprador.

## Cadastros antigos e demonstração

1. Execute `05-diagnosticar-cadastros.sql`: mostra tipos, evidência de registro profissional e dependências de obras, equipe, anúncios, pedidos, avaliações, endereços e notificações. Também lista FKs e gera consultas para tabelas históricas. Identificar o lote exige **IDs confirmados**, período/e-mails de teste ou evidência externa do tipo original; o GitHub não contém essa identificação confiável.
2. `06-inativar-ids-confirmados.sql` começa com uma tabela de IDs vazia e termina em **ROLLBACK**. Preencha só IDs revisados; confira resultado/dependências; troque por COMMIT se realmente desejar arquivar. Inativa usuário e anúncios, preservando o histórico. Não apaga Firebase. Exclusão física não é automatizada: pedidos/itens, avaliações, obras/tarefas/equipe, endereços, fotos e eventuais FKs legadas precisam de revisão prévia.
3. Corrigir tipo é preferível quando houver evidência confiável: `profissionais` pode indicar autônomo, mas não é prova definitiva; confira profissão e especialidade. Loja requer dados empresariais/endereço confirmados. Não converter todos os clientes em massa.
4. Seed `04`: lote **`ibuild-demo-final-v1`** em `lotes_demo`, com 2 lojas localizadas, 2 autônomos (um com imagem demonstrativa, outro sem foto), 1 cliente, 3 produtos, 2 obras, 8 tarefas e 6 avaliações. Usa e-mails reservados `example.invalid`, sem senha e sem UID inventado. Reexecução não duplica nem sobrescreve edições/estoque. Produtos/fotos vêm pela API, com imagens genéricas em `demo-assets`.
5. Para testar login: crie uma conta real no **Firebase Console**, copie o UID real e vincule-o ao usuário do lote escolhido **antes do primeiro login no app**; em transação, revise ID/e-mail e atualize `firebase_uid` e `email` (e-mail real dessa conta), respeitando as unicidades. Inserção MySQL não cria conta Firebase. Não salve UID de teste administrativo, senhas ou credenciais no Git. Se já fez cadastro pelo app, haverá outro perfil: revise dependências antes de vincular, sem apagar automaticamente.
6. `07-retirar-lote-demo.sql` localiza e inativa o lote; também termina em ROLLBACK para revisão. Preserva compras feitas durante os testes. Reaplicar seed não reativa contas arquivadas.

## Configuração e execução

Node >= 22.13. Copie os `.env.example` para `.env` **localmente**. Não publique `.env`.

- App: preencha as variáveis públicas Firebase a partir da configuração do seu projeto. `EXPO_PUBLIC_API_URL=https://ibuild-tcc-production.up.railway.app` (HTTPS completo, sem IP local). `GOOGLE_MAPS_API_KEY` é usada no build Android, com restrições adequadas ao app.
- API: Railway fornece `PORT`; configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=ibuild`, `FIREBASE_PROJECT_ID`. Use o host privado do MySQL para a API no mesmo projeto; acesso administrativo externo usa o endpoint público fornecido pelo Railway.
- Configure **volume persistente** em `UPLOAD_DIR`, por exemplo `/data/uploads`. Em desenvolvimento local, omita essa variável para usar `ibuild-api/uploads`. Preserve/migre os uploads existentes no servidor para esse volume antes do deploy. O ZIP mantém os assets e uploads já versionados no GitHub, além das imagens genéricas do seed; não contém dumps de dados pessoais.

```bash
cd ibuild-api
npm ci
npm start
# Em outro terminal, a partir da raiz:
cd iBuild
npm ci
npx expo start --tunnel
```

O túnel serve o bundle do Expo; a API continua na URL HTTPS. Para APK, use o perfil `preview` do `eas.json` com uma conta autorizada no projeto Expo existente; nenhum projeto/owner EAS foi trocado.

**Checkout:** IBUILD10 desconta 10% do subtotal em centavos; entrega cobra tarifa simulada fixa de R$ 12,90 por pedido, somente para anúncios que oferecem entrega; retirada tem frete zero. Preço, disponibilidade e estoque são validados no banco. Estoque é reservado imediatamente. Sem integração de pagamento, cancelamento ou expiração automática nesta rodada: reservas pendentes precisam de conciliação administrativa; nunca marque como pago sem cobrança real. A tentativa é guardada no dispositivo antes do envio e repetida com a mesma chave após timeout/reabertura. Carrinho só remove os itens confirmados depois da resposta de sucesso.

## Validação

Veja **`VALIDACAO.md`** para resultados, relação com a planilha e roteiro de aparelho. Execute `npm test` na raiz após instalar as dependências do app. `npm run test:api` exige banco descartável vazio com schema novo e variáveis DB; usa verificação Firebase simulada. `npm run test:sql` exige `DB_NAME=ibuild_test_<nome>` e **apaga/recria apenas esse banco de teste**. Não aponte testes para Railway/produção.

Nenhuma validação local substitui login Firebase real, teste de upload no volume Railway, mapa nativo, teclado e botão físico Android. Essas pendências estão explicitadas no relatório.
