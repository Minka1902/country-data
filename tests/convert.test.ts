import { describe, it, expect } from 'vitest';
import {
  alpha2ToAlpha3,
  alpha3ToAlpha2,
  alpha2ToNumeric,
  numericToAlpha2,
  alpha3ToNumeric,
  numericToAlpha3,
  emojiFlag,
} from '../src/index';

describe('conversions', () => {
  it('round-trips alpha-2 <-> alpha-3', () => {
    expect(alpha2ToAlpha3('US')).toBe('USA');
    expect(alpha3ToAlpha2('USA')).toBe('US');
  });

  it('round-trips alpha <-> numeric', () => {
    expect(alpha2ToNumeric('US')).toBe('840');
    expect(numericToAlpha2('840')).toBe('US');
    expect(alpha3ToNumeric('DEU')).toBe('276');
    expect(numericToAlpha3('276')).toBe('DEU');
  });

  it('builds emoji flags from alpha-2', () => {
    expect(emojiFlag('ZA')).toBe('🇿🇦');
    expect(emojiFlag('us')).toBe('🇺🇸');
  });

  it('returns undefined on invalid input', () => {
    expect(alpha2ToAlpha3('XX')).toBeUndefined();
    expect(numericToAlpha3('999')).toBeUndefined();
    expect(emojiFlag('U')).toBeUndefined();
    expect(emojiFlag('123')).toBeUndefined();
  });
});
