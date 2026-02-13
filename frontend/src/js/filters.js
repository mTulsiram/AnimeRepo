/**
 * Filter logic for anime list
 */
import { getAnimeLanguages } from './data.js';

export function applyFilters(allAnime, opts) {
  const { type, genre, yearVal, status, language, searchQuery } = opts;

  return allAnime.filter((anime) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (anime.title || '').toLowerCase().includes(q);
      const matchSyn = (anime.synonyms || []).some((s) => String(s).toLowerCase().includes(q));
      if (!matchTitle && !matchSyn) return false;
    }
    if (type && anime.type !== type) return false;

    const tags = anime.tags || [];
    const genreMatch = !genre || tags.some((t) => String(t).toLowerCase().includes(genre.toLowerCase()));
    if (!genreMatch) return false;

    if (yearVal) {
      const y = anime.animeSeason && anime.animeSeason.year != null ? Number(anime.animeSeason.year) : 0;
      const decade = parseInt(yearVal, 10);
      if (yearVal.length === 4) {
        if (decade >= 1990 && decade < 2010) {
          if (y < decade || y >= decade + 10) return false;
        } else if (decade >= 2010 && decade < 2030) {
          if (y < decade || y >= decade + 10) return false;
        } else if (y !== decade) return false;
      } else if (y != yearVal) return false;
    }
    if (status && anime.status !== status) return false;

    const langs = getAnimeLanguages(anime.title);
    if (language === 'English' && !langs.some((l) => l.toLowerCase().includes('english'))) return false;
    if (language === 'Hindi' && !langs.some((l) => l.toLowerCase().includes('hindi'))) return false;
    if (language === 'Subtitled' && !langs.some((l) => l.toLowerCase().includes('subtitled'))) return false;

    return true;
  });
}
