import { describe, it, expect } from 'vitest';
import {
  getBorders,
  findByCallingCode,
  findByTimezone,
  getName,
  nearestCountry,
  countriesWithinRadius,
  getByCca3,
} from '../src/index';

describe('getBorders', () => {
  it('resolves border codes to country records', () => {
    const codes = getBorders('FRA').map((c) => c.cca3);
    expect(codes).toContain('ESP');
    expect(codes).toContain('DEU');
    expect(getBorders(getByCca3('DEU')!).length).toBeGreaterThan(5);
  });

  it('returns an empty array for unknown or island nations', () => {
    expect(getBorders('XXX')).toEqual([]);
    expect(getBorders('ISL')).toEqual([]); // Iceland has no land borders
  });
});

describe('findByCallingCode', () => {
  it('matches a country by its full calling code', () => {
    expect(findByCallingCode('972').map((c) => c.cca3)).toContain('ISR');
    expect(findByCallingCode('+49').map((c) => c.cca3)).toContain('DEU');
  });

  it('matches NANP members on the shared root', () => {
    const codes = findByCallingCode('1').map((c) => c.cca3);
    expect(codes).toContain('USA');
    expect(codes).toContain('CAN');
  });

  it('returns empty for blank input', () => {
    expect(findByCallingCode('')).toEqual([]);
  });
});

describe('findByTimezone', () => {
  it('finds countries observing a UTC-offset timezone', () => {
    expect(findByTimezone('UTC+01:00').map((c) => c.cca3)).toContain('DEU');
    expect(findByTimezone('utc+01:00').length).toBeGreaterThan(0); // case-insensitive
  });
});

describe('getName', () => {
  it('returns the localized common name', () => {
    expect(getName('DE', 'fra')).toBe('Allemagne');
    expect(getName(getByCca3('DEU')!, 'ita')).toBe('Germania');
  });

  it('falls back to the English common name', () => {
    expect(getName('DE', 'zzz')).toBe('Germany');
  });

  it('returns undefined for an unknown country', () => {
    expect(getName('XX', 'fra')).toBeUndefined();
  });
});

describe('geo helpers', () => {
  it('finds the nearest country to a coordinate', () => {
    expect(nearestCountry(46, 2)?.cca3).toBe('FRA'); // France's representative centroid
  });

  it('finds countries within a radius, nearest first', () => {
    const within = countriesWithinRadius(50.85, 4.35, 400); // Brussels
    const codes = within.map((c) => c.cca3);
    expect(codes).toContain('BEL');
    expect(codes).toContain('LUX');
    // sorted ascending by distance
    expect(codes[0]).toBe('BEL');
  });
});
