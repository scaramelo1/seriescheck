import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { traduzir } from '../api/traducao';
import { obterTraducao, salvarTraducao } from '../db/repositorio';
import { idiomaCelular, precisaTraduzir } from '../i18n';

/** Usa a tradução já salva; só vai à internet com `buscar`, para poupar a cota diária. */
export function useTraducao(texto: string, buscar: boolean): string | null {
  const db = useSQLiteContext();
  const [traduzido, setTraduzido] = useState<string | null>(null);

  useEffect(() => {
    if (!precisaTraduzir || !texto) return;
    let cancelado = false;
    (async () => {
      const salva = await obterTraducao(db, texto, idiomaCelular);
      if (cancelado) return;
      if (salva) {
        setTraduzido(salva);
        return;
      }
      if (!buscar) return;
      const nova = await traduzir(texto, idiomaCelular);
      if (!nova) return;
      await salvarTraducao(db, texto, idiomaCelular, nova);
      if (!cancelado) setTraduzido(nova);
    })();
    return () => {
      cancelado = true;
    };
  }, [buscar, db, texto]);

  return traduzido;
}
