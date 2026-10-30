import { getLocales } from 'expo-localization';

import { textosPara } from './textos';

// Lido ao abrir o app; quem troca o idioma do celular vê a mudança ao reabrir.
const [local] = getLocales();

export const idiomaCelular = local.languageTag;
export const codigoIdioma = local.languageCode;
export const regiaoCelular = local.regionCode;
export const t = textosPara(codigoIdioma);

/** As sinopses vêm em inglês; nos outros idiomas passam pela tradução automática. */
export const precisaTraduzir = codigoIdioma !== 'en';

export const nomeStatus = (status: string | null) => (status ? (t.status[status] ?? status) : null);
export const nomeGenero = (genero: string) => t.generos[genero] ?? genero;
