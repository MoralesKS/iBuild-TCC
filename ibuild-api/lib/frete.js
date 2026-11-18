function cepNoEndereco(endereco) {
  return String(endereco || '').match(/\b(\d{5})-?(\d{3})\b/)?.slice(1).join('');
}

// Tarifa do iBuild por vendedor/origem, em centavos, conforme a faixa postal.
function cotarFrete(anuncios, endereco) {
  const destino = cepNoEndereco(endereco);
  if (!destino) throw new Error('Inclua o CEP de oito dígitos no endereço de entrega.');
  if (!/[A-Za-zÀ-ÿ]{2}/.test(endereco) || !/(?:\d|\bs\/n\b)/i.test(String(endereco).replace(/\b\d{5}-?\d{3}\b/,''))) throw new Error('Informe a rua e o número, além do CEP. Para endereços sem número, informe S/N.');
  const origens = new Map();
  for (const anuncio of anuncios) {
    const origem = cepNoEndereco(anuncio.localizacao);
    if (!origem) throw new Error('O anúncio "' + anuncio.titulo + '" está sem CEP de origem. Peça ao vendedor para completar a localização.');
    const tarifa = origem.slice(0,5) === destino.slice(0,5) ? 890 :
      origem.slice(0,3) === destino.slice(0,3) ? 1290 :
      origem[0] === destino[0] ? 1990 : 2990;
    origens.set(anuncio.id_vendedor + '-' + origem, tarifa);
  }
  return [...origens.values()].reduce((soma, tarifa) => soma + tarifa, 0);
}
module.exports = { cepNoEndereco, cotarFrete };
