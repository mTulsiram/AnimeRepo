/**
 * Data loading and URL helpers - matches Python generator safe filename logic
 */

export function titleToFilename(title) {
  if (!title || typeof title !== 'string') return 'Unknown.html';
  let s = title
    .replace(/\//g, '_').replace(/\\/g, '_')
    .replace(/\?/g, '').replace(/\*/g, '').replace(/:/g, '_')
    .replace(/</g, '').replace(/>/g, '').replace(/\|/g, '_')
    .replace(/["\u201C\u201D\u201F]/g, '').replace(/['\u2018\u2019\u201A\u2032]/g, '')
    .replace(/`/g, '').replace(/\u00B4/g, '')
    .trim();
  s = s.slice(0, 200);
  return s ? s + '.html' : 'Unknown.html';
}

export function getAnimePageUrl(title) {
  return 'anime/' + encodeURIComponent(titleToFilename(title));
}

export let languageDubs = { english_dubbed: [], hindi_dubbed: [] };

export function getAnimeLanguages(title) {
  const t = (title || '').trim();
  const eng = (languageDubs.english_dubbed || []).indexOf(t) >= 0;
  const hin = (languageDubs.hindi_dubbed || []).indexOf(t) >= 0;
  if (eng && hin) return ['English Dubbed', 'Hindi Dubbed'];
  if (eng) return ['English Dubbed'];
  if (hin) return ['Hindi Dubbed'];
  return ['Subtitled'];
}

const DATA_URL = 'anime-offline-database-minified.json';
const LANG_URL = 'language_dubs.json';

export async function loadAnimeData() {
  const [dataRes, langRes] = await Promise.all([
    fetch(DATA_URL),
    fetch(LANG_URL).catch(() => null),
  ]);
  if (!dataRes.ok) throw new Error('Failed to load anime data');
  const data = await dataRes.json();
  const list = Array.isArray(data) ? data : (data.data || data.anime || []);
  if (langRes && langRes.ok) {
    languageDubs = await langRes.json();
  }
  return list;
}

export function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}
