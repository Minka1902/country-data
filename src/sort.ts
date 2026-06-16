import { countries } from './generated/countries';
import type { Country } from './types';

export type SortDirection = 'asc' | 'desc';

function direction(dir: SortDirection): number {
  return dir === 'desc' ? -1 : 1;
}

/** Sort countries by common name. Returns a new array. */
export function sortByName(
  list: Country[] = countries,
  dir: SortDirection = 'asc',
): Country[] {
  const d = direction(dir);
  return [...list].sort((a, b) => a.name.common.localeCompare(b.name.common) * d);
}

/** Sort countries by population. Returns a new array. */
export function sortByPopulation(
  list: Country[] = countries,
  dir: SortDirection = 'desc',
): Country[] {
  const d = direction(dir);
  return [...list].sort((a, b) => (a.population - b.population) * d);
}

/** Sort countries by land area. Returns a new array. */
export function sortByArea(
  list: Country[] = countries,
  dir: SortDirection = 'desc',
): Country[] {
  const d = direction(dir);
  return [...list].sort((a, b) => (a.area - b.area) * d);
}
