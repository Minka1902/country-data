/**
 * @minka1902/country-data/lite
 *
 * The same API as the main entry, backed by a slimmed dataset that drops the
 * heavy fields (translations, native names, demonyms, flag/coat-of-arms image
 * URLs, maps, gini, postal codes, car, timezones). Ideal for bundle-sensitive
 * web apps that only need codes, names, currencies, languages, geo and flags.
 */
import { countriesLite } from './generated/countries.lite';
import { createCountryApi, emojiFlag, selectFrom } from './core';
import type { SelectOptions } from './core';
import type { LiteCountry } from './types';

/** Every ISO 3166-1 entry (250), slimmed; includes territories and dependencies. */
export const allCountries: LiteCountry[] = countriesLite;

/** Default slim dataset: the 195 independent/sovereign states (`independent === true`). */
export const countries: LiteCountry[] = countriesLite.filter((c) => c.independent === true);

const api = createCountryApi<LiteCountry>(countries);

/** Build a custom country list (scope + include/exclude) from the full ISO set. */
export function selectCountries(options?: SelectOptions): LiteCountry[] {
  return selectFrom(allCountries, options);
}

// Slim dataset + dataset-independent helpers
export { emojiFlag, createCountryApi, selectFrom };
export type { SelectOptions };

// Helper functions (typed to the slim LiteCountry record)
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
} = api;

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
  LiteCountry,
  CountryLike,
  Currency,
  Currencies,
  Idd,
  Languages,
  LatLng,
} from './types';
