import { Image, useWindowDimensions } from 'react-native';

const logo = require('../assets/IBuild.png');
const proporcaoLogo = 2000 / 550;

export default function Logo() {
  const { width } = useWindowDimensions();
  const largura = Math.min(width * 0.72, 240);

  return (
    <Image
      source={logo}
      accessibilityLabel="iBuild"
      resizeMode="contain"
      style={{ width: largura, height: largura / proporcaoLogo, alignSelf: 'center' }}
    />
  );
}
