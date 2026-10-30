export type IdiomaApp = 'pt' | 'en' | 'es';

export interface Textos {
  abaExplorar: string;
  abaLista: string;
  buscarPlaceholder: string;
  ordemPopulares: string;
  ordemEmExibicao: string;
  ordemMelhores: string;
  erroInternet: string;
  erroLimite: string;
  tentarDeNovo: string;
  nenhumaSerie: string;
  listaVazia: string;
  explorarSeries: string;
  todos: (n: number) => string;
  assistindo: string;
  concluidos: string;
  nadaNoFiltro: string;
  deEpisodios: (assistidos: number, total: number) => string;
  erroAbrirSerie: string;
  semEpisodios: string;
  marcarAteTitulo: string;
  marcarAteTexto: (codigo: string) => string;
  marcar: string;
  cancelar: string;
  desmarcarTitulo: (n: number) => string;
  desmarcarTexto: string;
  desmarcar: string;
  assistiEp: (codigo: string) => string;
  marcarTemporada: string;
  desmarcarTemporada: string;
  temporada: (n: number) => string;
  codigoEp: (temporada: number, numero: number) => string;
  dicaSegurar: string;
  creditos: string;
  episodio: (n: number) => string;
  episodioAssistido: (codigo: string) => string;
  mostrarResumo: string;
  traducaoAutomatica: string;
  verOriginal: string;
  verTraducao: string;
  status: Record<string, string>;
  generos: Record<string, string>;
}

const pt: Textos = {
  abaExplorar: 'Explorar',
  abaLista: 'Minha lista',
  buscarPlaceholder: 'Buscar série…',
  ordemPopulares: 'Populares',
  ordemEmExibicao: 'Em exibição',
  ordemMelhores: 'Melhores notas',
  erroInternet: 'Não foi possível carregar. Verifique sua internet.',
  erroLimite: 'Muitas buscas seguidas. Aguarde um minuto e tente de novo.',
  tentarDeNovo: 'Tentar de novo',
  nenhumaSerie: 'Nenhuma série encontrada.',
  listaVazia: 'Sua lista está vazia. Abra uma série em Explorar e marque os episódios que já assistiu.',
  explorarSeries: 'Explorar séries',
  todos: (n) => `Todas (${n})`,
  assistindo: 'Assistindo',
  concluidos: 'Concluídas',
  nadaNoFiltro: 'Nada por aqui neste filtro.',
  deEpisodios: (a, t) => `${a} de ${t} episódios`,
  erroAbrirSerie: 'Não foi possível abrir esta série.',
  semEpisodios: 'Ainda não há episódios desta série.',
  marcarAteTitulo: 'Marcar até aqui?',
  marcarAteTexto: (c) => `Marca como assistidos todos os episódios até ${c}, contando as temporadas anteriores.`,
  marcar: 'Marcar',
  cancelar: 'Cancelar',
  desmarcarTitulo: (n) => `Desmarcar a temporada ${n}?`,
  desmarcarTexto: 'O progresso desta temporada será apagado.',
  desmarcar: 'Desmarcar',
  assistiEp: (c) => `Assisti ${c}`,
  marcarTemporada: 'Marcar temporada',
  desmarcarTemporada: 'Desmarcar temporada',
  temporada: (n) => `Temporada ${n}`,
  codigoEp: (t, n) => `T${t} E${n}`,
  dicaSegurar: 'Segure o círculo de um episódio para marcar até ele.',
  creditos: 'Dados: TVmaze (CC BY-SA) · Tradução: MyMemory',
  episodio: (n) => `Episódio ${n}`,
  episodioAssistido: (c) => `${c} assistido`,
  mostrarResumo: 'Mostra o resumo completo',
  traducaoAutomatica: 'Tradução automática',
  verOriginal: 'Ver original',
  verTraducao: 'Ver tradução',
  status: {
    Running: 'Em exibição',
    Ended: 'Finalizada',
    'To Be Determined': 'Indefinida',
    'In Development': 'Em desenvolvimento',
  },
  generos: {
    Action: 'Ação',
    Adventure: 'Aventura',
    Anime: 'Anime',
    Children: 'Infantil',
    Comedy: 'Comédia',
    Crime: 'Crime',
    DIY: 'Faça você mesmo',
    Drama: 'Drama',
    Espionage: 'Espionagem',
    Family: 'Família',
    Fantasy: 'Fantasia',
    Food: 'Culinária',
    History: 'História',
    Horror: 'Terror',
    Legal: 'Jurídico',
    Medical: 'Médico',
    Music: 'Música',
    Mystery: 'Mistério',
    Nature: 'Natureza',
    Romance: 'Romance',
    'Science-Fiction': 'Ficção científica',
    Sports: 'Esportes',
    Supernatural: 'Sobrenatural',
    Thriller: 'Suspense',
    Travel: 'Viagem',
    War: 'Guerra',
    Western: 'Faroeste',
  },
};

