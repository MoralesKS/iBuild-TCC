import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

// Imagem que não "some" em silêncio: sem foto ou com erro de carregamento mostra um quadro cinza
// com o motivo e escreve o endereço da imagem no terminal (útil para descobrir o problema).
export default function FotoProduto({ source, style, resizeMode = 'cover' }) {
  const [erro, setErro] = useState(false);
  const chave = source && source.uri ? source.uri : source;

  useEffect(() => {
    setErro(false);
  }, [chave]);

  if (!source || erro) {
    return (
      <View style={[style, { backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
        <Text style={{ fontSize: 10, color: '#828282', textAlign: 'center' }}>
          {source ? 'Foto indisponível' : 'Sem foto'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      style={style}
      source={source}
      resizeMode={resizeMode}
      onError={(e) => {
        console.log('Falha ao carregar a imagem:', source.uri, e.nativeEvent && e.nativeEvent.error);
        setErro(true);
      }}
    />
  );
}
