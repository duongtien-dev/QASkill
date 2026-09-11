import { describe, expect, it } from 'vitest';
import {
  buildDefaultConfig,
  configSchema,
  isLanguage,
} from '../src/schemas/config.schema';
import { parseConfigString, serializeConfig } from '../src/services/config-manager';

describe('config schema', () => {
  it('validates the default config', () => {
    const result = configSchema.safeParse(buildDefaultConfig());
    expect(result.success).toBe(true);
  });

  it('defaults the language to en', () => {
    const config = buildDefaultConfig();
    expect(config.language).toBe('en');
    expect(config.rules.prevent_business_rule_invention).toBe(true);
  });

  it('rejects an invalid language', () => {
    const config = { ...buildDefaultConfig(), language: 'fr' };
    const result = configSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid format', () => {
    const base = buildDefaultConfig();
    const config = { ...base, testcase: { ...base.testcase, format: 'pdf' } };
    const result = configSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('parses a serialized config back to the same object', () => {
    const config = buildDefaultConfig('vi');
    const parsed = parseConfigString(serializeConfig(config));
    expect(parsed).toEqual(config);
  });

  it('throws a readable error for invalid YAML', () => {
    expect(() => parseConfigString('version: 1\n  bad: [unclosed')).toThrow(/not valid YAML/);
  });

  it('throws a readable error for a missing language value', () => {
    expect(() => parseConfigString('version: 1\nlanguage: de\n')).toThrow(/invalid/);
  });

  it('recognises supported languages', () => {
    expect(isLanguage('en')).toBe(true);
    expect(isLanguage('vi')).toBe(true);
    expect(isLanguage('jp')).toBe(false);
  });
});