const en: Textos = {
  abaExplorar: 'Explore',
  abaLista: 'My list',
  buscarPlaceholder: 'Search series…',
  ordemPopulares: 'Popular',
  ordemEmExibicao: 'Airing',
  ordemMelhores: 'Top rated',
  erroInternet: 'Could not load. Check your connection.',
  erroLimite: 'Too many searches in a row. Wait a minute and try again.',
  tentarDeNovo: 'Try again',
  nenhumaSerie: 'No series found.',
  listaVazia: 'Your list is empty. Open a series in Explore and check the episodes you have watched.',
  explorarSeries: 'Explore series',
  todos: (n) => `All (${n})`,
  assistindo: 'Watching',
  concluidos: 'Completed',
  nadaNoFiltro: 'Nothing here for this filter.',
  deEpisodios: (a, t) => `${a} of ${t} episodes`,
  erroAbrirSerie: 'Could not open this series.',
  semEpisodios: 'No episodes for this series yet.',
  marcarAteTitulo: 'Check up to here?',
  marcarAteTexto: (c) => `Marks every episode up to ${c} as watched, including earlier seasons.`,
  marcar: 'Check',
  cancelar: 'Cancel',
  desmarcarTitulo: (n) => `Uncheck season ${n}?`,
  desmarcarTexto: 'Progress for this season will be erased.',
  desmarcar: 'Uncheck',
  assistiEp: (c) => `Watched ${c}`,
  marcarTemporada: 'Check season',
  desmarcarTemporada: 'Uncheck season',
  temporada: (n) => `Season ${n}`,
  codigoEp: (t, n) => `S${t} E${n}`,
  dicaSegurar: 'Hold an episode circle to check everything up to it.',
  creditos: 'Data: TVmaze (CC BY-SA) · Translation: MyMemory',
  episodio: (n) => `Episode ${n}`,
  episodioAssistido: (c) => `${c} watched`,
  mostrarResumo: 'Shows the full summary',
  traducaoAutomatica: 'Automatic translation',
  verOriginal: 'See original',
  verTraducao: 'See translation',
  status: {
    Running: 'Airing',
    Ended: 'Ended',
    'To Be Determined': 'To be determined',
    'In Development': 'In development',
  },
  generos: {},
};

const es: Textos = {
  abaExplorar: 'Explorar',
  abaLista: 'Mi lista',
  buscarPlaceholder: 'Buscar serie…',
  ordemPopulares: 'Populares',
  ordemEmExibicao: 'En emisión',
  ordemMelhores: 'Mejor valorados',
  erroInternet: 'No se pudo cargar. Revisa tu conexión.',
  erroLimite: 'Demasiadas búsquedas seguidas. Espera un minuto e inténtalo de nuevo.',
  tentarDeNovo: 'Reintentar',
  nenhumaSerie: 'No se encontró ninguna serie.',
  listaVazia: 'Tu lista está vacía. Abre una serie en Explorar y marca los episodios que ya viste.',
  explorarSeries: 'Explorar series',
  todos: (n) => `Todas (${n})`,
  assistindo: 'Viendo',
  concluidos: 'Completadas',
  nadaNoFiltro: 'Nada por aquí con este filtro.',
  deEpisodios: (a, t) => `${a} de ${t} episodios`,
  erroAbrirSerie: 'No se pudo abrir esta serie.',
  semEpisodios: 'Esta serie aún no tiene episodios.',
  marcarAteTitulo: '¿Marcar hasta aquí?',
  marcarAteTexto: (c) => `Marca como vistos todos los episodios hasta ${c}, incluidas las temporadas anteriores.`,
  marcar: 'Marcar',
  cancelar: 'Cancelar',
  desmarcarTitulo: (n) => `¿Desmarcar la temporada ${n}?`,
  desmarcarTexto: 'Se borrará el progreso de esta temporada.',
  desmarcar: 'Desmarcar',
  assistiEp: (c) => `Vi ${c}`,
  marcarTemporada: 'Marcar temporada',
  desmarcarTemporada: 'Desmarcar temporada',
  temporada: (n) => `Temporada ${n}`,
  codigoEp: (t, n) => `T${t} E${n}`,
  dicaSegurar: 'Mantén pulsado el círculo de un episodio para marcar hasta él.',
  creditos: 'Datos: TVmaze (CC BY-SA) · Traducción: MyMemory',
  episodio: (n) => `Episodio ${n}`,
  episodioAssistido: (c) => `${c} visto`,
  mostrarResumo: 'Muestra el resumen completo',
  traducaoAutomatica: 'Traducción automática',
  verOriginal: 'Ver original',
  verTraducao: 'Ver traducción',
  status: {
    Running: 'En emisión',
    Ended: 'Finalizada',
    'To Be Determined': 'Indefinida',
    'In Development': 'En desarrollo',
  },
  generos: {
    Action: 'Acción',
    Adventure: 'Aventura',
    Anime: 'Anime',
    Children: 'Infantil',
    Comedy: 'Comedia',
    Crime: 'Crimen',
    DIY: 'Hazlo tú mismo',
    Drama: 'Drama',
    Espionage: 'Espionaje',
    Family: 'Familia',
    Fantasy: 'Fantasía',
    Food: 'Cocina',
    History: 'Historia',
    Horror: 'Terror',
    Legal: 'Legal',
    Medical: 'Médico',
    Music: 'Música',
    Mystery: 'Misterio',
    Nature: 'Naturaleza',
    Romance: 'Romance',
    'Science-Fiction': 'Ciencia ficción',
    Sports: 'Deportes',
    Supernatural: 'Sobrenatural',
    Thriller: 'Suspenso',
    Travel: 'Viajes',
    War: 'Guerra',
    Western: 'Western',
  },
};

const DICIONARIOS: Record<IdiomaApp, Textos> = { pt, en, es };

/** Idiomas sem textos próprios caem no inglês. */
export function textosPara(codigo: string | null): Textos {
  return DICIONARIOS[codigo as IdiomaApp] ?? en;
}
