import { z } from 'zod';

/**
 * Configuration schema for `.qa-skills/config.yml` (spec sections 33, 34, 65).
 *
 * The schema mirrors the documented default config while tolerating extra
 * documented fields, so a hand-edited config that adds a recognized field does
 * not fail validation.
 */
export const LANGUAGE_VALUES = ['en', 'vi'] as const;
export const FORMAT_VALUES = ['markdown', 'compact'] as const;
export const PRIORITY_VALUES = ['HIGH', 'MEDIUM', 'LOW'] as const;
export const TYPE_VALUES = [
  'FUNCTIONAL',
  'VALIDATION',
  'BOUNDARY',
  'NEGATIVE',
  'INTERACTION',
  'STATE',
  'RESPONSIVE',
  'ACCESSIBILITY',
] as const;

export type Language = (typeof LANGUAGE_VALUES)[number];
export type TestcaseFormat = (typeof FORMAT_VALUES)[number];
export type Priority = (typeof PRIORITY_VALUES)[number];
export type TestType = (typeof TYPE_VALUES)[number];

export const DEFAULT_INCLUDE_FIELDS: string[] = [
  'id',
  'module',
  'type',
  'title',
  'preconditions',
  'steps',
  'test_data',
  'expected_result',
  'priority',
  'evidence',
];

export const configSchema = z.object({
  version: z.number().int().positive(),
  language: z.enum(LANGUAGE_VALUES).default('en'),
  testcase: z.object({
    format: z.enum(FORMAT_VALUES),
    id_prefix: z.string().min(1),
    include: z.array(z.string().min(1)).min(1),
  }),
  priorities: z.array(z.enum(PRIORITY_VALUES)).min(1).optional(),
  types: z.array(z.enum(TYPE_VALUES)).min(1).optional(),
  rules: z.object({
    include_unknown_rules_section: z.boolean(),
    include_coverage_summary: z.boolean(),
    prevent_business_rule_invention: z.boolean(),
    remove_duplicates: z.boolean(),
  }),
  responsive: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  accessibility: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
});

export type QaskillConfig = z.infer<typeof configSchema>;

/** Build the canonical default config, optionally forcing a language. */
export function buildDefaultConfig(language: Language = 'en'): QaskillConfig {
  return {
    version: 1,
    language,
    testcase: {
      format: 'markdown',
      id_prefix: 'TC',
      include: [...DEFAULT_INCLUDE_FIELDS],
    },
    priorities: [...PRIORITY_VALUES],
    types: [...TYPE_VALUES],
    rules: {
      include_unknown_rules_section: true,
      include_coverage_summary: true,
      prevent_business_rule_invention: true,
      remove_duplicates: true,
    },
    responsive: { enabled: true },
    accessibility: { enabled: true },
  };
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGE_VALUES as readonly string[]).includes(value);
}
