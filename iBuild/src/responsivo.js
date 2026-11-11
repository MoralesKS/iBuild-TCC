import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Estilo do container raiz de cada tela. Troca o antigo "10%" fixo pelas medidas REAIS do aparelho
// (barra de status, entalhe/notch, barra de navegação) e limita a largura em tablets/telas grandes.
//   uso:  const areaSegura = useAreaSegura();   <View style={[styles.container, areaSegura]}>
export function useAreaSegura() {
  const insets = useSafeAreaInsets();
  return {
    marginTop: 0,
    paddingTop: insets.top + 8,
    marginBottom: insets.bottom,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  };
}

// Medidas úteis para telas que precisam calcular tamanhos (ex.: carrossel de fotos)
export function useLayout() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    larguraUtil: Math.min(width, 640),
    ehTablet: width >= 600,
    ehTelaPequena: width < 340,
  };
}
