import type { CountryLike } from './types';

export type SortDirection = 'asc' | 'desc';

export interface SelectOptions {
  /** `'independent'` (default) keeps only sovereign states; `'all'` keeps every ISO entry. */
  scope?: 'independent' | 'all';
  /** Codes (cca2/cca3, case-insensitive) to add back regardless of scope. */
  include?: string[];
  /** Codes (cca2/cca3, case-insensitive) to remove. */
  exclude?: string[];
}

/**
 * Build a country list from a full dataset using uniform, field-based rules:
 * a scope (independent states vs every ISO entry) plus optional `include`/
 * `exclude` code lists the consumer controls. Order is preserved and entries
 * are de-duplicated.
 */
export function selectFrom<T extends CountryLike>(
  all: T[],
  options: SelectOptions = {},
): T[] {
  const { scope = 'independent', include = [], exclude = [] } = options;
  const norm = (s: string): string => s.trim().toUpperCase();
  const includeSet = new Set(include.map(norm));
  const excludeSet = new Set(exclude.map(norm));

  const seen = new Set<T>();
  const out: T[] = [];
  for (const c of all) {
    const codes = [norm(c.cca2), norm(c.cca3)];
    if (excludeSet.has(codes[0]!) || excludeSet.has(codes[1]!)) continue;
    const inScope = scope === 'all' || c.independent;
    const forced = includeSet.has(codes[0]!) || includeSet.has(codes[1]!);
    if ((inScope || forced) && !seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

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
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length]!;
}

function scoreString(query: string, candidate: string): number {
  if (!candidate) return 0;
  if (candidate === query) return 1;
  if (candidate.startsWith(query)) return 0.95;
  if (candidate.includes(query)) return 0.85;
  const dist = levenshtein(query, candidate);
  return 1 - dist / Math.max(query.length, candidate.length);
}

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Build a Unicode emoji flag from an alpha-2 code, e.g. `"ZA"` → `🇿🇦`.
 * Dataset-independent. Returns `undefined` if the input is not two ASCII letters.
 */
export function emojiFlag(cca2: string): string | undefined {
  const code = String(cca2).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return undefined;
  const A = 0x1f1e6;
  const a = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    A + (code.charCodeAt(0) - a),
    A + (code.charCodeAt(1) - a),
  );
}

/**
 * Build the full helper API over a dataset. Both the full and `/lite` entry
 * points call this with their own data, so the implementation lives in one
 * place and helpers are typed to whichever record type `T` is supplied.
 */
