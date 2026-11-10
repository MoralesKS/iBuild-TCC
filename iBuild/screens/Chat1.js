import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../componentes/BottomBar";

/* ================================================================== */
/* DADOS: edite aqui as conversas, mensagens e respostas do bot        */
/* autor: 'eu' (balão preto) ou 'outro' (balão cinza)                  */
/* foto (opcional): foto: require('../assets/helena.png')              */
/* ================================================================== */
export const CONVERSAS = [
  {
    id: "helena",
    nome: "Helena Hills",
    cor: "#7a9e7e",
    tempo: "1d",
    status: "Online há 11min",
    grupos: ["seguindo"],
    naoLida: true,
    data: "30 de novembro de 2023, 9h41",
    padrao: "Vou conferir o projeto e te respondo ainda hoje.",
    mensagens: [
      {
        id: "h1",
        autor: "outro",
        texto: "Oi! Vi seu pedido de orçamento para a reforma da cozinha.",
        hora: "9:41",
      },
      {
        id: "h2",
        autor: "outro",
        texto: "Consegue me mandar as medidas do espaço?",
        hora: "9:41",
      },
      {
        id: "h3",
        autor: "eu",
        texto: "Claro! São 3,5 m por 4 m.",
        hora: "9:45",
      },
      {
        id: "h4",
        autor: "eu",
        texto: "Posso enviar as fotos também.",
        hora: "9:45",
      },
      {
        id: "h5",
        autor: "outro",
        texto: "Perfeito, pode mandar. Já faço um rascunho da planta.",
        hora: "9:52",
      },
    ],
  },
  {
    id: "nebul",
    nome: "Nebul Anomad",
    cor: "#5b6b8c",
    tempo: "1d",
    status: "Online agora",
    grupos: ["seguidores"],
    naoLida: false,
    data: "29 de novembro de 2023, 14h10",
    padrao: "Vou verificar o estoque e já te retorno.",
    mensagens: [
      {
        id: "n1",
        autor: "eu",
        texto: "Boa tarde! Vocês têm cimento CP-II em estoque?",
        hora: "14:10",
      },
      {
        id: "n2",
        autor: "outro",
        texto: "Boa tarde! Temos sim, saco de 50 kg.",
        hora: "14:13",
      },
      {
        id: "n3",
        autor: "outro",
        texto: "Quantos sacos você precisa?",
        hora: "14:13",
      },
      {
        id: "n4",
        autor: "eu",
        texto: "30 sacos. Fazem entrega em Embu das Artes?",
        hora: "14:20",
      },
      {
        id: "n5",
        autor: "outro",
        texto: "Fazemos! A entrega sai em até 2 dias úteis.",
        hora: "14:25",
      },
    ],
  },
  {
    id: "ember",
    nome: "Ember Echo",
    cor: "#c98b6b",
    tempo: "2d",
    status: "Online há 2h",
    grupos: ["seguindo", "seguidores"],
    naoLida: true,
    respondeu: "Qual o prazo para pintar a fachada?",
    data: "28 de novembro de 2023, 16h30",
    padrao: "Anotado! Mando os detalhes em breve.",
    mensagens: [
      {
        id: "e1",
        autor: "eu",
        texto: "Qual o prazo para pintar a fachada?",
        hora: "16:30",
      },
      {
        id: "e2",
        autor: "outro",
        texto: "Para uma fachada desse tamanho, uns 5 dias de trabalho.",
        hora: "17:02",
      },
      {
        id: "e3",
        autor: "outro",
        texto: "Se não chover, claro 😅",
        hora: "17:02",
      },
    ],
  },
  {
    id: "luna",
    nome: "Luna Voyager",
    cor: "#8a6fa8",
    tempo: "3d",
    status: "Online há 1h",
    grupos: ["seguidores"],
    naoLida: true,
    data: "27 de novembro de 2023, 8h15",
    padrao: "Entendi. Qualquer dúvida na parte elétrica, me chame.",
    mensagens: [
      {
        id: "l1",
        autor: "outro",
        texto: "Bom dia! Terminei a instalação elétrica do segundo andar.",
        hora: "8:15",
      },
      {
        id: "l2",
        autor: "outro",
        texto: "Falta só testar os disjuntores.",
        hora: "8:16",
      },
      {
        id: "l3",
        autor: "eu",
        texto: "Bom dia, Luna! Quando você consegue fazer o teste?",
        hora: "8:30",
      },
      {
        id: "l4",
        autor: "outro",
        texto: "Amanhã cedo, por volta das 8h.",
        hora: "8:34",
      },
    ],
  },
  {
    id: "carlos",
    nome: "Carlos Mendes",
    cor: "#b5654a",
    tempo: "4d",
    status: "Online há 3h",
    grupos: ["seguindo"],
    naoLida: true,
    respondeu: "Pode começar pela parede dos fundos?",
    data: "26 de novembro de 2023, 10h05",
    padrao: "Beleza, deixa comigo.",
    mensagens: [
      {
        id: "c1",
        autor: "eu",
        texto: "Pode começar pela parede dos fundos?",
        hora: "10:05",
      },
      {
        id: "c2",
        autor: "outro",
        texto: "Posso sim. Chego amanhã às 7h com o ajudante.",
        hora: "10:20",
      },
      {
        id: "c3",
        autor: "eu",
        texto: "Perfeito. O material já está no local.",
        hora: "10:22",
      },
      {
        id: "c4",
        autor: "outro",
        texto: "Show! Depois te mando as fotos do andamento.",
        hora: "10:25",
      },
    ],
  },
  {
    id: "rajesh",
    nome: "Rajesh Koothrappali",
    cor: "#4f8a8b",
    tempo: "5d",
    status: "Online há 1d",
    grupos: ["seguindo"],
    naoLida: false,
    data: "25 de novembro de 2023, 11h00",
    padrao: "Vou analisar e te envio o laudo.",
    mensagens: [
      {
        id: "r1",
        autor: "outro",
        texto: "Fiz a vistoria da laje hoje. Está tudo dentro do esperado.",
        hora: "11:00",
      },
      {
        id: "r2",
        autor: "eu",
        texto: "Que bom! Já posso liberar a concretagem?",
        hora: "11:15",
      },
      {
        id: "r3",
        autor: "outro",
        texto: "Pode. Só aguarde mais 24h de cura.",
        hora: "11:18",
      },
    ],
  },
  {
    id: "luna-antigo",
    nome: "Luna Voyager - Antigo",
    cor: "#9a9a9a",
    tempo: "50d",
    status: "Offline",
    grupos: ["bloqueados"],
    naoLida: false,
    data: "10 de outubro de 2023, 15h00",
    padrao: "Esta conta não está mais ativa.",
    mensagens: [
      {
        id: "a1",
        autor: "outro",
        texto: "Estou mudando de número, salva o novo contato.",
        hora: "15:00",
      },
      { id: "a2", autor: "eu", texto: "Anotado, obrigado!", hora: "15:03" },
    ],
  },
];

