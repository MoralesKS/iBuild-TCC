import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from './api';

export function useChat(pessoa, versao = 0) {
  const [dados,setDados] = useState([]);
  const [erro,setErro] = useState('');
  useFocusEffect(useCallback(() => {
    let ativo = true, timer;
    async function carregar() {
      try {
        const lista = pessoa ? await api.mensagens(pessoa) : await api.conversas();
        if (ativo) { setDados(lista); setErro(''); }
      } catch (e) { if (ativo) setErro(e.message); }
      if (ativo) timer = setTimeout(carregar, 4000);
    }
    carregar();
    return () => { ativo = false; clearTimeout(timer); };
  },[pessoa,versao]));
  return {dados,erro};
}