export function createCountryApi<T extends CountryLike>(countries: T[]) {
  // Lazily-built indexes — constructed on first use of a given lookup.
  let byCca2: Map<string, T> | undefined;
  let byCca3: Map<string, T> | undefined;
  let byCcn3: Map<string, T> | undefined;
  let byCioc: Map<string, T> | undefined;
  let byName: Map<string, T> | undefined;

  function cca2Index(): Map<string, T> {
    if (!byCca2) {
      byCca2 = new Map();
      for (const c of countries) byCca2.set(c.cca2.toUpperCase(), c);
    }
    return byCca2;
  }
  function cca3Index(): Map<string, T> {
    if (!byCca3) {
      byCca3 = new Map();
      for (const c of countries) byCca3.set(c.cca3.toUpperCase(), c);
    }
    return byCca3;
  }
  function ccn3Index(): Map<string, T> {
    if (!byCcn3) {
      byCcn3 = new Map();
      for (const c of countries) if (c.ccn3) byCcn3.set(c.ccn3, c);
    }
    return byCcn3;
  }
  function ciocIndex(): Map<string, T> {
    if (!byCioc) {
      byCioc = new Map();
      for (const c of countries) if (c.cioc) byCioc.set(c.cioc.toUpperCase(), c);
    }
    return byCioc;
  }
  function nameIndex(): Map<string, T> {
    if (!byName) {
      byName = new Map();
      const add = (key: string, c: T): void => {
        const norm = key.trim().toLowerCase();
        if (norm && !byName!.has(norm)) byName!.set(norm, c);
      };
      for (const c of countries) {
        add(c.name.common, c);
        add(c.name.official, c);
      }
      for (const c of countries) {
        for (const n of Object.values(c.name.nativeName ?? {})) {
          add(n.common, c);
          add(n.official, c);
        }
        for (const s of c.altSpellings) add(s, c);
      }
    }
    return byName;
  }

  function getByCca2(code: string): T | undefined {
    return cca2Index().get(String(code).trim().toUpperCase());
  }
  function getByCca3(code: string): T | undefined {
    return cca3Index().get(String(code).trim().toUpperCase());
  }
  function getByCcn3(code: string | number): T | undefined {
    return ccn3Index().get(String(code).trim().padStart(3, '0'));
  }
  function getByCioc(code: string): T | undefined {
    return ciocIndex().get(String(code).trim().toUpperCase());
  }
  function getByName(name: string): T | undefined {
    return nameIndex().get(String(name).trim().toLowerCase());
  }
  function getCountry(query: string | number): T | undefined {
    const q = String(query).trim();
    return (
      getByCca2(q) ?? getByCca3(q) ?? getByCcn3(q) ?? getByCioc(q) ?? getByName(q)
    );
  }

  function candidates(c: T): string[] {
    const out = [c.name.common, c.name.official, ...c.altSpellings];
    for (const n of Object.values(c.name.nativeName ?? {})) {
      out.push(n.common, n.official);
    }
    return out;
  }

  function searchByName(query: string, options: SearchOptions = {}): T[] {
    const { limit, threshold = 0.4 } = options;
    const q = normalize(query);
    if (!q) return [];

    const scored: Array<{ country: T; score: number }> = [];
    for (const c of countries) {
      let best = 0;
      for (const cand of candidates(c)) {
        const s = scoreString(q, normalize(cand));
        if (s > best) best = s;
        if (best === 1) break;
      }
      if (best >= threshold) scored.push({ country: c, score: best });
    }
    scored.sort(
      (a, b) =>
        b.score - a.score ||
        a.country.name.common.localeCompare(b.country.name.common),
    );
    const results = scored.map((s) => s.country);
    return typeof limit === 'number' ? results.slice(0, limit) : results;
  }

  function filterByRegion(region: string): T[] {
    const r = String(region).trim().toLowerCase();
    return countries.filter((c) => c.region.toLowerCase() === r);
  }
  function filterBySubregion(subregion: string): T[] {
    const s = String(subregion).trim().toLowerCase();
    return countries.filter((c) => c.subregion.toLowerCase() === s);
  }
  function filterByContinent(continent: string): T[] {
    const ct = String(continent).trim().toLowerCase();
    return countries.filter((c) =>
      c.continents.some((x) => x.toLowerCase() === ct),
    );
  }
  function filterByCurrency(code: string): T[] {
    const cur = String(code).trim().toUpperCase();
    return countries.filter((c) =>
      Object.keys(c.currencies).some((k) => k.toUpperCase() === cur),
    );
  }
  function filterByLanguage(code: string): T[] {
    const lang = String(code).trim().toLowerCase();
    return countries.filter((c) =>
      Object.keys(c.languages).some((k) => k.toLowerCase() === lang),
    );
  }

  const dir = (d: SortDirection): number => (d === 'desc' ? -1 : 1);
  function sortByName(list: T[] = countries, d: SortDirection = 'asc'): T[] {
    return [...list].sort(
      (a, b) => a.name.common.localeCompare(b.name.common) * dir(d),
    );
  }
  function sortByPopulation(list: T[] = countries, d: SortDirection = 'desc'): T[] {
    return [...list].sort((a, b) => (a.population - b.population) * dir(d));
  }
  function sortByArea(list: T[] = countries, d: SortDirection = 'desc'): T[] {
    return [...list].sort((a, b) => (a.area - b.area) * dir(d));
  }

  function alpha2ToAlpha3(cca2: string): string | undefined {
    return getByCca2(cca2)?.cca3;
  }
  function alpha3ToAlpha2(cca3: string): string | undefined {
    return getByCca3(cca3)?.cca2;
  }
  function alpha2ToNumeric(cca2: string): string | undefined {
    return getByCca2(cca2)?.ccn3 || undefined;
  }
  function numericToAlpha2(ccn3: string | number): string | undefined {
    return getByCcn3(ccn3)?.cca2;
  }
  function alpha3ToNumeric(cca3: string): string | undefined {
    return getByCca3(cca3)?.ccn3 || undefined;
  }
  function numericToAlpha3(ccn3: string | number): string | undefined {
    return getByCcn3(ccn3)?.cca3;
  }

  function distanceBetween(
    a: string | T,
    b: string | T,
    unit: 'km' | 'mi' = 'km',
  ): number | undefined {
    const ca = typeof a === 'string' ? getByCca2(a) : a;
    const cb = typeof b === 'string' ? getByCca2(b) : b;
    if (!ca || !cb) return undefined;
    const [lat1, lon1] = ca.latlng;
    const [lat2, lon2] = cb.latlng;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const km = 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
    return unit === 'mi' ? km / KM_PER_MILE : km;
  }

  return {
    getByCca2,
    getByCca3,
    getByCcn3,
    getByCioc,
    getByName,
    getCountry,
    searchByName,
    filterByRegion,
    filterBySubregion,
    filterByContinent,
    filterByCurrency,
    filterByLanguage,
    sortByName,
    sortByPopulation,
    sortByArea,
    alpha2ToAlpha3,
    alpha3ToAlpha2,
    alpha2ToNumeric,
    numericToAlpha2,
    alpha3ToNumeric,
    numericToAlpha3,
    distanceBetween,
  };
}
