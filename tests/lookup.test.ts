import { describe, it, expect } from 'vitest';
import {
  getByCca2,
  getByCca3,
  getByCcn3,
  getByCioc,
  getByName,
  getCountry,
} from '../src/index';

describe('lookups', () => {
  it('finds by alpha-2 code (case-insensitive)', () => {
    expect(getByCca2('ZA')?.name.common).toBe('South Africa');
    expect(getByCca2('za')?.cca3).toBe('ZAF');
  });

  it('finds by alpha-3 code', () => {
    expect(getByCca3('USA')?.name.common).toBe('United States');
    expect(getByCca3('deu')?.cca2).toBe('DE');
  });

  it('finds by numeric code, accepting numbers and zero-padding', () => {
    expect(getByCcn3('840')?.cca3).toBe('USA');
    expect(getByCcn3(276)?.cca2).toBe('DE');
    expect(getByCcn3('4')?.cca3).toBe('AFG'); // padded to "004"
  });

  it('finds by IOC code', () => {
    expect(getByCioc('GER')?.cca3).toBe('DEU');
  });

  it('finds by common, official, native and alt-spelling name', () => {
    expect(getByName('Germany')?.cca2).toBe('DE');
    expect(getByName('Federal Republic of Germany')?.cca2).toBe('DE');
    expect(getByName('Deutschland')?.cca2).toBe('DE');
    expect(getByName('GERMANY')?.cca2).toBe('DE');
  });

  it('resolves any identifier via getCountry', () => {
    expect(getCountry('FR')?.cca3).toBe('FRA');
    expect(getCountry('FRA')?.cca2).toBe('FR');
    expect(getCountry('250')?.cca2).toBe('FR');
    expect(getCountry('France')?.cca2).toBe('FR');
  });

  it('returns undefined for unknown input', () => {
    expect(getByCca2('XX')).toBeUndefined();
    expect(getByCca3('XXX')).toBeUndefined();
    expect(getByName('Atlantis')).toBeUndefined();
    expect(getCountry('nope')).toBeUndefined();
  });
});
