// Gera src/dados/catalogo.json. O TVmaze não tem endpoint de populares nem de melhores
// notas, só o índice completo por id; este script o percorre e guarda as maiores séries.
// Rodar de vez em quando: `npm run catalogo` (leva cerca de 5 minutos).
import { writeFileSync } from 'node:fs';

const TAMANHO = 1500;
const TIPOS = new Set(['Scripted', 'Animation', 'Reality', 'Documentary']);
const INTERVALO_MS = 600; // limite do TVmaze: 20 pedidos a cada 10 segundos

const espera = (ms) => new Promise((pronto) => setTimeout(pronto, ms));

async function pagina(numero) {
  for (;;) {
    const resposta = await fetch(`https://api.tvmaze.com/shows?page=${numero}`);
    if (resposta.status === 404) return null;
    if (resposta.status === 429) {
      await espera(10000);
      continue;
    }
    if (!resposta.ok) throw new Error(`TVmaze respondeu ${resposta.status} na página ${numero}`);
    return resposta.json();
  }
}

const series = [];
for (let numero = 0; ; numero++) {
  const lista = await pagina(numero);
  if (!lista) break;
  for (const s of lista) {
    if (!TIPOS.has(s.type) || s.genres.includes('Adult') || !s.image?.medium) continue;
    series.push({
      id: s.id,
      titulo: s.name,
      capa: s.image.medium,
      nota: s.rating?.average ?? null,
      status: s.status,
      peso: s.weight,
    });
  }
  if (numero % 25 === 0) console.log(`página ${numero}: ${series.length} séries`);
  await espera(INTERVALO_MS);
}

series.sort((a, b) => b.peso - a.peso || (b.nota ?? 0) - (a.nota ?? 0));
const saida = new URL('../src/dados/catalogo.json', import.meta.url);
writeFileSync(saida, `[\n${series.slice(0, TAMANHO).map((s) => JSON.stringify(s)).join(',\n')}\n]\n`);
console.log(`salvas ${Math.min(TAMANHO, series.length)} de ${series.length} séries`);
