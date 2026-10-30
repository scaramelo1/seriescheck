/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { paginarCatalogo, paraSerie } from '../series.ts';
import type { EntradaCatalogo, ShowTvMaze } from '../tipos.ts';

const show: ShowTvMaze = {
  id: 169,
  name: 'Breaking Bad',
  genres: ['Drama'],
  status: 'Ended',
  premiered: '2008-01-20',
  rating: { average: 9.2 },
  network: { name: 'AMC' },
  webChannel: null,
  image: { medium: 'm.jpg', original: 'o.jpg' },
  summary: '<p>Um professor.</p>',
  _embedded: {
    akas: [
      { name: 'Во все тяжкие', country: { code: 'RU' } },
      { name: 'A Química do Mal', country: { code: 'BR' } },
      { name: 'Sem país', country: null },
    ],
    images: [
      { type: 'poster', main: true, resolutions: { original: { url: 'poster.jpg' } } },
      { type: 'background', main: false, resolutions: { original: { url: 'fundo1.jpg' } } },
      { type: 'background', main: true, resolutions: { original: { url: 'fundo2.jpg' } } },
    ],
  },
};

describe('paraSerie', () => {
  it('converte o show com título da região e fundo principal', () => {
    assert.deepEqual(paraSerie(show, 'BR'), {
      id: 169,
      titulo: 'Breaking Bad',
      tituloAlternativo: 'A Química do Mal',
      capa: 'o.jpg',
      banner: 'fundo2.jpg',
      sinopse: 'Um professor.',
      canal: 'AMC',
      status: 'Ended',
      ano: 2008,
      nota: 9.2,
      generos: ['Drama'],
    });
  });

  it('tolera campos ausentes', () => {
    const s = paraSerie({ id: 1, name: 'X', network: null, webChannel: { name: 'Netflix' } }, null);
    assert.deepEqual([s.tituloAlternativo, s.capa, s.banner, s.canal, s.ano, s.sinopse], [null, null, null, 'Netflix', null, '']);
  });

  it('região sem título próprio fica sem alternativo', () => {
    assert.equal(paraSerie(show, 'FR').tituloAlternativo, null);
  });
});

describe('paginarCatalogo', () => {
  const entrada = (id: number, peso: number, nota: number | null, status = 'Ended'): EntradaCatalogo => ({
    id,
    titulo: `S${id}`,
    capa: null,
    peso,
    nota,
    status,
  });
  const catalogo = [entrada(1, 100, 8, 'Running'), entrada(2, 99, 9.5), entrada(3, 96, null), entrada(4, 50, 9.9, 'Running')];

  it('populares mantém a ordem do catálogo', () => {
    assert.deepEqual(paginarCatalogo(catalogo, 'populares', 1).series.map((s) => s.id), [1, 2, 3, 4]);
  });

  it('em exibição filtra pelo status', () => {
    assert.deepEqual(paginarCatalogo(catalogo, 'em-exibicao', 1).series.map((s) => s.id), [1, 4]);
  });

  it('melhores ignora sem nota e pouco populares, sem mexer no catálogo', () => {
    assert.deepEqual(paginarCatalogo(catalogo, 'melhores', 1).series.map((s) => s.id), [2, 1]);
    assert.equal(catalogo[0].id, 1);
  });

  it('pagina de 30 em 30', () => {
    const grande = Array.from({ length: 65 }, (_, i) => entrada(i + 1, 100, 8));
    assert.deepEqual([paginarCatalogo(grande, 'populares', 1).series.length, paginarCatalogo(grande, 'populares', 1).temMais], [30, true]);
    const ultima = paginarCatalogo(grande, 'populares', 3);
    assert.deepEqual([ultima.series.length, ultima.series[0].id, ultima.temMais], [5, 61, false]);
  });
});
