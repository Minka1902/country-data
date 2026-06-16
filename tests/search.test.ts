import { describe, it, expect } from 'vitest';
import {
  searchByName,
  filterByRegion,
  filterBySubregion,
  filterByContinent,
  filterByCurrency,
  filterByLanguage,
  sortByName,
  sortByPopulation,
  sortByArea,
} from '../src/index';

describe('searchByName', () => {
  it('ranks the best match first on partial input', () => {
    expect(searchByName('south afr')[0]?.cca3).toBe('ZAF');
  });

  it('tolerates typos', () => {
    expect(searchByName('Germny')[0]?.cca2).toBe('DE');
  });

  it('honours limit and threshold', () => {
    expect(searchByName('land', { limit: 3 })).toHaveLength(3);
    expect(searchByName('zzzzzz', { threshold: 0.9 })).toHaveLength(0);
  });

  it('returns empty for blank query', () => {
    expect(searchByName('   ')).toEqual([]);
  });
});

describe('filters', () => {
  it('filters by region and subregion', () => {
    expect(filterByRegion('Europe').length).toBeGreaterThan(40);
    expect(filterBySubregion('Western Europe').every((c) => c.region === 'Europe')).toBe(true);
  });

  it('filters by continent', () => {
    expect(filterByContinent('Antarctica').length).toBeGreaterThan(0);
    expect(filterByContinent('africa').every((c) => c.continents.includes('Africa'))).toBe(true);
  });

  it('filters by currency and language', () => {
    expect(filterByCurrency('EUR').length).toBeGreaterThan(20);
    expect(filterByLanguage('eng').length).toBeGreaterThan(50);
  });
});

describe('sorts', () => {
  it('sorts by name ascending by default', () => {
    const names = sortByName().map((c) => c.name.common);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts by population and area descending by default', () => {
    expect(sortByPopulation()[0]?.population).toBeGreaterThan(1_000_000_000);
    expect(sortByArea()[0]?.cca3).toBe('RUS');
  });

  it('does not mutate the source array', () => {
    const list = filterByRegion('Europe');
    const before = [...list];
    sortByName(list);
    expect(list).toEqual(before);
  });
});
