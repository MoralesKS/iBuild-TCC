import { createContext, useContext, useState } from 'react';

// Um Context é como uma "caixa" de estado que fica FORA das telas.
// Diferente de um useState dentro de um componente (que é apagado
// quando você navega pra outra tela), o valor aqui continua vivo
// enquanto o app estiver aberto — porque ele vive um nível acima,
// envolvendo todo o app.
const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarAoCarrinho(produto) {
    setItens((itensAtuais) => {
      const jaExisteNoCarrinho = itensAtuais.find((item) => item.id === produto.id);

      if (jaExisteNoCarrinho) {
        // Se o produto já está no carrinho, só aumenta a quantidade
        return itensAtuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      // Se é a primeira vez, adiciona no fim da lista com quantidade 1
      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(id) {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.id !== id));
  }

  function limparCarrinho() {
    setItens([]);
  }

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook de atalho: em vez de importar useContext + CarrinhoContext
// em toda tela, você só chama useCarrinho().
export function useCarrinho() {
  return useContext(CarrinhoContext);
}