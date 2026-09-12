import { describe, expect, it } from 'vitest';
import {
  buildDefaultConfig,
  configSchema,
  isLanguage,
  isResponseMode,
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

  it('builds a version 2 config with compact output and standard mode', () => {
    const config = buildDefaultConfig();
    expect(config.version).toBe(2);
    expect(config.response.mode).toBe('standard');
    expect(config.response.output_only).toBe(true);
    expect(config.response.show_coverage_summary).toBe(false);
    expect(config.testcase.format).toBe('compact');
    expect(config.testcase.limits.standard.target_max).toBe(30);
    expect(config.responsive.standard_max_cases).toBe(3);
    expect(config.accessibility.standard_max_cases).toBe(3);
  });

  it('rejects an unsupported response mode', () => {
    const base = buildDefaultConfig();
    const config = { ...base, response: { ...base.response, mode: 'turbo' } };
    expect(configSchema.safeParse(config).success).toBe(false);
  });

  it('applies defaults for a minimal version 2 config', () => {
    const parsed = parseConfigString('version: 2\n');
    expect(parsed.language).toBe('en');
    expect(parsed.response.mode).toBe('standard');
    expect(parsed.testcase.format).toBe('compact');
    expect(parsed.rules.group_data_variants).toBe(true);
  });

  it('migrates a version 1 config in memory', () => {
    const legacy = [
      'version: 1',
      'language: vi',
      'testcase:',
      '  format: markdown',
      '  id_prefix: TC',
      '  include: [id, title]',
      'rules:',
      '  include_coverage_summary: true',
      '  include_unknown_rules_section: true',
      '  prevent_business_rule_invention: true',
      '  remove_duplicates: true',
      '',
    ].join('\n');
    const parsed = parseConfigString(legacy);
    expect(parsed.version).toBe(2);
    expect(parsed.language).toBe('vi');
    expect(parsed.testcase.format).toBe('compact');
    expect(parsed.response.show_coverage_summary).toBe(true);
    expect(parsed.rules.group_data_variants).toBe(true);
  });

  it('recognises supported response modes', () => {
    expect(isResponseMode('quick')).toBe(true);
    expect(isResponseMode('standard')).toBe(true);
    expect(isResponseMode('deep')).toBe(true);
    expect(isResponseMode('turbo')).toBe(false);
  });
});
