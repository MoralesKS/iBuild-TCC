import { Image, useWindowDimensions } from 'react-native';
const logo = require('../assets/IBuild.jpg');
const tamanho = Image.resolveAssetSource(logo);
export default function Logo() {
  const {width,height}=useWindowDimensions();
  const largura=Math.min(width-48,300,Math.max(160,height*0.45));
  return <Image source={logo} accessibilityLabel="iBuild" resizeMode="contain" style={{width:largura,aspectRatio:tamanho.width/tamanho.height,alignSelf:'center',flexShrink:0}} />;
}
