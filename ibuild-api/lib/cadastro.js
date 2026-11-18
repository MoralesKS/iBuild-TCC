function documentoValido(valor, empresa) {
  const doc = String(valor || '').replace(/[.\s/\-]/g,'').toUpperCase();
  if (!(empresa ? /^[A-Z0-9]{12}\d{2}$/ : /^\d{11}$/).test(doc) || /^(.)\1+$/.test(doc)) return false;
  const numeros = [...doc].map(c => c.charCodeAt(0) - 48);
  for (const tamanho of [doc.length-2,doc.length-1]) {
    const soma = numeros.slice(0,tamanho).reduce((total,n,i) =>
      total + n * (empresa ? (tamanho-1-i)%8+2 : tamanho+1-i), 0);
    const resto = soma % 11;
    if (numeros[tamanho] !== (resto < 2 ? 0 : 11-resto)) return false;
  }
  return true;
}

function erroCadastro(dados) {
  const tipo = dados.tipo_perfil;
  if (!String(dados.nome || '').trim().match(/\p{L}.*\p{L}/u)) return 'Informe seu nome com pelo menos duas letras.';
  if (!/^[1-9][1-9]9\d{8}$/.test(String(dados.telefone || '').replace(/[ ()-]/g,''))) return 'Informe um celular de 11 dígitos, com DDD e o 9 inicial.';
  if ((dados.cpf || tipo === 'pessoa_fisica') && !documentoValido(dados.cpf,false)) return 'Os dígitos do CPF são inválidos. Confira o documento.';
  if (tipo === 'loja' && !documentoValido(dados.cnpj,true)) return 'Os dígitos do CNPJ são inválidos. Confira o documento.';
  if (tipo === 'pessoa_fisica') {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dados.data_nascimento);
    if (!partes) return 'Informe a data de nascimento no formato DD/MM/AAAA.';
    const [,dia,mes,ano] = partes;
    const iso = ano+'-'+mes+'-'+dia;
    const data = new Date(iso+'T00:00:00Z');
    if (Number.isNaN(data.getTime()) || data.toISOString().slice(0,10) !== iso || data > new Date() || +ano < 1900) return 'A data de nascimento precisa existir e estar entre 1900 e hoje.';
  }
  return null;
}
module.exports = { erroCadastro, documentoValido };
