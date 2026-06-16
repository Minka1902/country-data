import { countries } from './generated/countries';
import type { Country } from './types';

export interface SearchOptions {
  /** Maximum number of results to return. Default: all matches. */
  limit?: number;
  /** Minimum score in the range 0–1 for a result to be included. Default: 0.4. */
  threshold?: number;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .trim()
    .toLowerCase();
}

/** Normalized Levenshtein distance between two strings. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1]! + 1,
        prev[j]! + 1,
        prev[j - 1]! + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length]!;
}

/** Score a query against a single candidate string, 0 (no match) to 1 (exact). */
function scoreString(query: string, candidate: string): number {
  if (!candidate) return 0;
  if (candidate === query) return 1;
  if (candidate.startsWith(query)) return 0.95;
  if (candidate.includes(query)) return 0.85;
  const dist = levenshtein(query, candidate);
  const sim = 1 - dist / Math.max(query.length, candidate.length);
  return sim;
}

function candidates(c: Country): string[] {
  const out = [c.name.common, c.name.official, ...c.altSpellings];
  for (const n of Object.values(c.name.nativeName)) {
    out.push(n.common, n.official);
  }
  return out;
}

function bestScore(query: string, c: Country): number {
  let best = 0;
  for (const cand of candidates(c)) {
    const s = scoreString(query, normalize(cand));
    if (s > best) best = s;
    if (best === 1) break;
  }
  return best;
}

/**
 * Fuzzy-search countries by name. Matches against common, official, native
 * names and alternative spellings, tolerating typos and partial input.
 * Results are sorted by descending relevance.
 */
export function searchByName(query: string, options: SearchOptions = {}): Country[] {
  const { limit, threshold = 0.4 } = options;
  const q = normalize(query);
  if (!q) return [];

  const scored: Array<{ country: Country; score: number }> = [];
  for (const c of countries) {
    const score = bestScore(q, c);
    if (score >= threshold) scored.push({ country: c, score });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score || a.country.name.common.localeCompare(b.country.name.common),
  );

  const results = scored.map((s) => s.country);
  return typeof limit === 'number' ? results.slice(0, limit) : results;
}
