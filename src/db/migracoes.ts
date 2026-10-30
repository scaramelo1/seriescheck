import type { SQLiteDatabase } from 'expo-sqlite';

const VERSAO_ATUAL = 1;

/** Passado como onInit do SQLiteProvider; roda a cada abertura do banco. */
export async function migrar(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');

  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ATUAL) return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- series e episodios são cache da API; assistido é o dado do usuário e
    -- fica separado para uma atualização do cache nunca apagar os ticks.
    CREATE TABLE serie (
      id INTEGER PRIMARY KEY,
      dados TEXT NOT NULL,
      total_conhecido INTEGER NOT NULL DEFAULT 0,
      atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE episodio (
      id INTEGER PRIMARY KEY,
      serie_id INTEGER NOT NULL REFERENCES serie (id) ON DELETE CASCADE,
      temporada INTEGER NOT NULL,
      numero INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      resumo TEXT NOT NULL DEFAULT '',
      imagem TEXT,
      exibido_em TEXT,
      liberado INTEGER NOT NULL
    );

    CREATE INDEX episodio_serie ON episodio (serie_id, temporada, numero);

    CREATE TABLE assistido (
      episodio_id INTEGER PRIMARY KEY,
      serie_id INTEGER NOT NULL,
      assistido_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX assistido_serie ON assistido (serie_id);

    -- Traduções automáticas, para não gastar a cota diária com o mesmo texto.
    CREATE TABLE traducao (
      texto TEXT NOT NULL,
      idioma TEXT NOT NULL,
      traduzido TEXT NOT NULL,
      PRIMARY KEY (texto, idioma)
    ) WITHOUT ROWID;

    PRAGMA user_version = ${VERSAO_ATUAL};
  `);
}
