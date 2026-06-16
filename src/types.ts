import type {
  Cca2,
  Cca3,
  Continent,
  Region,
} from './generated/codes';

/** A latitude/longitude pair, `[lat, lng]`. */
export type LatLng = [number, number];

/** ISO 3166-1 assignment status. */
export type CountryStatus = 'officially-assigned' | 'user-assigned';

/** First day of the week observed in the country. */
export type StartOfWeek = 'monday' | 'saturday' | 'sunday';

/** A common + official name pair (used for native names and translations). */
export interface LocalizedName {
  official: string;
  common: string;
}

/** Native names, keyed by ISO 639-3 language code (e.g. `deu`, `fra`). */
export type NativeName = Record<string, LocalizedName>;

export interface CountryName {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface Currency {
  name: string;
  /** Some currencies have no symbol in the source data. */
  symbol?: string;
}

/** Currencies keyed by ISO 4217 code (e.g. `EUR`, `USD`). May be empty. */
export type Currencies = Record<string, Currency>;

/** International direct dialing prefix. `root + suffixes[i]` = full calling code. */
export interface Idd {
  root: string;
  suffixes: string[];
}

/** A demonym pair: `f` (feminine) and `m` (masculine). */
export interface Demonym {
  f: string;
  m: string;
}

/** Demonyms keyed by ISO 639-3 language code (e.g. `eng`, `fra`). */
export type Demonyms = Record<string, Demonym>;

/** A single name translation. */
export type Translation = LocalizedName;

/** Name translations keyed by ISO 639-3 language code. */
export type Translations = Record<string, Translation>;

export interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface Car {
  /** Vehicle registration sign(s). May be empty. */
  signs: string[];
  side: 'left' | 'right';
}

export interface Flags {
  png: string;
  svg: string;
  /** Human-readable description of the flag. */
  alt?: string;
}

export interface CoatOfArms {
  png?: string;
  svg?: string;
}

export interface CapitalInfo {
  /** Absent for a few territories that have no capital coordinates. */
  latlng?: LatLng;
}

export interface PostalCode {
  format: string | null;
  regex: string | null;
}

/** Languages keyed by ISO 639-3 code mapped to the language name. May be empty. */
export type Languages = Record<string, string>;

/** Gini coefficient keyed by year (e.g. `{ "2018": 41.5 }`). May be empty. */
export type Gini = Record<string, number>;

/**
 * A single country record, faithful to the REST Countries v3.1 schema.
 *
 * Keys are always present, but some values may be empty strings, empty
 * arrays or empty objects when the source data has no value (for example
 * `borders: []` for island nations, or `cioc: ""` for non-Olympic entries).
 */
export interface Country {
  name: CountryName;
  /** Top-level domain(s), e.g. `[".de"]`. */
  tld: string[];
  /** ISO 3166-1 alpha-2 code, e.g. `DE`. */
  cca2: Cca2;
  /** ISO 3166-1 numeric code as a string, e.g. `276`. May be `""`. */
  ccn3: string;
  /** ISO 3166-1 alpha-3 code, e.g. `DEU`. */
  cca3: Cca3;
  /** International Olympic Committee code. May be `""`. */
  cioc: string;
  /** FIFA code. May be `""`. */
  fifa: string;
  independent: boolean;
  status: CountryStatus;
  unMember: boolean;
  currencies: Currencies;
  idd: Idd;
  /** Capital city/cities. May be empty. */
  capital: string[];
  capitalInfo: CapitalInfo;
  altSpellings: string[];
  region: Region;
  /** May be `""`. */
  subregion: string;
  continents: Continent[];
  languages: Languages;
  translations: Translations;
  latlng: LatLng;
  landlocked: boolean;
  /** Bordering countries as alpha-3 codes. May be empty. */
  borders: Cca3[];
  /** Land area in km². */
  area: number;
  /** Emoji flag, e.g. `🇩🇪`. */
  flag: string;
  demonyms: Demonyms;
  flags: Flags;
  coatOfArms: CoatOfArms;
  population: number;
  maps: Maps;
  gini: Gini;
  car: Car;
  postalCode: PostalCode;
  startOfWeek: StartOfWeek;
  /** IANA timezone identifiers / UTC offsets. */
  timezones: string[];
}
