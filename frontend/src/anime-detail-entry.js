/**
 * Entry for anime detail page (minimal HTML loads this + reads #anime-data)
 */
import './css/anime-detail.css';
import { renderAnimeDetail } from './anime-detail-render.js';

const dataEl = document.getElementById('anime-data');
if (dataEl) {
  try {
    const anime = JSON.parse(dataEl.textContent || '{}');
    renderAnimeDetail(anime);
  } catch (e) {
    document.body.innerHTML = '<div style="padding:20px;color:red;">Invalid anime data.</div>';
  }
}