/* Bot: palavras em minúsculas e SEM acento. A primeira regra que combinar vence. */
const REGRAS = [
  {
    palavras: ["oi", "ola", "bom dia", "boa tarde", "boa noite"],
    resposta: "Olá! Como posso ajudar?",
  },
  {
    palavras: ["preco", "valor", "quanto custa", "orcamento"],
    resposta: "Consigo te passar um orçamento. Me conta mais sobre o serviço.",
  },
  {
    palavras: ["prazo", "quando", "demora"],
    resposta:
      "O prazo depende do tamanho da obra, mas em geral é de 5 a 10 dias.",
  },
  {
    palavras: ["entrega", "entregar"],
    resposta: "A entrega leva até 2 dias úteis.",
  },
  {
    palavras: ["obrigado", "obrigada", "valeu"],
    resposta: "Por nada! Qualquer coisa é só chamar.",
  },
  { palavras: ["tchau", "ate mais", "ate logo"], resposta: "Até mais! 👋" },
];

/* ================================================================== */
/* FUNÇÕES AUXILIARES (usadas também pelo Chat2.js)                    */
/* ================================================================== */
const ConversasContext = createContext(null);

export function ConversasProvider({ children }) {
  const conversas = useRef(null);
  if (!conversas.current) {
    conversas.current = CONVERSAS.map((conversa) => ({
      ...conversa,
      mensagens: [...conversa.mensagens],
    }));
  }
  return (
    <ConversasContext.Provider value={conversas.current}>
      {children}
    </ConversasContext.Provider>
  );
}

export function useConversas() {
  return useContext(ConversasContext);
}

export function obterConversaDoVendedor(conversas, produto) {
  const id = produto.idVendedor ? `vendedor-${produto.idVendedor}` : `demo-${produto.vendedor}`;
  const existente = conversas.find((conversa) => conversa.id === id);
  if (existente) return existente.id;

  conversas.unshift({
    id,
    nome: produto.vendedor || "Vendedor",
    status: "Conversa demonstrativa",
    cor: "#277D2C",
    grupos: [],
    tempo: "",
    mensagens: [],
    padrao: "Esta é uma resposta de demonstração.",
  });
  return id;
}

