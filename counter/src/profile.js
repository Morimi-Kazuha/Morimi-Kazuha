import { GREETING_ART, GREETING_CSS } from './greeting.generated.js';
import { nineDigits, renderCounterSvg } from './render.js';

export function renderProfileSvg(count, offset = 0) {
  const digits = nineDigits(count, offset);
  const counter = renderCounterSvg(count, offset).replace(/^<\?xml[^>]*\?>\s*/, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="245" viewBox="0 0 1200 245" role="img" aria-label="Hi ~ I'm Kazuha. 学习中. Pokémon visitor counter ${digits}" data-count="${digits}">
  <title>Hi ~ I'm Kazuha · Pokémon visitor counter</title>
  <style>${GREETING_CSS}</style>
  <g transform="translate(40 40) scale(0.9)" fill="#0878d4" shape-rendering="crispEdges">${GREETING_ART}</g>
  <text x="45" y="140" fill="#24292f" font-family="Arial, sans-serif" font-size="27">学习中...</text>
  <g transform="translate(485 39) scale(0.9)">${counter}</g>
</svg>`;
}
