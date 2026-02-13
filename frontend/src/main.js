/**
 * AnimeRepo v4 - Main entry. No inline scripts; all logic in modules.
 */
import { loadAnimeData, escapeHtml } from './js/data.js';
import { applyFilters } from './js/filters.js';
import { openAnimeModal } from './js/modal.js';

let allAnime = [];
let filteredAnime = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 24;

const $ = (id) => document.getElementById(id);

function showLoading(show) {
  const el = $('loading');
  if (el) el.style.display = show ? 'block' : 'none';
}

function renderGrid() {
  const grid = $('animeGrid');
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageAnime = filteredAnime.slice(start, end);

  if (pageAnime.length === 0) {
    grid.innerHTML = '';
    const empty = $('emptyState');
    if (empty) empty.style.display = 'block';
    const countEl = $('resultCount');
    if (countEl) countEl.textContent = '0';
    renderPagination(0);
    return;
  }

  const empty = $('emptyState');
  if (empty) empty.style.display = 'none';

  grid.innerHTML = pageAnime
    .map(
      (anime) => `
    <article class="anime-card" role="listitem" data-anime-index="${allAnime.indexOf(anime)}">
      <div class="anime-poster">
        ${anime.picture ? `<img src="${escapeHtml(anime.picture)}" alt="" loading="lazy" onerror="this.style.display='none';var n=this.nextElementSibling;if(n)n.style.display='flex';"><i class="fas fa-film poster-fallback" aria-hidden="true"></i>` : '<i class="fas fa-film" aria-hidden="true"></i>'}
      </div>
      <div class="anime-info">
        <div class="anime-title">${escapeHtml(anime.title)}</div>
        <div class="anime-meta">
          <span>${anime.type || '—'}</span>
          <span>${anime.episodes ?? '?'} eps</span>
        </div>
        <div class="anime-rating">
          <i class="fas fa-star"></i>
          ${anime.score?.arithmeticMean != null ? Number(anime.score.arithmeticMean).toFixed(1) : 'N/A'}
        </div>
      </div>
    </article>
  `
    )
    .join('');

  const countEl = $('resultCount');
  if (countEl) countEl.textContent = filteredAnime.length;

  renderPagination(filteredAnime.length);

  grid.querySelectorAll('.anime-card').forEach((card, i) => {
    const anime = pageAnime[i];
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openAnimeModal(anime);
    });
  });
}

function renderPagination(total) {
  const container = $('pagination');
  container.innerHTML = '';
  const pages = Math.ceil(total / ITEMS_PER_PAGE);
  if (pages <= 1) return;
  const maxButtons = 10;
  for (let i = 1; i <= Math.min(pages, maxButtons); i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderGrid();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(btn);
  }
}

function runFilters() {
  currentPage = 1;
  const searchQuery = ($('searchInput') && $('searchInput').value) || '';
  filteredAnime = applyFilters(allAnime, {
    type: ($('typeFilter') && $('typeFilter').value) || '',
    genre: ($('genreFilter') && $('genreFilter').value) || '',
    yearVal: ($('yearFilter') && $('yearFilter').value) || '',
    status: ($('statusFilter') && $('statusFilter').value) || '',
    language: ($('languageFilter') && $('languageFilter').value) || '',
    searchQuery,
  });
  renderGrid();
}

function bindUi() {
  const selectors = ['typeFilter', 'genreFilter', 'yearFilter', 'statusFilter', 'languageFilter'];
  selectors.forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('change', runFilters);
  });

  const searchBtn = $('searchBtn');
  const searchInput = $('searchInput');
  if (searchBtn) searchBtn.addEventListener('click', runFilters);
  if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') runFilters(); });

  const clearBtn = $('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selectors.forEach((id) => { const e = $(id); if (e) e.value = ''; });
      if (searchInput) searchInput.value = '';
      filteredAnime = allAnime;
      currentPage = 1;
      renderGrid();
    });
  }

  const gridView = $('gridView');
  const listView = $('listView');
  const animeGrid = $('animeGrid');
  if (gridView) gridView.addEventListener('click', () => { gridView.classList.add('active'); listView?.classList.remove('active'); animeGrid?.classList.remove('list-view'); gridView?.setAttribute('aria-pressed', 'true'); listView?.setAttribute('aria-pressed', 'false'); });
  if (listView) listView.addEventListener('click', () => { listView.classList.add('active'); gridView?.classList.remove('active'); animeGrid?.classList.add('list-view'); listView?.setAttribute('aria-pressed', 'true'); gridView?.setAttribute('aria-pressed', 'false'); });

  const navToggle = $('navToggle');
  const navLinks = $('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.querySelector('i')?.classList.toggle('fa-bars', !open);
      navToggle.querySelector('i')?.classList.toggle('fa-times', open);
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => { navLinks.classList.remove('open'); navToggle?.setAttribute('aria-expanded', 'false'); navToggle?.querySelector('i')?.classList.toggle('fa-bars', true); navToggle?.querySelector('i')?.classList.toggle('fa-times', false); });
    });
  }
}

async function init() {
  showLoading(true);
  try {
    allAnime = await loadAnimeData();
    filteredAnime = allAnime;
    const statCount = $('statCount');
    if (statCount) statCount.textContent = allAnime.length.toLocaleString() + '+';
    bindUi();
    renderGrid();
  } catch (err) {
    console.error(err);
    const loading = $('loading');
    if (loading) loading.innerHTML = '<p style="color:red;">Failed to load data. Check console.</p>';
  } finally {
    showLoading(false);
  }
}

init();
