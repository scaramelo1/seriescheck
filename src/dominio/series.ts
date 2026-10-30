import { limparSinopse } from './texto.ts';
import type { EntradaCatalogo, ResumoSerie, Serie, ShowTvMaze } from './tipos.ts';

export type Ordem = 'populares' | 'em-exibicao' | 'melhores';

const POR_PAGINA = 30;
/** Abaixo disso a nota vem de poucos votos e séries obscuras dominariam o topo. */
const PESO_MINIMO_NOTA = 95;

export function paraSerie(show: ShowTvMaze, regiao: string | null): Serie {
  const embutido = show._embedded;
  const fundos = (embutido?.images ?? []).filter((i) => i.type === 'background');
  const fundo = fundos.find((i) => i.main) ?? fundos[0];
  const aka = regiao ? embutido?.akas?.find((a) => a.country?.code === regiao) : undefined;
  return {
    id: show.id,
    titulo: show.name,
    tituloAlternativo: aka && aka.name !== show.name ? aka.name : null,
    capa: show.image?.original ?? show.image?.medium ?? null,
    banner: fundo?.resolutions.original?.url ?? null,
    sinopse: limparSinopse(show.summary),
    canal: show.network?.name ?? show.webChannel?.name ?? null,
    status: show.status ?? null,
    ano: show.premiered ? Number(show.premiered.slice(0, 4)) : null,
    nota: show.rating?.average ?? null,
    generos: show.genres ?? [],
  };
}

export const paraResumo = (show: ShowTvMaze): ResumoSerie => ({
  id: show.id,
  titulo: show.name,
  capa: show.image?.medium ?? null,
});

/** O catálogo já vem ordenado por popularidade. */
export function paginarCatalogo(catalogo: EntradaCatalogo[], ordem: Ordem, pagina: number) {
  let lista = catalogo;
  if (ordem === 'em-exibicao') lista = catalogo.filter((s) => s.status === 'Running');
  if (ordem === 'melhores') {
    lista = catalogo
      .filter((s) => s.nota !== null && s.peso >= PESO_MINIMO_NOTA)
      .sort((a, b) => (b.nota ?? 0) - (a.nota ?? 0));
  }
  const fim = pagina * POR_PAGINA;
  return { series: lista.slice(fim - POR_PAGINA, fim), temMais: fim < lista.length };
}
