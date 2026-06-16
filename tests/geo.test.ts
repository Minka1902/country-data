import { describe, it, expect } from 'vitest';
import { distanceBetween, getByCca2 } from '../src/index';

describe('distanceBetween', () => {
  it('computes a plausible great-circle distance (km)', () => {
    // Paris–Berlin representative points are ~550–950 km apart.
    const d = distanceBetween('FR', 'DE');
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(1200);
  });

  it('is symmetric', () => {
    expect(distanceBetween('FR', 'DE')).toBeCloseTo(distanceBetween('DE', 'FR')!, 6);
  });

  it('is zero between a country and itself', () => {
    expect(distanceBetween('FR', 'FR')).toBeCloseTo(0, 6);
  });

  it('converts to miles', () => {
    const km = distanceBetween('FR', 'DE')!;
    const mi = distanceBetween('FR', 'DE', 'mi')!;
    expect(km / mi).toBeCloseTo(1.609344, 4);
  });

  it('accepts Country objects', () => {
    const fr = getByCca2('FR')!;
    const de = getByCca2('DE')!;
    expect(distanceBetween(fr, de)).toBe(distanceBetween('FR', 'DE'));
  });

  it('returns undefined for unknown codes', () => {
    expect(distanceBetween('FR', 'XX')).toBeUndefined();
    expect(distanceBetween('XX', 'FR')).toBeUndefined();
  });
});
