/**
 * @minka1902/country-data/subdivisions
 *
 * ISO 3166-2 country subdivisions (states, provinces, regions, …) with lookups.
 * Kept on its own subpath so it stays out of the main country bundle.
 *
 * Data: olahol/iso-3166-2.json (MIT).
 */
import { subdivisions } from './generated/subdivisions';
import type { Subdivision } from './types';

export { subdivisions };
export type { Subdivision };

let byCode: Map<string, Subdivision> | undefined;
let byCountry: Map<string, Subdivision[]> | undefined;

function codeIndex(): Map<string, Subdivision> {
  if (!byCode) {
    byCode = new Map();
    for (const s of subdivisions) byCode.set(s.code.toUpperCase(), s);
  }
  return byCode;
}

function countryIndex(): Map<string, Subdivision[]> {
  if (!byCountry) {
    byCountry = new Map();
    for (const s of subdivisions) {
      const key = s.countryCode.toUpperCase();
      const list = byCountry.get(key);
      if (list) list.push(s);
      else byCountry.set(key, [s]);
    }
  }
  return byCountry;
}

/** All subdivisions of a country by its ISO 3166-1 alpha-2 code, e.g. `"US"`. */
export function getSubdivisions(countryCode: string): Subdivision[] {
  return countryIndex().get(String(countryCode).trim().toUpperCase()) ?? [];
}

/** A single subdivision by its ISO 3166-2 code, e.g. `"US-CA"` (case-insensitive). */
export function getSubdivision(code: string): Subdivision | undefined {
  return codeIndex().get(String(code).trim().toUpperCase());
}

export interface SubdivisionSearchOptions {
  /** Maximum number of results to return. */
  limit?: number;
}

/** Subdivisions whose name contains `query` (case-insensitive substring match). */
export function searchSubdivisions(
  query: string,
  options: SubdivisionSearchOptions = {},
): Subdivision[] {
  const q = String(query).trim().toLowerCase();
  if (!q) return [];
  const results = subdivisions.filter((s) => s.name.toLowerCase().includes(q));
  return typeof options.limit === 'number' ? results.slice(0, options.limit) : results;
}
