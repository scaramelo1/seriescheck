import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

import { obterSerie } from '../api/tvmaze';
import {
  definirAssistido,
  desmarcarVarios,
  listarAssistidos,
  marcarVarios,
  obterSerieSalva,
  salvarSerie,
} from '../db/repositorio';
import { montarEpisodios } from '../dominio/episodios';
import type { Episodio, Serie } from '../dominio/tipos';
import { regiaoCelular, t } from '../i18n';

function hojeIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Mostra o cache na hora e atualiza pela internet; sem internet, segue com o cache. */
export function useSerie(id: number) {
  const db = useSQLiteContext();
  const [serie, setSerie] = useState<Serie>();
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [assistidos, setAssistidos] = useState<ReadonlySet<number>>(new Set());
  // Lido por `alternar` para ele não mudar a cada tick e manter o memo de LinhaEpisodio.
  const assistidosRef = useRef(assistidos);
  assistidosRef.current = assistidos;
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCarregando(true);
      setErro(false);
      const [salva, marcados] = await Promise.all([obterSerieSalva(db, id), listarAssistidos(db, id)]);
      if (cancelado) return;
      setAssistidos(new Set(marcados));
      if (salva) {
        setSerie(salva.serie);
        setEpisodios(salva.episodios);
      }
      try {
        const { serie: nova, episodios: brutos } = await obterSerie(id, regiaoCelular);
        const lista = montarEpisodios(brutos, {
          hoje: hojeIso(),
          encerrada: nova.status === 'Ended',
          rotuloEpisodio: t.episodio,
        });
        await salvarSerie(db, nova, lista);
        if (cancelado) return;
        setSerie(nova);
        setEpisodios(lista.length > 0 ? lista : (salva?.episodios ?? []));
      } catch {
        if (!cancelado && !salva) setErro(true);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [db, id, tentativa]);

  const alternar = useCallback(
    async (episodioId: number) => {
      const marcar = !assistidosRef.current.has(episodioId);
      setAssistidos((atual) => {
        const novo = new Set(atual);
        if (marcar) novo.add(episodioId);
        else novo.delete(episodioId);
        return novo;
      });
      await definirAssistido(db, id, episodioId, marcar);
    },
    [db, id],
  );

  const marcar = useCallback(
    async (ids: number[]) => {
      setAssistidos((atual) => new Set([...atual, ...ids]));
      await marcarVarios(db, id, ids);
    },
    [db, id],
  );

  const desmarcar = useCallback(
    async (ids: number[]) => {
      const removidos = new Set(ids);
      setAssistidos((atual) => new Set([...atual].filter((e) => !removidos.has(e))));
      await desmarcarVarios(db, ids);
    },
    [db],
  );

  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), []);

  return { serie, episodios, assistidos, carregando, erro, alternar, marcar, desmarcar, tentarDeNovo };
}
