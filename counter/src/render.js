import { ROSTER } from './roster.js';
import { SPRITES } from './sprites.generated.js';

export const MAX_DISPLAY_COUNT = 999_999_999;

const BITMAP_DIGITS = [
  ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
];

export function parseOffset(raw) {
  const value = raw === undefined ? 0 : Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('COUNTER_OFFSET must be a non-negative safe integer');
  }
  return value;
}

export function nineDigits(count, offset = 0) {
  if (!Number.isSafeInteger(count) || count < 0 || !Number.isSafeInteger(offset) || offset < 0) {
    throw new Error('Counter and offset must be non-negative safe integers');
  }
  return String(Math.min(MAX_DISPLAY_COUNT, count + offset)).padStart(9, '0');
}

function digitPath(digit) {
  const pixels = BITMAP_DIGITS[Number(digit)];
  const commands = [];
  for (let row = 0; row < pixels.length; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      if (pixels[row][column] === '1') {
        commands.push(`M${11 + column * 3} ${8 + row * 3}h3v3h-3z`);
      }
    }
  }
  return commands.join('');
}

function spriteGroup(member) {
  const [left, top, right, bottom] = member.bounds;
  const imageX = member.center - ((left + right) / 2) * member.scale;
  const imageY = 190 - bottom * member.scale;
  const cardY = imageY + top * member.scale - 48;
  const sprite = SPRITES[member.name];
  if (!sprite) throw new Error(`Missing sprite: ${member.name}`);
  return { imageX, imageY, cardY, sprite };
}

export function renderCounterSvg(count, offset = 0) {
  const digits = nineDigits(count, offset);
  const members = ROSTER.map((member, index) => {
    const { imageX, imageY, cardY, sprite } = spriteGroup(member);
    const digit = digits[index];
    return `<g data-pokemon="${member.name}">
  <rect x="${member.center - 18}" y="191" width="36" height="2" fill="#d5dce7"/>
  <g transform="translate(${imageX.toFixed(2)} ${imageY.toFixed(2)})">
    <g class="pokemon" style="animation-duration:${member.duration}s;animation-delay:-${member.delay}s">
      <image href="${sprite}" width="${(96 * member.scale).toFixed(2)}" height="${(96 * member.scale).toFixed(2)}" image-rendering="pixelated"/>
    </g>
  </g>
  <g transform="translate(${member.center - 19} ${cardY.toFixed(2)})">
    <g class="digit-card" data-digit="${digit}" style="animation-duration:${member.duration + 0.7}s;animation-delay:-${member.delay + 0.35}s">
      <rect x="1" y="2" width="38" height="37" fill="#aab6c7"/>
      <path d="M2 0H36V2H38V34H36V36H23L19 42L15 36H2V34H0V2H2Z" fill="#ffffff" stroke="#151d2b" stroke-width="2" stroke-linejoin="miter"/>
      <path d="${digitPath(digit)}" fill="#0b1018"/>
    </g>
  </g>
</g>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="790" height="198" viewBox="0 0 790 198" role="img" aria-label="Pokémon visitor counter ${digits}" data-count="${digits}">
  <title>Pokémon visitor counter</title>
  <style>
    .pokemon { animation-name: bob; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
    .digit-card { animation-name: card-bob; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
    @keyframes card-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
    @media (prefers-reduced-motion: reduce) { .pokemon, .digit-card { animation: none; } }
  </style>
${members}
</svg>`;
}
