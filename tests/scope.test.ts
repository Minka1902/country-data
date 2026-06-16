import { describe, it, expect } from 'vitest';
import {
  countries,
  allCountries,
  selectCountries,
  createCountryApi,
  getByCca2,
  getByCca3,
} from '../src/index';

describe('default scope (independent states)', () => {
  it('defaults to the 195 independent states', () => {
    expect(countries.length).toBe(195);
    expect(allCountries.length).toBe(250);
  });

  it('excludes non-independent entries from the default by a uniform rule', () => {
    // Palestine and Greenland are both `independent: false`, so both are absent
    // from the default — neither is special-cased.
    expect(getByCca3('PSE')).toBeUndefined();
    expect(getByCca3('GRL')).toBeUndefined();
    expect(getByCca2('PR')).toBeUndefined(); // Puerto Rico
    expect(countries.some((c) => c.independent === false)).toBe(false);
  });

  it('keeps independent states (incl. Israel and the US) in the default', () => {
    expect(getByCca3('ISR')?.name.common).toBe('Israel');
    expect(getByCca3('USA')?.name.common).toBe('United States');
  });

  it('exposes every ISO entry via allCountries / an all-scope api', () => {
    const all = createCountryApi(allCountries);
    expect(all.getByCca3('PSE')?.name.common).toBe('Palestine');
    expect(all.getByCca3('GRL')?.name.common).toBe('Greenland');
  });
});

describe('selectCountries', () => {
  it('returns all 250 with scope: "all"', () => {
    expect(selectCountries({ scope: 'all' }).length).toBe(250);
  });

  it('defaults to independent scope', () => {
    expect(selectCountries().length).toBe(195);
  });

  it('removes codes via exclude (cca2/cca3, case-insensitive)', () => {
    const all = selectCountries({ scope: 'all', exclude: ['XK'] });
    expect(all.length).toBe(249);
    expect(all.some((c) => c.cca2 === 'XK')).toBe(false);
    expect(selectCountries({ scope: 'all', exclude: ['usa'] }).some((c) => c.cca3 === 'USA')).toBe(false);
  });

  it('adds non-independent codes back via include', () => {
    const list = selectCountries({ include: ['GRL'] });
    expect(list.length).toBe(196);
    expect(list.some((c) => c.cca3 === 'GRL')).toBe(true);
  });

  it('lets a consumer build a fully-wired api over a custom selection', () => {
    const api = createCountryApi(selectCountries({ scope: 'all', exclude: ['XK'] }));
    expect(api.getByCca2('XK')).toBeUndefined();
    expect(api.getByCca3('USA')?.name.common).toBe('United States');
  });
});