export function gerarResposta(conversa, textoUsuario) {
  const t = textoUsuario
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const regra = REGRAS.find((r) =>
    r.palavras.some((p) =>
      new RegExp(`(^|[^a-z0-9])${p}([^a-z0-9]|$)`).test(t),
    ),
  );
  return regra ? regra.resposta : conversa.padrao;
}

// Foto (se existir) ou círculo colorido com as iniciais
export function Avatar({ nome, cor, foto, tamanho = 48 }) {
  const base = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };
  if (foto) return <Image source={foto} style={base} />;
  const iniciais = nome
    .split(" ")
    .filter((p) => p.length > 1)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <View
      style={[
        base,
        {
          backgroundColor: cor,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Text
        style={{ color: "#fff", fontWeight: "600", fontSize: tamanho * 0.36 }}
      >
        {iniciais}
      </Text>
    </View>
  );
}

/* ================================================================== */
/* TELA: LISTA DE CONVERSAS                                            */
/* ================================================================== */
const VERDE = "#2f8f3a";
const FILTROS = ["Geral", "Seguidores", "Seguindo", "Bloqueados"];

export default function Chat1({ navigation }) {
  const conversas = useConversas();
  const [filtro, setFiltro] = useState("Geral");
  const [, atualizar] = useState(0);

  // Atualiza a lista ao voltar de uma conversa
  useEffect(
    () => navigation.addListener("focus", () => atualizar((n) => n + 1)),
    [navigation],
  );

  const lista = conversas.filter((c) =>
    filtro === "Geral"
      ? !c.grupos.includes("bloqueados")
      : c.grupos.includes(filtro.toLowerCase()),
  );

  const previa = (c) => {
    const u = c.mensagens[c.mensagens.length - 1];
    if (!u) return "Nenhuma mensagem ainda";
    return (u.autor === "eu" ? "Você: " : "") + u.texto;
  };

  return (
    <SafeAreaView style={styles.tela} edges={["top"]}>
      <Pressable accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home")}>
        <Text style={{ marginHorizontal: 16, marginTop: 8 }}>‹ Voltar</Text>
      </Pressable>
      <Text style={styles.titulo}>Conversas</Text>
      <Text style={{ marginHorizontal: 16, marginBottom: 8 }}>Conversas de demonstração</Text>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          {FILTROS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={[styles.chip, f === filtro && styles.chipAtivo]}
            >
              <Text
                style={[
                  styles.chipTexto,
                  f === filtro && styles.chipTextoAtivo,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        style={styles.lista}
        data={lista}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma conversa nesta categoria.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("Chat 2", { conversaId: item.id })
            }
            style={({ pressed }) => [
              styles.linha,
              pressed && { backgroundColor: "#f3f3f3" },
            ]}
          >
            <View style={styles.colunaPonto}>
              {item.naoLida && <View style={styles.ponto} />}
            </View>
            <Avatar nome={item.nome} cor={item.cor} foto={item.foto} />
            <View style={styles.textos}>
              <View style={styles.linhaNome}>
                <Text style={styles.nome} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={styles.tempo}>{item.tempo}</Text>
              </View>
              {item.respondeu ? (
                <>
                  <Text style={styles.previa}>Respondeu sua mensagem</Text>
                  <View style={styles.citacao}>
                    <View style={styles.barra} />
                    <Text style={styles.previa} numberOfLines={1}>
                      {item.respondeu}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.previa} numberOfLines={1}>
                  {previa(item)}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
      <BottomBar ativa="chat" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#fff" },
  lista: { flex: 1 },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  filtros: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  chipAtivo: {
    backgroundColor: VERDE,
    borderColor: VERDE,
  },
  chipTexto: {
    fontSize: 14,
    color: "#222",
  },
  chipTextoAtivo: {
    color: "#fff",
    fontWeight: "600",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 20,
  },
  colunaPonto: {
    width: 20,
    alignItems: "center",
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e8346f",
  },
  textos: {
    flex: 1,
    marginLeft: 12,
    gap: 3,
  },
  linhaNome: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    flexShrink: 1,
  },
  tempo: {
    fontSize: 13,
    color: "#9a9a9a",
  },
  previa: {
    fontSize: 14,
    color: "#777",
    flexShrink: 1,
  },
  citacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barra: {
    width: 2,
    height: 16,
    backgroundColor: "#cfcfcf",
    borderRadius: 1,
  },
  vazio: {
    textAlign: "center",
    color: "#9a9a9a",
    marginTop: 40,
  },
});
