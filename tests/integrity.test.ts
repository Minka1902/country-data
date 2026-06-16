import { describe, it, expect } from 'vitest';
import {
  countries,
  allCountries,
  provenance,
  cca2Codes,
  cca3Codes,
  createCountryApi,
} from '../src/index';

// Border targets can be territories (e.g. French Guiana), so resolve against
// the full ISO set rather than the independent-only default.
const allApi = createCountryApi(allCountries);

describe('data integrity', () => {
  it('has the expected dataset sizes', () => {
    expect(allCountries.length).toBe(provenance.count);
    expect(allCountries.length).toBe(250);
    expect(countries.length).toBe(195);
    expect(countries.every((c) => c.independent === true)).toBe(true);
  });

  it('has unique, well-formed alpha-2 codes', () => {
    const seen = new Set<string>();
    for (const c of allCountries) {
      expect(c.cca2).toMatch(/^[A-Z]{2}$/);
      expect(seen.has(c.cca2)).toBe(false);
      seen.add(c.cca2);
    }
    expect(seen.size).toBe(allCountries.length);
  });

  it('has unique, well-formed alpha-3 codes', () => {
    const seen = new Set<string>();
    for (const c of allCountries) {
      expect(c.cca3).toMatch(/^[A-Z]{3}$/);
      seen.add(c.cca3);
    }
    expect(seen.size).toBe(allCountries.length);
  });

  it('has borders that resolve to real entries', () => {
    for (const c of allCountries) {
      for (const border of c.borders) {
        expect(allApi.getByCca3(border), `${c.cca3} -> ${border}`).toBeDefined();
      }
    }
  });

  it('keeps generated code lists in sync with the full data', () => {
    expect(new Set(cca2Codes)).toEqual(new Set(allCountries.map((c) => c.cca2)));
    expect(new Set(cca3Codes)).toEqual(new Set(allCountries.map((c) => c.cca3)));
  });

  it('has valid enumerated fields', () => {
    for (const c of allCountries) {
      expect(['left', 'right']).toContain(c.car.side);
      expect(['officially-assigned', 'user-assigned']).toContain(c.status);
      expect(['monday', 'saturday', 'sunday']).toContain(c.startOfWeek);
      expect(c.latlng).toHaveLength(2);
    }
  });
});
