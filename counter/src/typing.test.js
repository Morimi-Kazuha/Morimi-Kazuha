import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { DOMParser } from '@xmldom/xmldom';

test('greeting asset always shows every character', async () => {
  const svg = await readFile(new URL('../../assets/typing.svg', import.meta.url), 'utf8');
  const errors = [];
  const document = new DOMParser({ onError: (_level, message) => errors.push(message) }).parseFromString(svg, 'image/svg+xml');
  assert.deepEqual(errors, []);
  assert.equal(document.getElementsByTagName('title')[0].textContent, "Hi ~ I'm Kazuha");
  const characters = [...document.getElementsByTagName('g')].filter((group) => group.getAttribute('class') === 'char');
  assert.equal(characters.length, "Hi ~ I'm Kazuha".length);
  assert.doesNotMatch(svg, /opacity:\s*0/);
  assert.doesNotMatch(svg, /animation|visibility:\s*hidden/);
});
