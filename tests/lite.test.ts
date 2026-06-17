import { describe, it, expect } from 'vitest';
import * as lite from '../src/lite';
import { countries as fullCountries, allCountries as fullAll } from '../src/index';

describe('lite entry', () => {
  it('mirrors the full dataset sizes (default and all)', () => {
    expect(lite.countries.length).toBe(fullCountries.length);
    expect(lite.countries.length).toBe(195);
    expect(lite.allCountries.length).toBe(fullAll.length);
    expect(lite.allCountries.length).toBe(250);
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

  it('exposes the generic richer helpers', () => {
    expect(lite.getBorders('FRA').map((c) => c.cca3)).toContain('ESP');
    expect(lite.findByCallingCode('972').map((c) => c.cca3)).toContain('ISR');
    expect(lite.nearestCountry(46, 2)?.cca3).toBe('FRA');
    expect(lite.countriesWithinRadius(50.85, 4.35, 400).map((c) => c.cca3)).toContain('BEL');
  });
});
