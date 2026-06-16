import { countries } from '../generated/countries';
import type { Country } from '../types';

/**
 * Lazily-built lookup indexes. Maps are constructed on first access so that
 * importing a single helper (e.g. a code converter) does not force building
 * the name index, and vice versa.
 */

let byCca2: Map<string, Country> | undefined;
let byCca3: Map<string, Country> | undefined;
let byCcn3: Map<string, Country> | undefined;
let byCioc: Map<string, Country> | undefined;
let byName: Map<string, Country> | undefined;

export function cca2Index(): Map<string, Country> {
  if (!byCca2) {
    byCca2 = new Map();
    for (const c of countries) byCca2.set(c.cca2.toUpperCase(), c);
  }
  return byCca2;
}

export function cca3Index(): Map<string, Country> {
  if (!byCca3) {
    byCca3 = new Map();
    for (const c of countries) byCca3.set(c.cca3.toUpperCase(), c);
  }
  return byCca3;
}

export function ccn3Index(): Map<string, Country> {
  if (!byCcn3) {
    byCcn3 = new Map();
    for (const c of countries) if (c.ccn3) byCcn3.set(c.ccn3, c);
  }
  return byCcn3;
}

export function ciocIndex(): Map<string, Country> {
  if (!byCioc) {
    byCioc = new Map();
    for (const c of countries) if (c.cioc) byCioc.set(c.cioc.toUpperCase(), c);
  }
  return byCioc;
}

/**
 * Index of normalized names → country, covering common, official, native and
 * alternative spellings. Earlier entries win on collision (common names are
 * registered first).
 */
export function nameIndex(): Map<string, Country> {
  if (!byName) {
    byName = new Map();
    const add = (key: string, c: Country): void => {
      const norm = key.trim().toLowerCase();
      if (norm && !byName!.has(norm)) byName!.set(norm, c);
    };
    // Pass 1: primary common/official names take priority.
    for (const c of countries) {
      add(c.name.common, c);
      add(c.name.official, c);
    }
    // Pass 2: native names, translations and alt spellings.
    for (const c of countries) {
      for (const n of Object.values(c.name.nativeName)) {
        add(n.common, c);
        add(n.official, c);
      }
      for (const s of c.altSpellings) add(s, c);
    }
  }
  return byName;
}
