/**
 * Filter logic for anime list - works with anime-offline-database (tags lowercase, type/status exact).
 */
import { getAnimeLanguages } from './data.js';

const DECADE_YEARS = ['1990', '2000', '2010']; // these mean "decade"; others are single year

export function applyFilters(allAnime, opts) {
  const { type, genre, yearVal, status, language, searchQuery } = opts;

  return allAnime.filter((anime) => {
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchTitle = (anime.title || '').toLowerCase().includes(q);
      const matchSyn = (anime.synonyms || []).some((s) => String(s).toLowerCase().includes(q));
      if (!matchTitle && !matchSyn) return false;
    }
    if (type && (anime.type || '').toUpperCase() !== type.toUpperCase()) return false;

    const tags = (anime.tags || []).map((t) => String(t).toLowerCase());
    const genreNorm = genre ? genre.trim().toLowerCase() : '';
    const genreMatch = !genreNorm || tags.some((t) => t.includes(genreNorm));
    if (!genreMatch) return false;

    if (yearVal && yearVal.trim()) {
      const y = anime.animeSeason && anime.animeSeason.year != null ? Number(anime.animeSeason.year) : null;
      if (y == null) return false;
      const yVal = yearVal.trim();
      const decade = parseInt(yVal, 10);
      if (DECADE_YEARS.includes(yVal)) {
        if (y < decade || y >= decade + 10) return false;
      } else {
        if (y !== decade) return false;
      }
    }
    if (status && (anime.status || '').toUpperCase() !== status.toUpperCase()) return false;

    const langs = getAnimeLanguages(anime.title);
    if (language === 'English' && !langs.some((l) => l.toLowerCase().includes('english'))) return false;
    if (language === 'Hindi' && !langs.some((l) => l.toLowerCase().includes('hindi'))) return false;
    if (language === 'Subtitled' && !langs.some((l) => l.toLowerCase().includes('subtitled'))) return false;

    return true;
  });
}
