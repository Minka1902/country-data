import { describe, it, expect } from 'vitest';
import {
  subdivisions,
  getSubdivisions,
  getSubdivision,
  searchSubdivisions,
} from '../src/subdivisions';

describe('subdivisions', () => {
  it('exposes the full ISO 3166-2 list', () => {
    expect(subdivisions.length).toBeGreaterThan(3500);
    for (const s of subdivisions.slice(0, 50)) {
      expect(s.code).toMatch(/^[A-Z0-9]{2}-/);
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.code.startsWith(s.countryCode + '-')).toBe(true);
    }
  });

  it('lists subdivisions for a country (alpha-2)', () => {
    const us = getSubdivisions('US');
    expect(us.length).toBeGreaterThanOrEqual(50);
    expect(us.some((s) => s.code === 'US-CA')).toBe(true);
    expect(getSubdivisions('us').length).toBe(us.length); // case-insensitive
  });

  it('looks up a single subdivision by code', () => {
    expect(getSubdivision('US-CA')?.name).toBe('California');
    expect(getSubdivision('us-ca')?.countryCode).toBe('US');
    expect(getSubdivision('ZZ-99')).toBeUndefined();
  });

  it('has subdivisions for Israel', () => {
    expect(getSubdivisions('IL').length).toBeGreaterThan(0);
  });

  it('searches subdivisions by name', () => {
    const hits = searchSubdivisions('Californ');
    expect(hits.some((s) => s.code === 'US-CA')).toBe(true);
    expect(searchSubdivisions('a', { limit: 3 })).toHaveLength(3);
    expect(searchSubdivisions('')).toEqual([]);
  });
});
