import { limparSinopse } from './texto.ts';
import type { Episodio, EpisodioTvMaze } from './tipos.ts';

export interface Progresso {
  assistidos: number;
  total: number;
  percentual: number; // 0 a 100
}

export interface OpcoesEpisodios {
  hoje: string; // AAAA-MM-DD
  /** Série encerrada sem data no episódio já saiu; em exibição, ainda está por vir. */
  encerrada: boolean;
  rotuloEpisodio: (numero: number) => string;
}

/** Ordena por temporada e número. Especiais, sem número, ficam de fora. */
export function montarEpisodios(
  brutos: EpisodioTvMaze[],
  { hoje, encerrada, rotuloEpisodio }: OpcoesEpisodios,
): Episodio[] {
  return brutos
    .filter((ep): ep is EpisodioTvMaze & { number: number } => ep.number !== null)
    .sort((a, b) => a.season - b.season || a.number - b.number)
    .map((ep) => {
      const exibidoEm = ep.airdate || null;
      return {
        id: ep.id,
        temporada: ep.season,
        numero: ep.number,
        titulo: ep.name || rotuloEpisodio(ep.number),
        resumo: limparSinopse(ep.summary),
        imagem: ep.image?.medium ?? null,
        exibidoEm,
        liberado: exibidoEm ? exibidoEm <= hoje : encerrada,
      };
    });
}

export function listarTemporadas(episodios: Episodio[]): number[] {
  return [...new Set(episodios.map((ep) => ep.temporada))];
}

export function calcularProgresso(assistidos: number, total: number): Progresso {
  const percentual = total > 0 ? Math.min(100, Math.floor((assistidos / total) * 100)) : 0;
  return { assistidos, total, percentual };
}

/** Primeiro episódio liberado e não assistido, ou null se está em dia. */
export function proximoParaAssistir(episodios: Episodio[], assistidos: ReadonlySet<number>): Episodio | null {
  return episodios.find((ep) => ep.liberado && !assistidos.has(ep.id)) ?? null;
}

/** Ids liberados do início da série até `ate`, para "marcar até aqui". */
export function idsAte(episodios: Episodio[], ate: Episodio): number[] {
  return episodios.slice(0, episodios.indexOf(ate) + 1).filter((ep) => ep.liberado).map((ep) => ep.id);
}
