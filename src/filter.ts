import { countries } from './generated/countries';
import type {
  Continent,
  CurrencyCode,
  LanguageCode,
  Region,
  Subregion,
} from './generated/codes';
import type { Country } from './types';

/** All countries in a region (case-insensitive), e.g. `"Europe"`. */
export function filterByRegion(region: Region | string): Country[] {
  const r = String(region).trim().toLowerCase();
  return countries.filter((c) => c.region.toLowerCase() === r);
}

/** All countries in a subregion (case-insensitive), e.g. `"Western Europe"`. */
export function filterBySubregion(subregion: Subregion | string): Country[] {
  const s = String(subregion).trim().toLowerCase();
  return countries.filter((c) => c.subregion.toLowerCase() === s);
}

/** All countries on a continent (case-insensitive), e.g. `"Africa"`. */
export function filterByContinent(continent: Continent | string): Country[] {
  const ct = String(continent).trim().toLowerCase();
  return countries.filter((c) =>
    c.continents.some((x) => x.toLowerCase() === ct),
  );
}

/** All countries that use a currency (case-insensitive ISO 4217), e.g. `"EUR"`. */
export function filterByCurrency(code: CurrencyCode | string): Country[] {
  const cur = String(code).trim().toUpperCase();
  return countries.filter((c) =>
    Object.keys(c.currencies).some((k) => k.toUpperCase() === cur),
  );
}

/** All countries that use a language (case-insensitive ISO 639-3), e.g. `"eng"`. */
export function filterByLanguage(code: LanguageCode | string): Country[] {
  const lang = String(code).trim().toLowerCase();
  return countries.filter((c) =>
    Object.keys(c.languages).some((k) => k.toLowerCase() === lang),
  );
}
