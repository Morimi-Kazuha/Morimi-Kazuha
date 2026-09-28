import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = path.join(root, 'wrangler.jsonc');
try {
  await access(config);
} catch {
  await copyFile(path.join(root, 'wrangler.example.jsonc'), config);
  console.log('Created local wrangler.jsonc from the example. Set a real D1 database_id before remote deployment.');
}
