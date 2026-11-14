const ETAPAS = ['fundacao', 'estrutura', 'acabamento'];
function progressoEtapas(obra, tarefas) {
  return Object.fromEntries(ETAPAS.map(etapa => {
    const vinculadas = tarefas.filter(t => t.etapa === etapa);
    return [etapa, vinculadas.length ? Math.round(100 * vinculadas.filter(t => t.status === 'concluida').length / vinculadas.length) : Number(obra['etapa_' + etapa] || 0)];
  }));
}
function validarPedido(b) {
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(b.chave || '')) throw new Error('Chave do pedido inválida.');
  if (!Array.isArray(b.itens) || !b.itens.length || b.itens.length > 100) throw new Error('Pedido vazio ou com itens demais.');
  const itens = b.itens.map(i => ({id_anuncio: Number(i.id_anuncio), quantidade: Number(i.quantidade)})).sort((a,b) => a.id_anuncio-b.id_anuncio);
  if (itens.some(i => !Number.isSafeInteger(i.id_anuncio) || i.id_anuncio < 1 || !Number.isSafeInteger(i.quantidade) || i.quantidade < 1 || i.quantidade > 99999999)) throw new Error('Itens ou quantidades inválidos.');
  if (new Set(itens.map(i => i.id_anuncio)).size !== itens.length) throw new Error('Produto repetido no pedido.');
  const recebimento = b.recebimento || 'entrega';
  if (!['entrega','retirada'].includes(recebimento)) throw new Error('Forma de recebimento inválida.');
  const endereco = recebimento === 'retirada' ? 'Retirada a combinar com os vendedores' : String(b.endereco || '').trim();
  if (endereco.length < 8 || endereco.length > 500) throw new Error('Informe um endereço completo (8 a 500 caracteres).');
  const cupom = String(b.cupom || '').trim().toUpperCase();
  if (cupom && cupom !== 'IBUILD10') throw new Error('Cupom inválido.');
  if (!['Pix', 'Cartão de crédito', 'Dinheiro na entrega'].includes(b.metodo)) throw new Error('Forma de pagamento inválida.');
  return {itens, endereco, cupom, metodo: b.metodo, recebimento};
}
module.exports = { ETAPAS, progressoEtapas, validarPedido };
