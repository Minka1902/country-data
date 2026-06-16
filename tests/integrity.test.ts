import { describe, it, expect } from 'vitest';
import {
  countries,
  provenance,
  cca2Codes,
  cca3Codes,
  getByCca3,
} from '../src/index';

describe('data integrity', () => {
  it('has the expected number of countries', () => {
    expect(countries.length).toBe(provenance.count);
    expect(countries.length).toBeGreaterThanOrEqual(240);
    expect(countries.length).toBeLessThanOrEqual(260);
  });

  it('has unique, well-formed alpha-2 codes', () => {
    const seen = new Set<string>();
    for (const c of countries) {
      expect(c.cca2).toMatch(/^[A-Z]{2}$/);
      expect(seen.has(c.cca2)).toBe(false);
      seen.add(c.cca2);
    }
    expect(seen.size).toBe(countries.length);
  });

  it('has unique, well-formed alpha-3 codes', () => {
    const seen = new Set<string>();
    for (const c of countries) {
      expect(c.cca3).toMatch(/^[A-Z]{3}$/);
      seen.add(c.cca3);
    }
    expect(seen.size).toBe(countries.length);
  });

  it('has borders that resolve to real countries', () => {
    for (const c of countries) {
      for (const border of c.borders) {
        expect(getByCca3(border), `${c.cca3} -> ${border}`).toBeDefined();
      }
    }
  });

  it('keeps generated code lists in sync with the data', () => {
    expect(new Set(cca2Codes)).toEqual(new Set(countries.map((c) => c.cca2)));
    expect(new Set(cca3Codes)).toEqual(new Set(countries.map((c) => c.cca3)));
  });

  it('has valid enumerated fields', () => {
    for (const c of countries) {
      expect(['left', 'right']).toContain(c.car.side);
      expect(['officially-assigned', 'user-assigned']).toContain(c.status);
      expect(['monday', 'saturday', 'sunday']).toContain(c.startOfWeek);
      expect(c.latlng).toHaveLength(2);
    }
  });
});
