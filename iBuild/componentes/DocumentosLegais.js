import { useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { documentosLegais } from '../src/documentosLegais';

export default function DocumentosLegais({ aceito, onAceitar }) {
  const [documento, setDocumento] = useState(null);

  function abrirDocumento(chave) {
    Keyboard.dismiss();
    setDocumento(documentosLegais[chave]);
  }

  function fecharDocumento() {
    setDocumento(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.links}>
        {Object.entries(documentosLegais).map(([chave, { titulo }]) => (
          <Pressable key={chave} accessibilityRole="button" onPress={() => abrirDocumento(chave)} style={styles.linkArea}>
            <Text style={styles.link}>{titulo}</Text>
          </Pressable>
        ))}
      </View>

      {onAceitar && (
        <Pressable
          accessibilityRole="checkbox"
          aria-checked={aceito}
          onPress={() => onAceitar(!aceito)}
          style={styles.aceite}
        >
          <View style={[styles.caixa, aceito && styles.caixaMarcada]} accessibilityElementsHidden importantForAccessibility="no">
            {aceito && <Text style={styles.marca}>✓</Text>}
          </View>
          <Text style={styles.aceiteTexto}>Aceito os Termos de Serviço e li a Política de Privacidade.</Text>
        </Pressable>
      )}

      {documento && (
        <Modal transparent animationType="fade" visible onRequestClose={fecharDocumento}>
          <View style={styles.fundo}>
            <View style={styles.modal} accessibilityViewIsModal>
              <Text style={styles.titulo} accessibilityRole="header">{documento.titulo}</Text>
              <ScrollView style={styles.documento}>
                {documento.secoes.map(({ titulo, texto }) => (
                  <View key={titulo} style={styles.secao}>
                    <Text style={styles.subtitulo} accessibilityRole="header">{titulo}</Text>
                    <Text style={styles.texto} selectable>{texto}</Text>
                  </View>
                ))}
              </ScrollView>
              <Pressable accessibilityRole="button" onPress={fecharDocumento} style={styles.fechar}>
                <Text style={styles.fecharTexto}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  linkArea: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 7,
  },
  link: {
    color: '#277D2C',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  aceite: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
    maxWidth: 310,
    paddingHorizontal: 8,
  },
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#277D2C',
    borderWidth: 1,
    borderRadius: 4,
    width: 22,
    height: 22,
    marginRight: 8,
  },
  caixaMarcada: {
    backgroundColor: '#277D2C',
  },
  marca: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  aceiteTexto: {
    flexShrink: 1,
    fontSize: 13,
    color: '#383838',
  },
  fundo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  titulo: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#277D2C',
    marginBottom: 14,
  },
  documento: {
    flexGrow: 0,
    flexShrink: 1,
  },
  secao: {
    marginBottom: 14,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    lineHeight: 21,
    color: '#383838',
  },
  fechar: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#277D2C',
  },
  fecharTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
