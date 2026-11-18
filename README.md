# IBuild - Gestão e Reuso de Insumos Civis Ltda.

## Descrição do Projeto

O IBuild é um aplicativo que promove o reaproveitamento de sobras da construção civil a preços acessíveis, conecta clientes a mão de obra especializada e reduz os impactos ambientais do setor.

## Instalação

1. Clone este repositório em um Codespace (ou pasta local):
```bash
   git clone "https://github.com/MoralesKS/iBuild-TCC.git"
```
2. Entre na pasta do projeto:
```bash
   cd ibuild
```
3. Instale as dependências:
```bash
   npm install
```
4. Rode o projeto:
```bash
   npx expo start --tunnel
```
5. Instale quaisquer dependências adicionais que forem solicitadas durante a execução.

## Funcionalidades

Para essa primeira entrega, temos as seguintes funcionalidades completas e/ou parciais:

- [x] Tela de Login
- [x] Telas de Cadastro
- [x] Navegação entre telas
- [x] Integração com Google Firebase
- [x] Splash Screen
- [x] Marketplace (Home)
- [x] Mapa funcional
- [x] Tela de Gerenciamento de Projetos
- [x] Tela de Contratação de Funcionários
- [x] Carrinho de compras

## Demonstração

<p align="center">
  <img src="./iBuild/assets/prints-do-app/login.jpeg" width="200" alt="Tela de Login" />
  <img src="./iBuild/assets/prints-do-app/cadastro.jpeg" width="200" alt="Tela de Cadastro" />
  <img src="./iBuild/assets/prints-do-app/home.jpeg" width="200" alt="Tela Home" />
  <img src="./iBuild/assets/prints-do-app/gerenciar.jpeg" width="200" alt="Tela de Gerenciamento" />
</p>

## Tecnologias Utilizadas

- React Native
- Expo
- Google Firebase

## Créditos

Equipe responsável pelo desenvolvimento do IBuild:

|        Nome        |         Função         |
|--------------------|------------------------|
| Arthur R. Araújo   |      Desenvolvedor     |
| Hadan F. Desidério |      Desenvolvedor     |
| Joaquim M. Cunha   |      Desenvolvedor     |
| João M. B. Pagano  |      Desenvolvedor     |
| Kauê S. Morales    |      Desenvolvedor     |
| Nathane de Castro  | Professora Orientadora |

## Atualização do chat e das compras (18/11/2026)

No banco existente, selecione o schema usado pela API. Se o banco já tem as tabelas de pedidos e avaliações da versão anterior, execute apenas `ibuild-api/sql/08-mensagens.sql`. Para uma instalação nova, `01-inicializar.sql` já cria a tabela de mensagens. Depois, publique a pasta `ibuild-api` e gere a build Android a partir de `iBuild`.

Nos anúncios com entrega, inclua o CEP na localização do produto. A tarifa de entrega do iBuild é calculada uma vez por vendedor e CEP de origem: R$ 8,90 quando os primeiros cinco dígitos coincidem, R$ 12,90 para os primeiros três, R$ 19,90 para o primeiro e R$ 29,90 nas demais faixas. A retirada é gratuita. A finalização grava o pedido com pagamento pendente, reserva o estoque e notifica comprador e vendedor. O pagamento é combinado entre as partes.
