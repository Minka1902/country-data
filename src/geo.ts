import type { Cca2 } from './generated/codes';
import type { Country } from './types';
import { getByCca2 } from './lookup';

function resolve(input: Cca2 | string | Country): Country | undefined {
  return typeof input === 'string' ? getByCca2(input) : input;
}

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance between two countries' representative coordinates
 * (`latlng`), using the haversine formula.
 *
 * Accepts alpha-2 codes or `Country` objects. Returns `undefined` if either
 * country cannot be resolved. Defaults to kilometres.
 */
export function distanceBetween(
  a: Cca2 | string | Country,
  b: Cca2 | string | Country,
  unit: 'km' | 'mi' = 'km',
): number | undefined {
  const ca = resolve(a);
  const cb = resolve(b);
  if (!ca || !cb) return undefined;

  const [lat1, lon1] = ca.latlng;
  const [lat2, lon2] = cb.latlng;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const km = 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));

  return unit === 'mi' ? km / KM_PER_MILE : km;
}
