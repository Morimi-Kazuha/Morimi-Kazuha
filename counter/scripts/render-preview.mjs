import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { renderCounterSvg } from '../src/render.js';
import { renderProfileSvg } from '../src/profile.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = path.join(root, 'preview');
const count = Number(process.argv[2] ?? 0);
if (!Number.isSafeInteger(count) || count < 0) throw new Error('Preview count must be a non-negative integer');
await mkdir(preview, { recursive: true });

const counter = new Resvg(renderCounterSvg(count), { background: '#ffffff', imageRendering: 1 });
await writeFile(path.join(preview, 'counter.png'), counter.render().asPng());
const profileSvg = renderProfileSvg(count);
await writeFile(path.join(preview, 'profile.svg'), profileSvg);
const profile = new Resvg(profileSvg, { background: '#ffffff', imageRendering: 1 });
await writeFile(path.join(preview, 'profile.png'), profile.render().asPng());
const profileReadme = new Resvg(profileSvg, {
  background: '#ffffff',
  imageRendering: 1,
  fitTo: { mode: 'width', value: 896 },
});
await writeFile(path.join(preview, 'profile-readme.png'), profileReadme.render().asPng());

const typingPath = path.resolve(root, '..', 'assets', 'typing.svg');
const typingSvg = (await readFile(typingPath, 'utf8')).replace('opacity: 0;', 'opacity: 1;');
const typing = new Resvg(typingSvg, { background: '#ffffff' });
await writeFile(path.join(preview, 'typing.png'), typing.render().asPng());
console.log(`Rendered local previews in ${preview}`);
