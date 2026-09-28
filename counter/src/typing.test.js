import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { DOMParser } from '@xmldom/xmldom';

test('typing asset contains one-shot per-character pixel reveal and reduced-motion fallback', async () => {
  const svg = await readFile(new URL('../../assets/typing.svg', import.meta.url), 'utf8');
  const errors = [];
  const document = new DOMParser({ onError: (_level, message) => errors.push(message) }).parseFromString(svg, 'image/svg+xml');
  assert.deepEqual(errors, []);
  assert.equal(document.getElementsByTagName('title')[0].textContent, "Hi ~ I'm Kazuha");
  const characters = [...document.getElementsByTagName('g')].filter((group) => group.getAttribute('class') === 'char');
  assert.equal(characters.length, "Hi ~ I'm Kazuha".length);
  assert.equal(characters[0].getAttribute('style'), 'animation-delay:0.00s');
  assert.equal(characters.at(-1).getAttribute('style'), 'animation-delay:2.10s');
  assert.match(svg, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(svg, /animation-iteration-count:\s*infinite/);
});
