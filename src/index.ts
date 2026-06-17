/**
 * @minka1902/country-data
 *
 * Comprehensive, fully-typed data for every country (REST Countries v3.1),
 * with lookup, search, filter, conversion and geo helpers. Zero runtime deps.
 *
 * For a much smaller payload (no translations / native names / image URLs),
 * import from `@minka1902/country-data/lite`.
 */
import { countries as allRecords, provenance } from './generated';
import { createCountryApi, emojiFlag, selectFrom } from './core';
import type { SelectOptions } from './core';
import type { Country } from './types';

/** Every ISO 3166-1 entry (250), including territories and dependencies. */
export const allCountries: Country[] = allRecords;

/**
 * Default dataset: the 195 independent/sovereign states (`independent === true`).
 * Use {@link allCountries} or {@link selectCountries} for the full ISO set.
 */
export const countries: Country[] = allRecords.filter((c) => c.independent === true);

const api = createCountryApi<Country>(countries);

/** Build a custom country list (scope + include/exclude) from the full ISO set. */
export function selectCountries(options?: SelectOptions): Country[] {
  return selectFrom(allCountries, options);
}

// Raw data + provenance + dataset-independent helpers
export { provenance, emojiFlag, createCountryApi, selectFrom };
export type { SelectOptions };

// Helper functions (typed to the full Country record)
export const {
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
  getBorders,
  findByCallingCode,
  nearestCountry,
  countriesWithinRadius,
} = api;

/** Countries observing a UTC-offset timezone, e.g. `"UTC+01:00"` (case-insensitive). */
export function findByTimezone(tz: string): Country[] {
  const q = String(tz).trim().toLowerCase();
  if (!q) return [];
  return countries.filter((c) => c.timezones.some((t) => t.toLowerCase() === q));
}

/**
 * Localized common name of a country in a given language (ISO 639-3, e.g.
 * `"fra"`), falling back to the English common name. Accepts a code or a
 * `Country`. Returns `undefined` only if the country can't be resolved.
 */
export function getName(country: string | Country, lang: string): string | undefined {
  const c = typeof country === 'string' ? getCountry(country) : country;
  if (!c) return undefined;
  return c.translations[String(lang).trim().toLowerCase()]?.common ?? c.name.common;
}

export type { SortDirection, SearchOptions } from './core';

// Code lists (runtime arrays) and union types
export {
  cca2Codes,
  cca3Codes,
  ccn3Codes,
  ciocCodes,
  currencyCodes,
  languageCodes,
  regions,
  subregions,
  continents,
} from './generated/codes';

export type {
  Cca2,
  Cca3,
  Ccn3,
  Cioc,
  CurrencyCode,
  LanguageCode,
  Region,
  Subregion,
  Continent,
} from './generated/codes';

// Domain types
export type {
  Country,
  CountryLike,
  CountryName,
  LocalizedName,
  NativeName,
  Currency,
  Currencies,
  Idd,
  Demonym,
  Demonyms,
  Translation,
  Translations,
  Maps,
  Car,
  Flags,
  CoatOfArms,
  CapitalInfo,
  PostalCode,
  Languages,
  Gini,
  LatLng,
  CountryStatus,
  StartOfWeek,
} from './types';
