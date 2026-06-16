import type { Cca2, Cca3, Ccn3 } from './generated/codes';
import { getByCca2, getByCca3, getByCcn3 } from './lookup';

/** Convert an alpha-2 code to alpha-3, e.g. `"US"` → `"USA"`. */
export function alpha2ToAlpha3(cca2: Cca2 | string): Cca3 | undefined {
  return getByCca2(cca2)?.cca3;
}

/** Convert an alpha-3 code to alpha-2, e.g. `"USA"` → `"US"`. */
export function alpha3ToAlpha2(cca3: Cca3 | string): Cca2 | undefined {
  return getByCca3(cca3)?.cca2;
}

/** Convert an alpha-2 code to ISO numeric, e.g. `"US"` → `"840"`. */
export function alpha2ToNumeric(cca2: Cca2 | string): string | undefined {
  return getByCca2(cca2)?.ccn3 || undefined;
}

/** Convert an ISO numeric code to alpha-2, e.g. `"840"` → `"US"`. */
export function numericToAlpha2(ccn3: Ccn3 | string | number): Cca2 | undefined {
  return getByCcn3(ccn3)?.cca2;
}

/** Convert an alpha-3 code to ISO numeric, e.g. `"USA"` → `"840"`. */
export function alpha3ToNumeric(cca3: Cca3 | string): string | undefined {
  return getByCca3(cca3)?.ccn3 || undefined;
}

/** Convert an ISO numeric code to alpha-3, e.g. `"840"` → `"USA"`. */
export function numericToAlpha3(ccn3: Ccn3 | string | number): Cca3 | undefined {
  return getByCcn3(ccn3)?.cca3;
}

/**
 * Build a Unicode emoji flag from an alpha-2 code, e.g. `"ZA"` → `🇿🇦`.
 * Returns `undefined` if the input is not two ASCII letters.
 */
export function emojiFlag(cca2: Cca2 | string): string | undefined {
  const code = String(cca2).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return undefined;
  const A = 0x1f1e6;
  const a = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    A + (code.charCodeAt(0) - a),
    A + (code.charCodeAt(1) - a),
  );
}
