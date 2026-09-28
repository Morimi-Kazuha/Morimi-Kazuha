import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const message = "Hi ~ I'm Kazuha";
const glyphs = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  i: ['010', '000', '110', '010', '010', '010', '111'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
  '~': ['00000', '00000', '01010', '10101', '00000', '00000', '00000'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  "'": ['11', '01', '10', '00', '00', '00', '00'],
  m: ['00000', '00000', '11010', '10101', '10101', '10101', '10101'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  a: ['00000', '00000', '01110', '00001', '01111', '10001', '01111'],
  z: ['00000', '00000', '11111', '00010', '00100', '01000', '11111'],
  u: ['00000', '00000', '10001', '10001', '10001', '10011', '01101'],
  h: ['10000', '10000', '10110', '11001', '10001', '10001', '10001'],
};

let x = 0;
const groups = [...message].map((character, index) => {
  const glyph = glyphs[character];
  if (!glyph) throw new Error(`Missing glyph: ${character}`);
  const squares = [];
  for (let row = 0; row < glyph.length; row += 1) {
    for (let column = 0; column < glyph[row].length; column += 1) {
      if (glyph[row][column] === '1') {
        squares.push(`<rect x="${x + column * 4}" y="${4 + row * 4}" width="4" height="4"/>`);
      }
    }
  }
  const output = `<g class="char" style="animation-delay:${(index * 0.15).toFixed(2)}s">${squares.join('')}</g>`;
  x += glyph[0].length * 4 + 4;
  return output;
});

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="36" viewBox="0 0 ${x} 36" role="img" aria-label="${message.replace("'", '&apos;')}">
  <title>Hi ~ I'm Kazuha</title>
  <style>
    .char { fill: #0878d4; opacity: 0; shape-rendering: crispEdges; animation: reveal 1ms steps(1,end) forwards; }
    @keyframes reveal { to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .char { opacity: 1; animation: none; } }
  </style>
  ${groups.join('\n  ')}
</svg>
`;

await mkdir(path.join(root, 'assets'), { recursive: true });
await writeFile(path.join(root, 'assets', 'typing.svg'), svg);
