const API_URL = 'http://localhost:3000';

export async function cadastrarPessoaFisica(dados) {
  const resposta = await fetch(
    `${API_URL}/api/cadastro/pessoa-fisica`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || 'Erro ao cadastrar usuário.'
    );
  }

  return resultado;
}

export async function cadastrarAutonomo(dados) {
  const resposta = await fetch(
    `${API_URL}/api/cadastro/autonomo`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || 'Erro ao cadastrar autônomo.'
    );
  }

  return resultado;
}

export async function cadastrarEmpresa(dados) {
  const resposta = await fetch(
    `${API_URL}/api/cadastro/empresa`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || 'Erro ao cadastrar empresa.'
    );
  }

  return resultado;
}

export async function buscarUsuarioPorFirebase(uid) {

  const resposta = await fetch(
    `${API_URL}/api/usuarios/firebase/${uid}`
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem ||
      'Erro ao buscar usuário.'
    );
  }

  return resultado;
}

export async function buscarAnuncios() {

  const resposta = await fetch(
    `${API_URL}/api/anuncios`
  );

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem ||
      'Erro ao buscar anúncios.'
    );
  }

  return resultado;
}