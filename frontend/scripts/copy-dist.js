/**
 * Copy Vite dist output to repo root for GitHub Pages. Keeps anime/ folder intact.
 * Run from frontend/: node scripts/copy-dist.js (or npm run deploy)
 */
import { copyFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const rootDir = join(__dirname, '..', '..');

if (!existsSync(distDir)) {
  console.error('Run npm run build first.');
  process.exit(1);
}

const assetsDir = join(distDir, 'assets');
const outAssets = join(rootDir, 'assets');
if (!existsSync(outAssets)) mkdirSync(outAssets, { recursive: true });

// Copy index.html to repo root
const indexSrc = join(distDir, 'index.html');
if (existsSync(indexSrc)) {
  copyFileSync(indexSrc, join(rootDir, 'index.html'));
  console.log('Copied index.html');
}

// Copy all assets; ensure anime-detail.js and anime-detail.css have fixed names for anime/*.html
if (existsSync(assetsDir)) {
  const files = readdirSync(assetsDir);
  let animeDetailJs = null;
  let animeDetailCss = null;
  for (const f of files) {
    const src = join(assetsDir, f);
    if (f === 'anime-detail.js') {
      copyFileSync(src, join(outAssets, 'anime-detail.js'));
      console.log('Copied assets/anime-detail.js');
    } else if (f === 'anime-detail.css') {
      copyFileSync(src, join(outAssets, 'anime-detail.css'));
      console.log('Copied assets/anime-detail.css');
    } else if (f.startsWith('anime-detail-') && f.endsWith('.js')) {
      animeDetailJs = f;
    } else if (f.startsWith('anime-detail-') && f.endsWith('.css')) {
      animeDetailCss = f;
    } else {
      copyFileSync(src, join(outAssets, f));
      console.log('Copied assets/' + f);
    }
  }
  if (animeDetailJs && !existsSync(join(outAssets, 'anime-detail.js'))) {
    copyFileSync(join(assetsDir, animeDetailJs), join(outAssets, 'anime-detail.js'));
    console.log('Copied assets/anime-detail.js (from ' + animeDetailJs + ')');
  }
  if (animeDetailCss && !existsSync(join(outAssets, 'anime-detail.css'))) {
    copyFileSync(join(assetsDir, animeDetailCss), join(outAssets, 'anime-detail.css'));
    console.log('Copied assets/anime-detail.css (from ' + animeDetailCss + ')');
  }
}

console.log('Deploy copy done. anime/ folder unchanged.');
