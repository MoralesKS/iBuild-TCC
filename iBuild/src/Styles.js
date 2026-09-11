import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: '10%',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: '10%',
  },
  busca: {
    backgroundColor: '#F5F5F5',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#000000',
  },
  acoesRapidasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  acaoRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: 104,
    height: 32,
    borderColor: 'gray',
    borderRadius: 8,
    justifyContent: 'center',
  },
  acaoRapidaTexto: {
    fontSize: 13,
    color: '#000000',
    marginLeft: 4,
  },
  banner: {
    backgroundColor: '#F57C00',
    borderRadius: 12,
    height: 120,
    marginTop: 16,
    padding: 16,
    justifyContent: 'center',
  },
  bannerAnuncio: {
    color: '#FFFFFF',
    fontSize: 10,
    marginBottom: 4,
  },
  bannerTitulo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  secaoTitulo: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  secaoSeta: {
    color: '#828282',
    fontSize: 15,
  },
  categoriaItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoriaIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  categoriaTexto: {
    fontSize: 12,
    color: '#000000',
    marginTop: 6,
  },
  produtoCard: {
    width: 110,
    marginRight: 12,
    marginBottom: 16,
  },
  produtoImagem: {
    width: 110,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  produtoMarca: {
    fontSize: 10,
    color: '#828282',
    marginTop: 6,
  },
  produtoNome: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  produtoPreco: {
    fontSize: 13,
    color: '#000000',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});

export const mapaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: '10%',
    marginBottom: '10%',
  },
  buscaWrapper: {
    paddingHorizontal: 16,
  },
  busca: {
    backgroundColor: '#F5F5F5',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    color: '#000000',
  },
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filtroBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filtroTexto: {
    fontSize: 12,
    color: '#000000',
  },
  filtroSeta: {
    fontSize: 12,
    color: '#828282',
  },
  mapaWrapper: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapa: {
    flex: 1,
  },
  marcadorVoce: {
    backgroundColor: '#24BF1E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  marcadorVoceTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  lojaCard: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  lojaImagem: {
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  lojaInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  lojaInfo: {
    flex: 1,
  },
  lojaNome: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
  },
  lojaAvaliacao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  lojaEndereco: {
    fontSize: 12,
    color: '#828282',
  },
  lojaDistancia: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  selecionarBotao: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  selecionarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});

export const contratarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  linhaFiltros: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  filtroAtivo: {
    color: '#277D2C',
    fontWeight: 'bold',
    marginRight: 16,
  },
  filtro: {
    color: '#828282',
    marginRight: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  profissao: {
    fontSize: 12,
    color: '#F57C00',
  },
  descricao: {
    fontSize: 12,
    color: '#828282',
  },
  verPerfilBotao: {
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  verPerfilTexto: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});

export const gerenciarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filtro: {
    marginTop: 12,
    color: '#000000',
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 8,
    width: '35%',
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#828282',
  },
  statValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F57C00',
    marginTop: 6,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  obraCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#828282',
    borderWidth: 1,
  },
  obraNome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  obraSub: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 12,
  },
  progressoBarraFundo: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: 6,
    backgroundColor: '#277D2C',
    borderRadius: 3,
  },
  progressoTexto: {
    fontSize: 12,
    marginTop: 8,
  },
  foto: {
    width: 62,
    height: 62,
    tintColor: '#000000',
  },
  verDetalhesBotao: {
    backgroundColor: '#F57C00',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  verDetalhesTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});

export const detalhesObraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  resumoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#828282',
  },
  foto: {
    width: 61,
    height: 61,
    tintColor: '#000000',
  },
  foto1: {
    width: 21,
    height: 21,
    tintColor: '#000000',
    margin: 5,
  },
  resumoNome: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  resumoSub: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 12,
  },
  progressoBarraFundo: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressoBarraPreenchida: {
    height: 6,
    backgroundColor: '#277D2C',
    borderRadius: 3,
  },
  progressoTexto: {
    fontSize: 12,
    marginTop: 8,
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#828282',
    padding: 8,
  },
  infoLinha: {
    fontSize: 13,
    color: '#000000',
    marginBottom: 8,
  },
  contratarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  contratarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
  divisao: {
    width: '25%',
    borderLeftWidth: .5,
    borderRightWidth: .5,
    padding: 4,
    alignItems: 'center',
  }
});

export const funcionariosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 16,
  },
  contratarBotao: {
    backgroundColor: '#F57C00',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contratarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardDestaque: {
    backgroundColor: '#FDECD2',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cargo: {
    fontSize: 12,
    color: '#F57C00',
  },
  conversarBotao: {
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  conversarTexto: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});

export const notificacoesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: '10%',
    paddingTop: '10%',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  linhaFiltros: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  filtroAtivo: {
    color: '#F57C00',
    fontWeight: 'bold',
    marginRight: 16,
  },
  filtro: {
    color: '#828282',
    marginRight: 16,
  },
  grupoTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  notificacaoCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificacaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
  },
  notificacaoDescricao: {
    fontSize: 12,
    color: '#828282',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 72,
  },
  footerIcone: {
    height: 23,
    width: 23,
    tintColor: '#9C9C9C',
  },
  footerIcone1: {
    height: 23,
    width: 23,
    tintColor: '#277D2C',
  },
});