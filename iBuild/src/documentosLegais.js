// Atualize também a versão aceita pela API quando o texto dos documentos mudar.
export const VERSAO_DOCUMENTOS = '1';
const emailPrivacidade = process.env.EXPO_PUBLIC_PRIVACY_EMAIL?.trim();

export const documentosLegais = {
  termos: {
    titulo: 'Termos de Serviço',
    secoes: [
      {
        titulo: 'O que é o iBuild',
        texto: 'O iBuild é um projeto acadêmico que aproxima compradores, vendedores e profissionais da construção civil. O aplicativo permite anunciar e encontrar sobras de materiais, consultar perfis profissionais e organizar obras.',
      },
      {
        titulo: 'Sua conta',
        texto: 'Use informações verdadeiras e atualizadas no cadastro. Mantenha suas credenciais em sigilo e use a recuperação de senha se perder o acesso. Ao concluir o cadastro, você aceita estes Termos de Serviço.',
      },
      {
        titulo: 'Anúncios e serviços',
        texto: 'Descreva com clareza as condições, a quantidade e o preço dos materiais. Publique apenas materiais que você possa vender legalmente e que sejam adequados ao reaproveitamento. Combine com a outra parte as condições de retirada, entrega ou execução do serviço. O iBuild fornece o espaço de encontro e organização. A execução dos serviços, a inspeção dos materiais e o transporte cabem às partes envolvidas.',
      },
      {
        titulo: 'Uso responsável',
        texto: 'Respeite os demais usuários e seus dados. A equipe pode remover anúncios ou outros conteúdos que violem a lei, a segurança das pessoas ou estes termos. Seus direitos previstos em lei continuam aplicáveis.',
      },
      {
        titulo: 'Atualizações',
        texto: 'A versão em vigor fica disponível no aplicativo. Alterações relevantes serão comunicadas aos usuários.',
      },
    ],
  },
  privacidade: {
    titulo: 'Política de Privacidade',
    secoes: [
      {
        titulo: 'Quem responde pelos dados',
        texto: 'A equipe responsável pelo projeto acadêmico iBuild responde pelo tratamento dos dados nesta versão do aplicativo.',
      },
      {
        titulo: 'Quais dados usamos',
        texto: 'O cadastro usa nome, e-mail, telefone e os dados exigidos pelo tipo de conta. Isso pode incluir CPF e data de nascimento, profissão ou razão social, CNPJ e endereço comercial. O aplicativo também trata as informações de anúncios, pedidos, obras e avaliações que você utiliza. No cadastro de loja, o aplicativo pode pedir permissão para usar a localização do aparelho ao posicionar a loja no mapa.',
      },
      {
        titulo: 'Para que usamos os dados',
        texto: 'Usamos os dados necessários para abrir e autenticar sua conta, exibir seu perfil e operar os recursos que você utiliza. O tratamento necessário para prestar esses serviços decorre da relação de uso do aplicativo. Também podemos tratar dados para cumprir obrigações legais. Quando uma finalidade exigir consentimento, ele será solicitado especificamente para ela.',
      },
      {
        titulo: 'Provedores e informações visíveis',
        texto: 'O Firebase Authentication, serviço do Google, processa nos Estados Unidos os dados necessários ao login e à recuperação de senha. Os dados cadastrais do perfil ficam no banco de dados do iBuild. Outros usuários podem ver as informações de anúncios, o perfil profissional ou comercial e a localização das lojas no mapa. CPF, data de nascimento e dados privados de contato ficam fora do perfil público.',
      },
      {
        titulo: 'Por quanto tempo usamos os dados',
        texto: 'Conservamos os dados pelo período necessário para prestar os serviços e, quando aplicável, pelo prazo exigido para cumprir obrigações legais ou exercer direitos. Registramos a data e a versão dos documentos aceitos no cadastro.',
      },
      {
        titulo: 'Seus direitos',
        texto: 'Pela LGPD, você pode pedir confirmação do tratamento, acesso, correção, informações sobre compartilhamento e, quando cabível, portabilidade, anonimização, bloqueio ou eliminação. Você também pode saber o que acontece se recusar um consentimento e revogá-lo quando essa for a base do tratamento.',
      },
      {
        titulo: 'Como fazer uma solicitação',
        texto: emailPrivacidade
          ? `Para exercer seus direitos ou tirar dúvidas sobre seus dados, escreva para ${emailPrivacidade}.`
          : 'Durante a etapa acadêmica, encaminhe sua solicitação em particular à equipe responsável pelo projeto iBuild.',
      },
    ],
  },
};
