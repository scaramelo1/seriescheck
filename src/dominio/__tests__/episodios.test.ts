/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { calcularProgresso, idsAte, listarTemporadas, montarEpisodios, proximoParaAssistir } from '../episodios.ts';
import type { EpisodioTvMaze } from '../tipos.ts';

const opcoes = { hoje: '2026-10-30', encerrada: false, rotuloEpisodio: (n: number) => `Episódio ${n}` };

const ep = (id: number, season: number, number: number | null, airdate: string | null = '2020-01-01'): EpisodioTvMaze => ({
  id,
  season,
  number,
  airdate,
  name: `Ep ${id}`,
});

describe('montarEpisodios', () => {
  it('converte o episódio do TVmaze', () => {
    const [e] = montarEpisodios(
      [{ ...ep(7, 2, 3), summary: '<p>Resumo <b>forte</b>.</p>', image: { medium: 'm.jpg', original: 'o.jpg' } }],
      opcoes,
    );
    assert.deepEqual(e, {
      id: 7,
      temporada: 2,
      numero: 3,
      titulo: 'Ep 7',
      resumo: 'Resumo forte.',
      imagem: 'm.jpg',
      exibidoEm: '2020-01-01',
      liberado: true,
    });
  });

  it('ordena por temporada e número e tira especiais sem número', () => {
    const eps = montarEpisodios([ep(4, 2, 1), ep(2, 1, 2), ep(9, 1, null), ep(1, 1, 1)], opcoes);
    assert.deepEqual(eps.map((e) => e.id), [1, 2, 4]);
  });

  it('sem título usa o rótulo', () => {
    assert.equal(montarEpisodios([{ ...ep(1, 1, 5), name: '' }], opcoes)[0].titulo, 'Episódio 5');
  });

  it('data futura não libera; hoje libera', () => {
    const eps = montarEpisodios([ep(1, 1, 1, '2026-10-30'), ep(2, 1, 2, '2026-10-31')], opcoes);
    assert.deepEqual(eps.map((e) => e.liberado), [true, false]);
  });

  it('sem data, só libera em série encerrada', () => {
    assert.equal(montarEpisodios([ep(1, 1, 1, '')], opcoes)[0].liberado, false);
    assert.equal(montarEpisodios([ep(1, 1, 1, null)], { ...opcoes, encerrada: true })[0].liberado, true);
  });
});

describe('progresso', () => {
  const eps = montarEpisodios([ep(1, 1, 1), ep(2, 1, 2), ep(3, 2, 1), ep(4, 2, 2, '2030-01-01'), ep(5, 3, 1, null)], opcoes);

  it('lista as temporadas uma vez cada', () => {
    assert.deepEqual(listarTemporadas(eps), [1, 2, 3]);
  });

  it('calcula percentual sem arredondar para 100 antes do fim', () => {
    assert.equal(calcularProgresso(999, 1000).percentual, 99);
    assert.equal(calcularProgresso(0, 0).percentual, 0);
    assert.equal(calcularProgresso(3, 2).percentual, 100);
  });

  it('acha o próximo liberado, atravessando temporadas', () => {
    assert.equal(proximoParaAssistir(eps, new Set([1, 2]))?.id, 3);
    assert.equal(proximoParaAssistir(eps, new Set([1, 2, 3])), null);
  });

  it('marcar até aqui inclui temporadas anteriores e ignora não liberados', () => {
    assert.deepEqual(idsAte(eps, eps[2]), [1, 2, 3]);
    assert.deepEqual(idsAte(eps, eps[4]), [1, 2, 3]);
  });
});
