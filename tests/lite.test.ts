import { describe, it, expect } from 'vitest';
import * as lite from '../src/lite';
import { countries as fullCountries } from '../src/index';

describe('lite entry', () => {
  it('has the same number of countries as the full dataset', () => {
    expect(lite.countries.length).toBe(fullCountries.length);
  });

  it('drops the heavy fields', () => {
    const za = lite.getByCca2('ZA')!;
    expect(za).toBeDefined();
    expect(za).not.toHaveProperty('translations');
    expect(za).not.toHaveProperty('flags');
    expect(za).not.toHaveProperty('coatOfArms');
    expect(za).not.toHaveProperty('maps');
    expect(za).not.toHaveProperty('demonyms');
    expect(za.name).not.toHaveProperty('nativeName');
  });

  it('keeps the essential fields', () => {
    const de = lite.getByCca3('DEU')!;
    expect(de.name.common).toBe('Germany');
    expect(de.flag).toBe('🇩🇪');
    expect(de.cca2).toBe('DE');
    expect(de.region).toBe('Europe');
    expect(Object.keys(de.currencies)).toContain('EUR');
    expect(de.languages).toHaveProperty('deu');
    expect(de.latlng).toHaveLength(2);
    expect(de.population).toBeGreaterThan(0);
  });

  it('exposes the full helper suite over the slim data', () => {
    expect(lite.getCountry('840')?.name.common).toBe('United States');
    expect(lite.searchByName('south afr')[0]?.cca3).toBe('ZAF');
    expect(lite.filterByCurrency('EUR').length).toBeGreaterThan(20);
    expect(lite.alpha2ToAlpha3('US')).toBe('USA');
    expect(lite.emojiFlag('ZA')).toBe('🇿🇦');
    expect(lite.sortByArea()[0]?.cca3).toBe('RUS');
  });

  it('computes distances from the slim data', () => {
    const d = lite.distanceBetween('FR', 'DE');
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(1200);
  });
});
