const ENTIDADES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

/** O TVmaze devolve sinopses e resumos com HTML simples (<p>, <b>, <br>). */
export function limparSinopse(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_, nome: string) => ENTIDADES[nome])
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Corta em blocos de até `limite` caracteres, de preferência no fim de uma frase. */
export function dividirTexto(texto: string, limite = 450): string[] {
  const blocos: string[] = [];
  let atual = '';
  for (const frase of texto.match(/[^.!?\n]*[.!?\n]*\s*/g) ?? []) {
    if (atual && atual.length + frase.length > limite) {
      blocos.push(atual.trim());
      atual = '';
    }
    atual += frase;
    while (atual.length > limite) {
      blocos.push(atual.slice(0, limite));
      atual = atual.slice(limite);
    }
  }
  if (atual.trim()) blocos.push(atual.trim());
  return blocos;
}

/** "2024-03-09" → data curta no idioma pedido; o UTC evita voltar um dia no fuso. */
export function formatarData(iso: string, idioma: string): string {
  return new Intl.DateTimeFormat(idioma, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
