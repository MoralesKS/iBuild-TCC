import AsyncStorage from '@react-native-async-storage/async-storage';

const chave = (usuario) => `ibuild:favoritos:${usuario || 'visitante'}`;

export async function listarFavoritos(usuario) {
  try { return JSON.parse(await AsyncStorage.getItem(chave(usuario)) || '[]'); }
  catch { return []; }
}

export async function verificarFavorito(usuario, produto) {
  const lista = await listarFavoritos(usuario);
  return lista.some((item) => String(item.id) === String(produto.id));
}

export async function alternarFavorito(usuario, produto) {
  const lista = await listarFavoritos(usuario);
  const existe = lista.some((item) => String(item.id) === String(produto.id));
  const novaLista = existe ? lista.filter((item) => String(item.id) !== String(produto.id)) : [produto, ...lista];
  await AsyncStorage.setItem(chave(usuario), JSON.stringify(novaLista));
  return !existe;
}
