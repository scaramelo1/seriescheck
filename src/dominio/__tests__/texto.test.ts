/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { dividirTexto, formatarData, limparSinopse } from '../texto.ts';
import { textosPara } from '../../i18n/textos.ts';

describe('texto', () => {
  it('limpa HTML da sinopse', () => {
    assert.equal(limparSinopse('A <i>Death Note</i>&amp;co.<br>\n<br>\n<br>Fim'), 'A Death Note&co.\n\nFim');
    assert.equal(limparSinopse('<p>Um <b>dois</b>.</p><p>Três.</p>'), 'Um dois.\n\nTrês.');
    assert.equal(limparSinopse(null), '');
  });

  it('formata data no idioma do celular', () => {
    assert.equal(formatarData('2024-03-09', 'pt-BR'), '09/03/2024');
    assert.equal(formatarData('2024-03-09', 'en-US'), '03/09/2024');
  });

  it('divide textos longos sem perder conteúdo nem passar do limite', () => {
    const texto = `${'Uma frase curta. '.repeat(40)}${'x'.repeat(700)} Fim.`;
    const blocos = dividirTexto(texto);
    assert.ok(blocos.length > 2);
    assert.ok(blocos.every((b) => b.length <= 450 && b.length > 0));
    assert.equal(blocos.join('').replace(/\s/g, ''), texto.replace(/\s/g, ''));
  });

  it('texto curto fica inteiro', () => {
    assert.deepEqual(dividirTexto('Oi. Tudo bem?'), ['Oi. Tudo bem?']);
    assert.deepEqual(dividirTexto(''), []);
  });
});

describe('textos do app', () => {
  it('idioma sem tradução própria cai no inglês', () => {
    assert.equal(textosPara('ja').abaLista, 'My list');
    assert.equal(textosPara(null).abaLista, 'My list');
    assert.equal(textosPara('pt').abaLista, 'Minha lista');
    assert.equal(textosPara('es').abaLista, 'Mi lista');
  });
});
