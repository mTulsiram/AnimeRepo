/**
 * Render anime detail page from embedded JSON (#anime-data). Used by minimal anime/*.html pages.
 */
import pako from 'pako';

function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function toCompactText(anime) {
  const lines = [];
  const push = (k, v) => {
    if (v != null && v !== '') lines.push(`${k}:${String(v).replace(/\n/g, ' ')}`);
  };
  push('title', anime.title);
  push('type', anime.type);
  push('episodes', anime.episodes);
  push('status', anime.status);
  if (anime.animeSeason) {
    push('year', anime.animeSeason.year);
    push('season', anime.animeSeason.season);
  }
  const score = anime.score?.arithmeticMean ?? anime.payload?.score_avg ?? anime.score;
  push('score', score);
  if (anime.picture) push('picture', anime.picture);
  if (anime.synonyms?.length) push('synonyms', anime.synonyms.join('|'));
  if (anime.tags?.length) push('tags', anime.tags.slice(0, 20).join('|'));
  if (anime.sources?.length) push('sources', anime.sources.join('|'));
  return lines.join('\n');
}

function downloadCompressedText(anime) {
  const text = toCompactText(anime);
  const bytes = new TextEncoder().encode(text);
  const compressed = pako.gzip(bytes, { level: 9 });
  const blob = new Blob([compressed], { type: 'application/gzip' });
  const name = (anime.title || 'anime').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60) + '.txt.gz';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getIconForSource(url) {
  if (!url) return 'external-link-alt';
  if (url.includes('myanimelist')) return 'tv';
  if (url.includes('anilist')) return 'link';
  if (url.includes('anidb')) return 'database';
  if (url.includes('kitsu')) return 'film';
  if (url.includes('anime-planet')) return 'globe';
  if (url.includes('animenewsnetwork') || url.includes('ann')) return 'newspaper';
  return 'external-link-alt';
}

function getSourceName(url) {
  if (!url) return 'View';
  if (url.includes('myanimelist')) return 'MyAnimeList';
  if (url.includes('anilist')) return 'AniList';
  if (url.includes('anidb')) return 'AniDB';
  if (url.includes('kitsu')) return 'Kitsu';
  if (url.includes('anime-planet')) return 'Anime Planet';
  return 'View';
}

