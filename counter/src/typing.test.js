import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { DOMParser } from '@xmldom/xmldom';

test('greeting pops in each character once and remains visible', async () => {
  const svg = await readFile(new URL('../../assets/typing.svg', import.meta.url), 'utf8');
  const errors = [];
  const document = new DOMParser({ onError: (_level, message) => errors.push(message) }).parseFromString(svg, 'image/svg+xml');
  assert.deepEqual(errors, []);
  assert.equal(document.getElementsByTagName('title')[0].textContent, "Hi ~ I'm Kazuha");
  const characters = [...document.getElementsByTagName('g')].filter((group) => group.getAttribute('class') === 'greeting-char');
  assert.equal(characters.length, "Hi ~ I'm Kazuha".length);
  assert.equal(characters[0].getAttribute('style'), 'animation-delay:0.00s');
  assert.equal(characters.at(-1).getAttribute('style'), 'animation-delay:1.68s');
  assert.match(svg, /animation: greeting-pop [^;]+ backwards/);
  assert.match(svg, /100% \{ opacity: 1; transform: translateY\(0\) scale\(1\); \}/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(svg, /animation-iteration-count:\s*infinite/);
});
