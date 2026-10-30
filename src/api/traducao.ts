import { dividirTexto, limparSinopse } from '../dominio/texto.ts';

interface RespostaMyMemory {
  responseStatus: number | string;
  quotaFinished: boolean | null;
  responseData: { translatedText: string | null };
}

/**
 * Traduz do inglês pelo MyMemory (sem chave, cerca de 5.000 caracteres por dia e
 * por aparelho). Devolve null em qualquer falha: o app então mostra o original.
 */
export async function traduzir(texto: string, idioma: string): Promise<string | null> {
  try {
    const partes: string[] = [];
    for (const bloco of dividirTexto(texto)) {
      const parametros = `q=${encodeURIComponent(bloco)}&langpair=${encodeURIComponent(`en|${idioma}`)}`;
      const resposta = await fetch(`https://api.mymemory.translated.net/get?${parametros}`);
      if (!resposta.ok) return null;
      const corpo = (await resposta.json()) as RespostaMyMemory;
      const traduzido = corpo.responseData.translatedText;
      if (Number(corpo.responseStatus) !== 200 || corpo.quotaFinished || !traduzido) return null;
      partes.push(limparSinopse(traduzido));
    }
    return partes.join(' ');
  } catch {
    return null;
  }
}
