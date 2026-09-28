import assert from 'node:assert/strict';
import test from 'node:test';
import { DOMParser } from '@xmldom/xmldom';
import { ROSTER } from './roster.js';
import { nineDigits, parseOffset, renderCounterSvg } from './render.js';
import { renderProfileSvg } from './profile.js';

test('nineDigits pads, applies the optional offset, and clamps overflow', () => {
  assert.equal(nineDigits(0), '000000000');
  assert.equal(nineDigits(981254), '000981254');
  assert.equal(nineDigits(0, 981254), '000981254');
  assert.equal(nineDigits(999_999_999), '999999999');
  assert.equal(nineDigits(999_999_999, 1), '999999999');
  assert.equal(parseOffset(undefined), 0);
  assert.equal(parseOffset('981254'), 981254);
  assert.throws(() => parseOffset('-1'));
  assert.throws(() => parseOffset('1.5'));
});

test('SVG is parseable and maps nine digits to nine Pokémon in fixed order', () => {
  const errors = [];
  const svg = renderCounterSvg(981254);
  const document = new DOMParser({
    onError: (_level, message) => errors.push(message),
  }).parseFromString(svg, 'image/svg+xml');
  assert.deepEqual(errors, []);
  assert.equal(document.documentElement.tagName, 'svg');
  assert.equal(document.documentElement.getAttribute('data-count'), '000981254');
  const groups = [...document.getElementsByTagName('g')];
  const pokemon = groups.filter((group) => group.hasAttribute('data-pokemon'));
  const cards = groups.filter((group) => group.hasAttribute('data-digit'));
  assert.deepEqual(pokemon.map((group) => group.getAttribute('data-pokemon')), ROSTER.map((member) => member.name));
  assert.equal(cards.map((group) => group.getAttribute('data-digit')).join(''), '000981254');
  assert.equal(document.getElementsByTagName('image').length, 9);
  assert.equal(document.getElementsByTagName('path').length, 18);
  assert.ok(svg.includes('prefers-reduced-motion'));
  assert.ok(svg.includes('image-rendering="pixelated"'));
});

test('profile SVG contains a complete greeting and the dynamic nine-sprite counter', () => {
  const errors = [];
  const svg = renderProfileSvg(981254);
  const document = new DOMParser({
    onError: (_level, message) => errors.push(message),
  }).parseFromString(svg, 'image/svg+xml');
  assert.deepEqual(errors, []);
  assert.equal(document.documentElement.getAttribute('data-count'), '000981254');
  assert.match(document.documentElement.getAttribute('aria-label'), /Hi ~ I'm Kazuha/);
  assert.match(document.getElementsByTagName('text')[0].textContent, /学习中/);
  const groups = [...document.getElementsByTagName('g')];
  assert.equal(groups.filter((group) => group.hasAttribute('data-pokemon')).length, 9);
  assert.equal(groups.filter((group) => group.getAttribute('class') === 'greeting-char').length, "Hi ~ I'm Kazuha".length);
  assert.match(svg, /@keyframes greeting-pop/);
  assert.match(svg, /translate\(485 39\) scale\(0\.9\)/);
});
