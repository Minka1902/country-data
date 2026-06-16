# @minka1902/country-data

> Comprehensive, fully-typed data for **every country** — with lookup, search, filter, conversion and geo helpers. **Zero runtime dependencies.**

Built on the [REST Countries v3.1](https://gitlab.com/restcountries/restcountries) dataset (250 countries/territories, ~35 fields each), shipped as a single typed module that works in both ESM and CommonJS.

## Why this package?

- **Every field.** Names (common/official/native), translations, currencies, languages, calling codes, capital + coordinates, region/subregion/continent, borders, area, population, timezones, flags (emoji/PNG/SVG), coat of arms, car/driving side, postal-code formats, gini, FIFA/IOC codes, maps links, and more.
- **Fully typed.** Country codes, currency codes, regions, etc. are string-literal **union types**, so you get autocomplete and compile-time checking — while helpers still accept plain strings at runtime.
- **Batteries included.** O(1) lookups, fuzzy name search, filtering, sorting, code conversions, emoji flags and great-circle distances.
- **Zero runtime dependencies.** The data is vendored and pinned; nothing is fetched at install or runtime.
- **Dual ESM + CJS** with `.d.ts` types.

## Install

```sh
npm install @minka1902/country-data
```

> **Bundle-sensitive?** Import from [`@minka1902/country-data/lite`](#lite-build) for the same API at ~30 KB gzipped instead of ~172 KB.

## Quick start

```ts
import {
  getByCca2,
  getCountry,
  searchByName,
  filterByCurrency,
  alpha2ToAlpha3,
  emojiFlag,
  distanceBetween,
  countries,
} from '@minka1902/country-data';

getByCca2('ZA');                 // → full Country object for South Africa
getCountry('840');               // → United States (resolves any code or name)
searchByName('south afr')[0];    // → South Africa (fuzzy, typo-tolerant)
filterByCurrency('EUR');         // → all eurozone countries
alpha2ToAlpha3('US');            // → 'USA'
emojiFlag('ZA');                 // → '🇿🇦'
distanceBetween('FR', 'DE');     // → ~758 (km)
countries.length;                // → 195 (independent states; see Scope below)
```

## Lite build

For bundle-sensitive apps (especially the browser), import from the `/lite`
subpath. It exposes the **same helper API** over a slimmed dataset:

```ts
import { getByCca2, searchByName, distanceBetween, countries } from '@minka1902/country-data/lite';
```

| Build | Records (default / all) | Gzipped | Per-country fields |
| ----- | ----------------------- | ------- | ------------------ |
| `@minka1902/country-data`      | 195 / 250 | ~172 KB | all (~30) |
| `@minka1902/country-data/lite` | 195 / 250 | **~30 KB** | essentials (21) |

The lite record (`LiteCountry`) keeps codes, common/official name, flag emoji,
currencies, languages, calling codes, capital, region/subregion/continent,
coordinates, borders, area and population. It **drops** the heavy fields:
`translations`, `name.nativeName`, `flags`/`coatOfArms` image URLs, `maps`,
`demonyms`, `gini`, `postalCode`, `car`, `timezones`, `startOfWeek`, `tld`,
`fifa`, `status`, `capitalInfo`. (Name search still works on common/official/alt
spellings, just not native names.)

## API

### Scope: independent states vs. all ISO entries

The dataset holds 250 ISO 3166-1 entries, but only **195 are independent
sovereign states**; the rest are territories and dependencies (Greenland, Puerto
Rico, Hong Kong, Western Sahara, etc.). By default the package — and all the
helper functions — operate on the **195 independent states**:

```ts
import { countries, allCountries, selectCountries, createCountryApi } from '@minka1902/country-data';

countries.length;                          // 195 (independent states, default)
allCountries.length;                       // 250 (every ISO 3166-1 entry)

// Build a custom list with uniform rules, then wire helpers over it:
const list = selectCountries({ scope: 'all', exclude: ['XK'] });   // all, minus Kosovo
const api = createCountryApi(list);
api.getByCca3('PRI');                       // Puerto Rico, now in scope
```

`selectCountries({ scope, include, exclude })`:
- `scope`: `'independent'` (default) or `'all'`.
- `include` / `exclude`: arrays of alpha-2 or alpha-3 codes (case-insensitive).

These are uniform, field-based rules (`independent`, plus your own code lists) —
nothing is hand-picked in the data itself.

### Data exports
- `countries: Country[]` — default list: the 195 independent states.
- `allCountries: Country[]` — every ISO 3166-1 entry (250).
- `selectCountries(options)` — custom scope/include/exclude selection.
- `createCountryApi(list)` — wire the full helper suite over any country list.
- `provenance` — source URL, pinned commit and generation timestamp.
- `cca2Codes`, `cca3Codes`, `ccn3Codes`, `ciocCodes`, `currencyCodes`, `languageCodes`, `regions`, `subregions`, `continents` — `readonly` arrays of every value.

### Lookups (O(1), case-insensitive)
- `getByCca2(code)` — by ISO 3166-1 alpha-2.
- `getByCca3(code)` — by ISO 3166-1 alpha-3.
- `getByCcn3(code)` — by ISO numeric (accepts `number` or string; zero-padded).
- `getByCioc(code)` — by IOC code.
- `getByName(name)` — by common/official/native name or alt spelling.
- `getCountry(query)` — resolve any of the above when the format is unknown.

All return `Country | undefined`.

### Search, filter & sort
- `searchByName(query, { limit?, threshold? })` — fuzzy, relevance-ranked.
- `filterByRegion` / `filterBySubregion` / `filterByContinent` / `filterByCurrency` / `filterByLanguage`.
- `findByCallingCode(code)` — countries on a phone code, e.g. `"972"` → Israel, `"1"` → US/Canada.
- `findByTimezone(tz)` — countries on a UTC-offset timezone, e.g. `"UTC+01:00"`. *(full entry only)*
- `sortByName` / `sortByPopulation` / `sortByArea` — `(list?, dir?)`, return new arrays.

### Relations & names
- `getBorders(country)` — resolve a country's `borders` to full `Country[]` (within the current scope).
- `getName(country, lang)` — localized common name from `translations`, e.g. `getName('DE','fra')` → `"Allemagne"`. *(full entry only)*

### Conversions
- `alpha2ToAlpha3`, `alpha3ToAlpha2`, `alpha2ToNumeric`, `numericToAlpha2`, `alpha3ToNumeric`, `numericToAlpha3`.
- `emojiFlag(cca2)` — build a flag emoji from an alpha-2 code.

### Geo
- `distanceBetween(a, b, unit?)` — great-circle distance (`'km'` default or `'mi'`); accepts alpha-2 codes or `Country` objects.
- `nearestCountry(lat, lng)` — the closest country to a coordinate.
- `countriesWithinRadius(lat, lng, radiusKm)` — countries within a radius, nearest first.

## Subdivisions (ISO 3166-2)

States, provinces and regions are available from a separate subpath so they stay
out of the main bundle (~41 KB gzipped, 3,800+ subdivisions):

```ts
import { getSubdivisions, getSubdivision, searchSubdivisions } from '@minka1902/country-data/subdivisions';

getSubdivisions('US');            // → all US states/territories (Subdivision[])
getSubdivision('US-CA');          // → { code: 'US-CA', name: 'California', countryCode: 'US' }
searchSubdivisions('Californ');   // → name substring match
```

### Types
The `Country` interface and all nested types (`CountryName`, `Currencies`, `Idd`, `Flags`, `Car`, `PostalCode`, …) plus the code unions (`Cca2`, `Cca3`, `CurrencyCode`, `Region`, …) are exported.

> **Note on optional values:** keys are always present, but some values are intentionally empty when the source has no data (e.g. `borders: []` for island nations, `cioc: ""` for non-Olympic entries, `capitalInfo.latlng` absent for a few territories).

## Data source & freshness

Data is generated from REST Countries v3.1, pinned to a specific commit for reproducibility (see `provenance` and `data/countries.raw.json`). To refresh against the latest upstream:

```sh
npm run generate   # fetch + regenerate src/generated/*
npm test           # validate integrity
```

## Attribution & License

- **Source code:** MIT — see [`LICENSE`](./LICENSE).
- **Country data:** Open Database License (ODbL) v1.0 — see [`LICENSE-DATA`](./LICENSE-DATA) and [`NOTICE`](./NOTICE). The data is derived from [REST Countries](https://gitlab.com/restcountries/restcountries) / [mledoze/countries](https://github.com/mledoze/countries).
- **Subdivision data** (`/subdivisions`): MIT — derived from [olahol/iso-3166-2.json](https://github.com/olahol/iso-3166-2.json).
- **Flag & coat-of-arms images/emoji** referenced by URL are **not** covered by the ODbL and remain subject to their own sources' terms.

If you redistribute or adapt the bundled database, the ODbL requires you to provide attribution and to offer any adapted database under the ODbL.
