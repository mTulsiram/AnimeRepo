/**
 * Anime quick-view modal: data, Where to watch links, download, full page
 */
import { getAnimePageUrl, escapeHtml } from './data.js';
import { downloadAnimeAsCompressedText } from './export-data.js';

let modalEl = null;

function getSourceName(url) {
  if (!url) return 'Link';
  if (url.includes('myanimelist')) return 'MyAnimeList';
  if (url.includes('anilist')) return 'AniList';
  if (url.includes('anidb')) return 'AniDB';
  if (url.includes('kitsu')) return 'Kitsu';
  if (url.includes('anime-planet')) return 'Anime Planet';
  return 'Details';
}

function createModal() {
  const root = document.getElementById('modal-root');
  if (!root) return null;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">Anime</h2>
        <button type="button" class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" id="modal-download-data">
          <i class="fas fa-file-archive"></i> Download data
        </button>
        <a href="#" class="btn btn-secondary" id="modal-full-page" target="_blank" rel="noopener">
          <i class="fas fa-external-link-alt"></i> Full page
        </a>
      </div>
    </div>
  `;
  root.appendChild(overlay);
  modalEl = overlay;

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', onKeydown);

  return overlay;
}

function onKeydown(e) {
  if (e.key === 'Escape' && modalEl) closeModal();
}

function closeModal() {
  if (!modalEl) return;
  document.removeEventListener('keydown', onKeydown);
  modalEl.remove();
  modalEl = null;
}

function renderBody(anime) {
  const score = anime.score && typeof anime.score === 'object' ? anime.score.arithmeticMean : anime.score;
  const season = anime.animeSeason || {};
  const episodes = anime.episodes ?? '?';
  const type = anime.type || '—';
  const year = season.year || '—';
  const status = anime.status || '—';
  const studios = (anime.studios || []).slice(0, 3).join(', ') || '—';
  const tags = (anime.tags || []).slice(0, 12).join(', ') || '—';
  const synonyms = (anime.synonyms || []).slice(0, 4).join(', ') || '—';
  const sources = (anime.sources || []).slice(0, 6);

  const titleForSearch = encodeURIComponent((anime.title || '').trim());
  const crunchyrollSearch = `https://www.crunchyroll.com/search?q=${titleForSearch}`;
  const justWatchSearch = `https://www.justwatch.com/us/search?q=${titleForSearch}`;

  const body = modalEl.querySelector('.modal-body');
  body.innerHTML = '';
  const poster = anime.picture
    ? `<img class="modal-poster" src="${escapeHtml(anime.picture)}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';
  let watchSection = '';
  if (sources.length > 0) {
    watchSection = `
      <div class="modal-section">
        <h3 class="modal-section-title"><i class="fas fa-play-circle"></i> Where to watch & details</h3>
        <p class="modal-section-desc">Open database links for info and streaming availability.</p>
        <div class="modal-watch-links">
          ${sources.map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="modal-watch-btn">${escapeHtml(getSourceName(url))}</a>`).join('')}
        </div>
        <div class="modal-stream-search">
          <a href="${escapeHtml(crunchyrollSearch)}" target="_blank" rel="noopener" class="modal-stream-link"><i class="fas fa-tv"></i> Search Crunchyroll</a>
          <a href="${escapeHtml(justWatchSearch)}" target="_blank" rel="noopener" class="modal-stream-link"><i class="fas fa-search"></i> Find on JustWatch</a>
        </div>
      </div>
    `;
  }
  body.innerHTML = `
    ${poster}
    <p class="modal-meta">${escapeHtml(type)} · ${episodes} eps · ${year}${status !== '—' ? ' · ' + escapeHtml(status) : ''}</p>
    <dl class="modal-dl">
      <dt>Score</dt>
      <dd>${score != null ? Number(score).toFixed(1) : '—'}/10</dd>
      <dt>Studios</dt>
      <dd>${escapeHtml(studios)}</dd>
      <dt>Tags</dt>
      <dd>${escapeHtml(tags)}</dd>
      <dt>Other names</dt>
      <dd>${escapeHtml(synonyms)}</dd>
    </dl>
    ${watchSection}
  `;

  const titleEl = modalEl.querySelector('#modal-title');
  titleEl.textContent = anime.title || 'Anime';

  const fullPageLink = modalEl.querySelector('#modal-full-page');
  fullPageLink.href = getAnimePageUrl(anime.title);

  const downloadBtn = modalEl.querySelector('#modal-download-data');
  downloadBtn.onclick = () => {
    downloadAnimeAsCompressedText(anime, true);
  };
}

/**
 * Open modal with anime data (lightweight - no full page load)
 */
export function openAnimeModal(anime) {
  if (!modalEl) createModal();
  if (!modalEl) return;
  renderBody(anime);
  modalEl.style.display = 'flex';
  modalEl.querySelector('.modal-close').focus();
}