export function renderAnimeDetail(anime) {
  const root = document.getElementById('anime-root');
  if (!root) return;

  const payload = anime.payload || {};
  const scoreAvg = payload.score_avg ?? anime.score?.arithmeticMean ?? 0;
  const durationMins = payload.duration_mins ?? 0;
  const languages = payload.languages || ['Subtitled'];
  const title = anime.title || 'Unknown';
  const animeType = anime.type || 'UNKNOWN';
  const episodes = anime.episodes ?? 'Unknown';
  const status = anime.status || 'UNKNOWN';
  const season = anime.animeSeason || {};
  const year = season.year || 'N/A';
  const seasonStr = (season.season || 'N/A').toString();
  const seasonName = seasonStr.charAt(0).toUpperCase() + seasonStr.slice(1).toLowerCase();
  const picture = anime.picture || '';
  const studios = (anime.studios || []).map((s) => String(s)).join(', ') || 'Unknown';
  const producers = (anime.producers || []).map((p) => String(p)).join(', ') || 'Unknown';
  const tags = (anime.tags || []).slice(0, 15);
  const synonyms = (anime.synonyms || []).slice(0, 8);
  const sources = (anime.sources || []).slice(0, 6);

  const posterHtml = picture
    ? `<img src="${escapeHtml(picture)}" alt="">`
    : '<div style="background:#ddd;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;"><i class="fas fa-film"></i></div>';

  let sidebarCards = `
    <div class="ad-info-card ad-score-card">
      <div class="ad-score-label">Community Rating</div>
      <div class="ad-score-value">${Number(scoreAvg).toFixed(1)}</div>
      <div class="ad-score-label">/ 10.0</div>
    </div>
    <div class="ad-info-card"><div class="ad-info-card-title">Type</div><div class="ad-info-card-value">${escapeHtml(animeType)}</div></div>
    <div class="ad-info-card"><div class="ad-info-card-title">Episodes</div><div class="ad-info-card-value">${escapeHtml(String(episodes))}</div></div>
    <div class="ad-info-card"><div class="ad-info-card-title">Status</div><div class="ad-info-card-value">${escapeHtml(status)}</div></div>
  `;
  if (year !== 'N/A') sidebarCards += `<div class="ad-info-card"><div class="ad-info-card-title">Year</div><div class="ad-info-card-value">${escapeHtml(String(year))}</div></div>`;
  if (season.season) sidebarCards += `<div class="ad-info-card"><div class="ad-info-card-title">Season</div><div class="ad-info-card-value">${escapeHtml(seasonName)}</div></div>`;
  if (durationMins) sidebarCards += `<div class="ad-info-card"><div class="ad-info-card-title">Duration</div><div class="ad-info-card-value">${durationMins} min/ep</div></div>`;
  sidebarCards += `<div class="ad-info-card"><div class="ad-info-card-title">Language</div><div class="ad-info-card-value">${escapeHtml(languages.join(', '))}</div></div>`;
  sidebarCards += `
    <div class="ad-action-buttons">
      <button type="button" class="ad-btn" id="ad-download-data"><i class="fas fa-file-archive"></i> Download data (.txt.gz)</button>
      <a href="../index.html" class="ad-btn ad-btn-secondary"><i class="fas fa-arrow-left"></i> Back to Database</a>
    </div>
  `;

  let contentSections = '';
  if (anime.studios?.length) contentSections += `<div class="ad-section"><div class="ad-section-title"><i class="fas fa-building"></i> Studios</div><p>${escapeHtml(studios)}</p></div>`;
  if (anime.producers?.length) contentSections += `<div class="ad-section"><div class="ad-section-title"><i class="fas fa-handshake"></i> Producers</div><p>${escapeHtml(producers)}</p></div>`;
  if (tags.length) contentSections += `<div class="ad-section"><div class="ad-section-title"><i class="fas fa-tags"></i> Genres & Tags</div><div class="ad-tags">${tags.map((t) => `<span class="ad-tag">${escapeHtml(t)}</span>`).join('')}</div></div>`;
  if (synonyms.length) contentSections += `<div class="ad-section"><div class="ad-section-title"><i class="fas fa-globe"></i> Other Names</div><p>${escapeHtml(synonyms.join(', '))}</p></div>`;
  if (sources.length) {
    contentSections += `<div class="ad-section"><div class="ad-section-title"><i class="fas fa-stream"></i> Watch Online</div><div class="ad-links-grid">`;
    sources.forEach((src) => {
      contentSections += `<a href="${escapeHtml(src)}" target="_blank" rel="noopener" class="ad-link-card"><i class="fas fa-${getIconForSource(src)}"></i><div><h4>${escapeHtml(getSourceName(src))}</h4><p>Watch now</p></div></a>`;
    });
    contentSections += '</div></div>';
  }
  contentSections += `
    <div class="ad-footer-section">
      <h3>Support AnimeRepo</h3>
      <p style="margin:10px 0 20px 0;">Free anime database.</p>
      <a href="https://github.com/mTulsiram/AnimeRepo" target="_blank" rel="noopener">GitHub</a>
      <a href="https://github.com/mTulsiram/AnimeRepo/issues" target="_blank" rel="noopener">Report Bug</a>
    </div>
  `;

  root.innerHTML = `
    <div class="ad-navbar">
      <div class="ad-nav-back"><a href="../index.html"><i class="fas fa-arrow-left"></i> Back to Database</a></div>
    </div>
    <div class="ad-container">
      <div class="ad-hero">
        <div class="ad-hero-content">
          <div class="ad-hero-poster">${posterHtml}</div>
          <div>
            <div class="ad-hero-title">${escapeHtml(title)}</div>
            <div class="ad-hero-subtitle">${escapeHtml(animeType)} • ${episodes} episodes • ${escapeHtml(String(year))}</div>
          </div>
        </div>
      </div>
      <div class="ad-main-grid">
        <div class="ad-sidebar">${sidebarCards}</div>
        <div class="ad-content">${contentSections}</div>
      </div>
    </div>
  `;

  const downloadBtn = root.querySelector('#ad-download-data');
  if (downloadBtn) downloadBtn.addEventListener('click', () => downloadCompressedText(anime));
}
