export interface ResumoSerie {
  id: number; // id do TVmaze
  titulo: string;
  capa: string | null;
}

export interface EntradaCatalogo extends ResumoSerie {
  nota: number | null;
  status: string;
  peso: number;
}

export interface Serie extends ResumoSerie {
  tituloAlternativo: string | null;
  banner: string | null;
  sinopse: string;
  canal: string | null;
  status: string | null;
  ano: number | null;
  nota: number | null; // 0 a 10
  generos: string[];
}

export interface Episodio {
  id: number; // id do TVmaze
  temporada: number;
  numero: number;
  titulo: string;
  resumo: string;
  imagem: string | null;
  exibidoEm: string | null; // AAAA-MM-DD
  /** false para episódio anunciado que ainda não foi ao ar: não pode ser marcado. */
  liberado: boolean;
}

export interface ImagemTvMaze {
  medium?: string | null;
  original?: string | null;
}

/** Só o que o app usa da resposta do TVmaze. */
export interface EpisodioTvMaze {
  id: number;
  name?: string | null;
  season: number;
  number: number | null;
  airdate?: string | null;
  image?: ImagemTvMaze | null;
  summary?: string | null;
}

export interface ShowTvMaze {
  id: number;
  name: string;
  genres?: string[] | null;
  status?: string | null;
  premiered?: string | null;
  rating?: { average: number | null } | null;
  network?: { name: string } | null;
  webChannel?: { name: string } | null;
  image?: ImagemTvMaze | null;
  summary?: string | null;
  _embedded?: {
    episodes?: EpisodioTvMaze[];
    akas?: { name: string; country: { code: string } | null }[];
    images?: { type: string | null; main: boolean; resolutions: { original?: { url: string } } }[];
  };
}
