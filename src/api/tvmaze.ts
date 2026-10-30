import catalogo from '../dados/catalogo.json';
import { paginarCatalogo, paraResumo, paraSerie, type Ordem } from '../dominio/series';
import type { EntradaCatalogo, EpisodioTvMaze, ResumoSerie, Serie, ShowTvMaze } from '../dominio/tipos';

const URL_API = 'https://api.tvmaze.com';

export class ErroLimite extends Error {}

export interface PaginaSeries {
  series: ResumoSerie[];
  temMais: boolean;
}

async function consultar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${URL_API}${caminho}`);
  if (resposta.status === 429) throw new ErroLimite();
  if (!resposta.ok) throw new Error(`TVmaze respondeu ${resposta.status}`);
  return (await resposta.json()) as T;
}

/** A busca do TVmaze traz no máximo 10 resultados e não tem páginas; as listas vêm do catálogo embutido. */
export async function buscarSeries(busca: string, ordem: Ordem, pagina: number): Promise<PaginaSeries> {
  const termo = busca.trim();
  if (!termo) return paginarCatalogo(catalogo as EntradaCatalogo[], ordem, pagina);
  const achados = await consultar<{ show: ShowTvMaze }[]>(`/search/shows?q=${encodeURIComponent(termo)}`);
  const series = achados.map((a) => a.show).filter((s) => !s.genres?.includes('Adult'));
  return { series: series.map(paraResumo), temMais: false };
}

export async function obterSerie(
  id: number,
  regiao: string | null,
): Promise<{ serie: Serie; episodios: EpisodioTvMaze[] }> {
  const show = await consultar<ShowTvMaze>(`/shows/${id}?embed[]=episodes&embed[]=akas&embed[]=images`);
  return { serie: paraSerie(show, regiao), episodios: show._embedded?.episodes ?? [] };
}
