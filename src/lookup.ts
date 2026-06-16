import type { Cca2, Cca3, Ccn3, Cioc } from './generated/codes';
import type { Country } from './types';
import {
  cca2Index,
  cca3Index,
  ccn3Index,
  ciocIndex,
  nameIndex,
} from './internal/indexes';

/** Find a country by ISO 3166-1 alpha-2 code (case-insensitive), e.g. `"DE"`. */
export function getByCca2(code: Cca2 | string): Country | undefined {
  return cca2Index().get(String(code).trim().toUpperCase());
}

/** Find a country by ISO 3166-1 alpha-3 code (case-insensitive), e.g. `"DEU"`. */
export function getByCca3(code: Cca3 | string): Country | undefined {
  return cca3Index().get(String(code).trim().toUpperCase());
}

/** Find a country by ISO 3166-1 numeric code, e.g. `"276"` or `276`. */
export function getByCcn3(code: Ccn3 | string | number): Country | undefined {
  return ccn3Index().get(String(code).trim().padStart(3, '0'));
}

/** Find a country by International Olympic Committee code, e.g. `"GER"`. */
export function getByCioc(code: Cioc | string): Country | undefined {
  return ciocIndex().get(String(code).trim().toUpperCase());
}

/**
 * Find a country by name. Matches common, official, native names and
 * alternative spellings, case-insensitively. Returns the first exact match.
 */
export function getByName(name: string): Country | undefined {
  return nameIndex().get(String(name).trim().toLowerCase());
}

/**
 * Resolve any common identifier to a country: alpha-2, alpha-3, numeric, IOC
 * code or a name. Useful when the input format is unknown.
 */
export function getCountry(
  query: Cca2 | Cca3 | Ccn3 | Cioc | string | number,
): Country | undefined {
  const q = String(query).trim();
  return (
    getByCca2(q) ??
    getByCca3(q) ??
    getByCcn3(q) ??
    getByCioc(q) ??
    getByName(q)
  );
}
