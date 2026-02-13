import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [
        resolve(__dirname, 'index.html'),
        resolve(__dirname, 'anime-detail.html'),
      ],
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo?.name ?? 'chunk';
          return name === 'anime-detail' ? 'assets/anime-detail.js' : 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo?.name) return 'assets/[name]-[hash][extname]';
          if (assetInfo.name.endsWith('.css')) {
            return assetInfo.name.includes('anime-detail') ? 'assets/anime-detail.css' : 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    minify: true,
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
