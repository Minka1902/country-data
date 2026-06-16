/**
 * @minka1902/country-data/lite
 *
 * The same API as the main entry, backed by a slimmed dataset that drops the
 * heavy fields (translations, native names, demonyms, flag/coat-of-arms image
 * URLs, maps, gini, postal codes, car, timezones). Ideal for bundle-sensitive
 * web apps that only need codes, names, currencies, languages, geo and flags.
 */
import { countriesLite } from './generated/countries.lite';
import { createCountryApi, emojiFlag } from './core';
import type { LiteCountry } from './types';

const api = createCountryApi<LiteCountry>(countriesLite);

// Slim dataset (exported as `countries` for parity with the main entry)
export { countriesLite, countriesLite as countries, emojiFlag };

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
