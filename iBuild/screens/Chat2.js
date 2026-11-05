import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, buscarConversa, gerarResposta } from "./Chat1";

const TAM_AVATAR = 28;
const horaAgora = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Chat2({ navigation, route }) {
  const conversa = buscarConversa(route.params?.conversaId);
  const [mensagens, setMensagens] = useState([...conversa.mensagens]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const listaRef = useRef(null);

  // Ao abrir uma conversa: carrega as mensagens dela e marca como lida
  useEffect(() => {
    conversa.naoLida = false;
    setMensagens([...conversa.mensagens]);
    setTexto("");
    setDigitando(false);
  }, [conversa.id]);

  const rolarParaFim = () =>
    setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 50);

  const adicionar = (autor, conteudo) => {
    conversa.mensagens.push({
      id: `${Date.now()}-${Math.random()}`,
      autor,
      texto: conteudo,
      hora: horaAgora(),
    });
    setMensagens([...conversa.mensagens]);
    rolarParaFim();
  };

  const enviar = () => {
    const conteudo = texto.trim();
    if (!conteudo || digitando) return;
    adicionar("eu", conteudo);
    setTexto("");
    setDigitando(true);
    setTimeout(() => {
      adicionar("outro", gerarResposta(conversa, conteudo));
      setDigitando(false);
    }, 900);
  };

  const renderMensagem = ({ item, index }) => {
    const minha = item.autor === "eu";
    const proxima = mensagens[index + 1];
    const fimDoGrupo = !proxima || proxima.autor !== item.autor;
    return (
      <View
        style={[
          styles.grupo,
          { alignItems: minha ? "flex-end" : "flex-start" },
        ]}
      >
        <View style={styles.linhaBalao}>
          {!minha && (
            <View style={{ width: TAM_AVATAR + 8 }}>
              {fimDoGrupo && (
                <Avatar
                  nome={conversa.nome}
                  cor={conversa.cor}
                  foto={conversa.foto}
                  tamanho={TAM_AVATAR}
                />
              )}
            </View>
          )}
          <View
            style={[styles.balao, minha ? styles.balaoMeu : styles.balaoOutro]}
          >
            <Text style={minha ? styles.textoMeu : styles.textoOutro}>
              {item.texto}
            </Text>
          </View>
        </View>
        {fimDoGrupo && (
          <Text style={[styles.hora, !minha && { marginLeft: TAM_AVATAR + 8 }]}>
            {item.hora}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.tela} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.cabecalho}>
          <Pressable onPress={() => navigation.navigate("Chat 1")} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color="#111" />
          </Pressable>
          <Avatar
            nome={conversa.nome}
            cor={conversa.cor}
            foto={conversa.foto}
            tamanho={36}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.nome} numberOfLines={1}>
              {conversa.nome}
            </Text>
            <Text style={styles.status}>
              {digitando ? "digitando…" : conversa.status}
            </Text>
          </View>
          <Ionicons name="call-outline" size={24} color="#111" />
          <Ionicons name="videocam-outline" size={26} color="#111" />
        </View>

        <FlatList
          ref={listaRef}
          data={mensagens}
          keyExtractor={(m) => m.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.lista}
          onContentSizeChange={rolarParaFim}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<Text style={styles.data}>{conversa.data}</Text>}
        />

        <View style={styles.barra}>
          <View style={styles.campo}>
            <TextInput
              style={styles.input}
              value={texto}
              onChangeText={setTexto}
              placeholder="Mensagem..."
              placeholderTextColor="#9a9a9a"
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
            {texto.trim() ? (
              <Pressable onPress={enviar} hitSlop={10}>
                <Ionicons name="send" size={22} color="#2f8f3a" />
              </Pressable>
            ) : (
              <>
                <Ionicons name="mic-outline" size={22} color="#8a8a8a" />
                <Ionicons name="happy-outline" size={22} color="#8a8a8a" />
                <Ionicons name="image-outline" size={22} color="#8a8a8a" />
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#fff" },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e3e3e3",
  },
  nome: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#111" 
  },
  status: {
    fontSize: 12,
    color: "#8a8a8a",
    marginTop: 1,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  data: {
    textAlign: "center",
    fontSize: 12,
    color: "#9a9a9a",
    marginVertical: 18,
  },
  grupo: {
    marginBottom: 4,
  },
  linhaBalao: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "85%",
  },
  balao: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  balaoMeu: {
    backgroundColor: "#000",
  },
  balaoOutro: {
    backgroundColor: "#ececec",
    flexShrink: 1,
  },
  textoMeu: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  textoOutro: {
    color: "#111",
    fontSize: 15,
    lineHeight: 20,
  },
  hora: {
    fontSize: 11,
    color: "#8a8a8a",
    marginTop: 4,
    marginBottom: 10,
  },
  barra: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fafafa",
  },
  input: { 
    flex: 1, 
    fontSize: 15,
     color: "#111", 
     paddingVertical: 0 
    },
});
