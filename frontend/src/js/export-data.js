/**
 * Compress anime data and trigger download (Gzip) - no server needed
 */
import pako from 'pako';

/**
 * @param {object} data - Any JSON-serializable object (e.g. one anime or array)
 * @param {string} filename - e.g. "anime-Death-Note.txt" or "anime-export.json"
 * @param {boolean} gzip - If true, compress with gzip and use .gz extension
 */
export function downloadCompressedData(data, filename = 'anime-data.json', gzip = true) {
  const json = JSON.stringify(data, null, 0);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(json);

  if (gzip) {
    const compressed = pako.gzip(bytes, { level: 9 });
    const blob = new Blob([compressed], { type: 'application/gzip' });
    const name = filename.replace(/\.(json|txt)$/i, '') + '.json.gz';
    triggerDownload(blob, name);
  } else {
    const blob = new Blob([bytes], { type: 'application/json' });
    triggerDownload(blob, filename);
  }
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * One-line compact text format for parsing: key:value pairs, one per line
 */
export function toCompactText(anime) {
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
  const score = anime.score && typeof anime.score === 'object' ? anime.score.arithmeticMean : anime.score;
  push('score', score);
  if (anime.picture) push('picture', anime.picture);
  if (anime.synonyms && anime.synonyms.length) push('synonyms', anime.synonyms.join('|'));
  if (anime.tags && anime.tags.length) push('tags', anime.tags.slice(0, 20).join('|'));
  if (anime.sources && anime.sources.length) push('sources', anime.sources.join('|'));
  return lines.join('\n');
}

/**
 * Download as compressed text file (.txt.gz) for easy parsing
 */
export function downloadAnimeAsCompressedText(anime, gzip = true) {
  const text = toCompactText(anime);
  const safeName = (anime.title || 'anime').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
  const filename = `anime-${safeName}.txt`;

  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  if (gzip) {
    const compressed = pako.gzip(bytes, { level: 9 });
    const blob = new Blob([compressed], { type: 'application/gzip' });
    triggerDownload(blob, filename + '.gz');
  } else {
    const blob = new Blob([bytes], { type: 'text/plain' });
    triggerDownload(blob, filename);
  }
}
