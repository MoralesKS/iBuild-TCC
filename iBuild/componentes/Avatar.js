import { useEffect, useState } from 'react';
import { Image } from 'react-native';
const padrao = require('../assets/Perfil.png');
export default function Avatar({source, style}) {
  const [erro, setErro] = useState(false);
  useEffect(() => setErro(false), [source?.uri || source]);
  return <Image source={erro || !source ? padrao : source} style={style} resizeMode="cover" onError={() => setErro(true)} />;
}
