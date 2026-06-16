/**
 * @minka1902/country-data
 *
 * Comprehensive, fully-typed data for every country (REST Countries v3.1),
 * with lookup, search, filter, conversion and geo helpers. Zero runtime deps.
 */

// Raw data + provenance
export { countries, provenance } from './generated';

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

// Lookups
export {
  getByCca2,
  getByCca3,
  getByCcn3,
  getByCioc,
  getByName,
  getCountry,
} from './lookup';

// Search / filter / sort
export { searchByName } from './search';
export type { SearchOptions } from './search';
export {
  filterByRegion,
  filterBySubregion,
  filterByContinent,
  filterByCurrency,
  filterByLanguage,
} from './filter';
export { sortByName, sortByPopulation, sortByArea } from './sort';
export type { SortDirection } from './sort';

// Conversions
export {
  alpha2ToAlpha3,
  alpha3ToAlpha2,
  alpha2ToNumeric,
  numericToAlpha2,
  alpha3ToNumeric,
  numericToAlpha3,
  emojiFlag,
} from './convert';

// Geo
export { distanceBetween } from './geo';
