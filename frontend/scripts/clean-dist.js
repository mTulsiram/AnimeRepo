/**
 * Remove dist folder so Vite build doesn't hit EEXIST on Windows.
 */
import { rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
  console.log('Cleaned dist/');
}
