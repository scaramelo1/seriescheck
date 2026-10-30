import type { SQLiteDatabase } from 'expo-sqlite';

import type { Episodio, Serie } from '../dominio/tipos';

export interface SerieNaLista {
  serie: Serie;
  assistidos: number;
  total: number;
  ultimoEm: string;
}

interface LinhaEpisodio {
  id: number;
  temporada: number;
  numero: number;
  titulo: string;
  resumo: string;
  imagem: string | null;
  exibido_em: string | null;
  liberado: number;
}

// Durante uma transação exclusiva, outra escrita aborta com "database is locked"
// (ex.: marcar um episódio enquanto o cache de uma série longa grava). Por isso escritas vão em fila.
let fila: Promise<unknown> = Promise.resolve();
function emFila<T>(escrita: () => Promise<T>): Promise<T> {
  const resultado = fila.then(escrita, escrita);
  fila = resultado.catch(() => undefined);
  return resultado;
}

/** Só grava episódios quando a API trouxe algum, para não perder o cache offline. */
export function salvarSerie(db: SQLiteDatabase, serie: Serie, episodios: Episodio[]) {
  return emFila(() => db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(
      `INSERT INTO serie (id, dados, total_conhecido) VALUES (?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         dados = excluded.dados,
         total_conhecido = CASE WHEN excluded.total_conhecido > 0 THEN excluded.total_conhecido ELSE total_conhecido END,
         atualizado_em = CURRENT_TIMESTAMP`,
      serie.id,
      JSON.stringify(serie),
      episodios.length,
    );
    if (episodios.length === 0) return;
    await txn.runAsync('DELETE FROM episodio WHERE serie_id = ?', serie.id);
    const inserir = await txn.prepareAsync(
      `INSERT OR REPLACE INTO episodio (id, serie_id, temporada, numero, titulo, resumo, imagem, exibido_em, liberado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      for (const ep of episodios) {
        await inserir.executeAsync(
          ep.id,
          serie.id,
          ep.temporada,
          ep.numero,
          ep.titulo,
          ep.resumo,
          ep.imagem,
          ep.exibidoEm,
          ep.liberado ? 1 : 0,
        );
      }
    } finally {
      await inserir.finalizeAsync();
    }
  }));
}

export async function obterSerieSalva(
  db: SQLiteDatabase,
  id: number,
): Promise<{ serie: Serie; episodios: Episodio[] } | null> {
  const linha = await db.getFirstAsync<{ dados: string }>('SELECT dados FROM serie WHERE id = ?', id);
  if (!linha) return null;
  const episodios = await db.getAllAsync<LinhaEpisodio>(
    'SELECT * FROM episodio WHERE serie_id = ? ORDER BY temporada, numero',
    id,
  );
  return {
    serie: JSON.parse(linha.dados) as Serie,
    episodios: episodios.map((e) => ({
      id: e.id,
      temporada: e.temporada,
      numero: e.numero,
      titulo: e.titulo,
      resumo: e.resumo,
      imagem: e.imagem,
      exibidoEm: e.exibido_em,
      liberado: e.liberado === 1,
    })),
  };
}

export async function listarAssistidos(db: SQLiteDatabase, serieId: number): Promise<number[]> {
  const linhas = await db.getAllAsync<{ episodio_id: number }>(
    'SELECT episodio_id FROM assistido WHERE serie_id = ?',
    serieId,
  );
  return linhas.map((l) => l.episodio_id);
}

export function definirAssistido(db: SQLiteDatabase, serieId: number, episodioId: number, assistido: boolean) {
  return emFila(() =>
    assistido
      ? db.runAsync('INSERT OR IGNORE INTO assistido (episodio_id, serie_id) VALUES (?, ?)', episodioId, serieId)
      : db.runAsync('DELETE FROM assistido WHERE episodio_id = ?', episodioId),
  );
}

export function marcarVarios(db: SQLiteDatabase, serieId: number, ids: number[]) {
  return emFila(() => db.withExclusiveTransactionAsync(async (txn) => {
    const inserir = await txn.prepareAsync('INSERT OR IGNORE INTO assistido (episodio_id, serie_id) VALUES (?, ?)');
    try {
      for (const id of ids) await inserir.executeAsync(id, serieId);
    } finally {
      await inserir.finalizeAsync();
    }
  }));
}

export function desmarcarVarios(db: SQLiteDatabase, ids: number[]) {
  return emFila(() => db.withExclusiveTransactionAsync(async (txn) => {
    const apagar = await txn.prepareAsync('DELETE FROM assistido WHERE episodio_id = ?');
    try {
      for (const id of ids) await apagar.executeAsync(id);
    } finally {
      await apagar.finalizeAsync();
    }
  }));
}

/** Séries com ao menos um tick, da assistida mais recentemente à mais antiga. */
export async function listarMinhaLista(db: SQLiteDatabase): Promise<SerieNaLista[]> {
  const linhas = await db.getAllAsync<{ dados: string; assistidos: number; total: number; ultimo_em: string }>(
    `SELECT s.dados, s.total_conhecido AS total, COUNT(*) AS assistidos, MAX(m.assistido_em) AS ultimo_em
       FROM assistido m
       JOIN serie s ON s.id = m.serie_id
      GROUP BY s.id
      ORDER BY ultimo_em DESC`,
  );
  return linhas.map((l) => ({
    serie: JSON.parse(l.dados) as Serie,
    assistidos: l.assistidos,
    total: l.total,
    ultimoEm: l.ultimo_em,
  }));
}

export async function obterTraducao(db: SQLiteDatabase, texto: string, idioma: string): Promise<string | null> {
  const linha = await db.getFirstAsync<{ traduzido: string }>(
    'SELECT traduzido FROM traducao WHERE texto = ? AND idioma = ?',
    texto,
    idioma,
  );
  return linha?.traduzido ?? null;
}

export function salvarTraducao(db: SQLiteDatabase, texto: string, idioma: string, traduzido: string) {
  return emFila(() =>
    db.runAsync('INSERT OR REPLACE INTO traducao (texto, idioma, traduzido) VALUES (?, ?, ?)', texto, idioma, traduzido),
  );
}
