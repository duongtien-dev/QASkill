import { z } from 'zod';

/**
 * Configuration schema for `.qa-skills/config.yml` (spec sections 9, 10, 55).
 *
 * Version 2 introduces response modes (quick/standard/deep) and makes compact
 * output the default. Version 1 files are migrated in memory by
 * `parseConfigString` (see `migrateConfigV1ToV2`) so existing installations keep
 * working without silently losing user settings.
 */
export const LANGUAGE_VALUES = ['en', 'vi'] as const;

/** v1.1.0 response modes (spec sections 5-8). */
export const RESPONSE_MODE_VALUES = ['quick', 'standard', 'deep'] as const;

/**
 * Output format. `compact` is the default; `detailed` is used by Deep mode.
 * `markdown` is accepted for backward compatibility with v1 installations.
 */
export const FORMAT_VALUES = ['compact', 'detailed', 'markdown'] as const;

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
export type ResponseMode = (typeof RESPONSE_MODE_VALUES)[number];
export type TestcaseFormat = (typeof FORMAT_VALUES)[number];
export type Priority = (typeof PRIORITY_VALUES)[number];
export type TestType = (typeof TYPE_VALUES)[number];

/** Compact table fields (spec sections 28, 45). */
export const DEFAULT_INCLUDE_FIELDS: string[] = [
  'id',
  'type',
  'test_case',
  'steps',
  'test_data',
  'expected_result',
  'priority',
];

/** Default case-count targets per response mode (spec sections 6-8, 9). */
export const DEFAULT_LIMITS = {
  quick: { target_min: 8, target_max: 15 },
  standard: { target_min: 15, target_max: 30 },
  deep: { target_min: 20, target_max: 60 },
} as const;

/** Default `response` block (spec sections 9, 10). */
export const DEFAULT_RESPONSE = {
  mode: 'standard',
  output_only: true,
  show_intro: false,
  show_outro: false,
  show_methodology: false,
  show_applied_skills: false,
  show_ui_inventory: false,
  show_evidence_summary: false,
  show_coverage_summary: false,
  show_recommendations: false,
  max_missing_rules: 5,
} as const;

/** Default `rules` block (spec sections 9, 55). */
export const DEFAULT_RULES = {
  prevent_business_rule_invention: true,
  remove_duplicates: true,
  group_data_variants: true,
  ask_before_testing: false,
  preserve_critical_cases_over_limit: true,
} as const;

const limitsSchema = z.object({
  quick: z.object({
    target_min: z.number().int().min(1),
    target_max: z.number().int().min(1),
  }),
  standard: z.object({
    target_min: z.number().int().min(1),
    target_max: z.number().int().min(1),
  }),
  deep: z.object({
    target_min: z.number().int().min(1),
    target_max: z.number().int().min(1),
  }),
});

const responseSchema = z.object({
  mode: z.enum(RESPONSE_MODE_VALUES).default(DEFAULT_RESPONSE.mode),
  output_only: z.boolean().default(DEFAULT_RESPONSE.output_only),
  show_intro: z.boolean().default(DEFAULT_RESPONSE.show_intro),
  show_outro: z.boolean().default(DEFAULT_RESPONSE.show_outro),
  show_methodology: z.boolean().default(DEFAULT_RESPONSE.show_methodology),
  show_applied_skills: z.boolean().default(DEFAULT_RESPONSE.show_applied_skills),
  show_ui_inventory: z.boolean().default(DEFAULT_RESPONSE.show_ui_inventory),
  show_evidence_summary: z.boolean().default(DEFAULT_RESPONSE.show_evidence_summary),
  show_coverage_summary: z.boolean().default(DEFAULT_RESPONSE.show_coverage_summary),
  show_recommendations: z.boolean().default(DEFAULT_RESPONSE.show_recommendations),
  max_missing_rules: z.number().int().min(0).max(20).default(DEFAULT_RESPONSE.max_missing_rules),
});

const rulesSchema = z.object({
  prevent_business_rule_invention: z.boolean().default(DEFAULT_RULES.prevent_business_rule_invention),
  remove_duplicates: z.boolean().default(DEFAULT_RULES.remove_duplicates),
  group_data_variants: z.boolean().default(DEFAULT_RULES.group_data_variants),
  ask_before_testing: z.boolean().default(DEFAULT_RULES.ask_before_testing),
  preserve_critical_cases_over_limit: z
    .boolean()
    .default(DEFAULT_RULES.preserve_critical_cases_over_limit),
});

/** Zod schema for a version 2 `config.yml`. */
export const configSchema = z.object({
  version: z.literal(2),
  language: z.enum(LANGUAGE_VALUES).default('en'),
  response: responseSchema.default(() => ({ ...DEFAULT_RESPONSE })),
  testcase: z.object({
    format: z.enum(FORMAT_VALUES).default('compact'),
    id_prefix: z.string().min(1).default('TC'),
    merge_similar_cases: z.boolean().default(true),
    only_applicable_cases: z.boolean().default(true),
    limits: limitsSchema.default(() => ({
      quick: { ...DEFAULT_LIMITS.quick },
      standard: { ...DEFAULT_LIMITS.standard },
      deep: { ...DEFAULT_LIMITS.deep },
    })),
    include: z.array(z.string().min(1)).min(1).default(() => [...DEFAULT_INCLUDE_FIELDS]),
  }),
  priorities: z.array(z.enum(PRIORITY_VALUES)).min(1).optional(),
  types: z.array(z.enum(TYPE_VALUES)).min(1).optional(),
  rules: rulesSchema.default(() => ({ ...DEFAULT_RULES })),
  responsive: z
    .object({
      enabled: z.boolean().default(true),
      standard_max_cases: z.number().int().min(0).default(3),
    })
    .default(() => ({ enabled: true, standard_max_cases: 3 })),
  accessibility: z
    .object({
      enabled: z.boolean().default(true),
      standard_max_cases: z.number().int().min(0).default(3),
    })
    .default(() => ({ enabled: true, standard_max_cases: 3 })),
});

export type QaskillConfig = z.infer<typeof configSchema>;

/** Build the canonical default (version 2) config, optionally forcing a language. */
export function buildDefaultConfig(language: Language = 'en'): QaskillConfig {
  return {
    version: 2,
    language,
    response: { ...DEFAULT_RESPONSE },
    testcase: {
      format: 'compact',
      id_prefix: 'TC',
      merge_similar_cases: true,
      only_applicable_cases: true,
      limits: {
        quick: { ...DEFAULT_LIMITS.quick },
        standard: { ...DEFAULT_LIMITS.standard },
        deep: { ...DEFAULT_LIMITS.deep },
      },
      include: [...DEFAULT_INCLUDE_FIELDS],
    },
    priorities: [...PRIORITY_VALUES],
    types: [...TYPE_VALUES],
    rules: { ...DEFAULT_RULES },
    responsive: { enabled: true, standard_max_cases: 3 },
    accessibility: { enabled: true, standard_max_cases: 3 },
  };
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGE_VALUES as readonly string[]).includes(value);
}

export function isResponseMode(value: unknown): value is ResponseMode {
  return typeof value === 'string' && (RESPONSE_MODE_VALUES as readonly string[]).includes(value);
}

interface LegacyConfigShape {
  version?: unknown;
  language?: unknown;
  testcase?: {
    format?: unknown;
    id_prefix?: unknown;
    include?: unknown;
  };
  priorities?: unknown;
  types?: unknown;
  rules?: {
    include_unknown_rules_section?: unknown;
    include_coverage_summary?: unknown;
    prevent_business_rule_invention?: unknown;
    remove_duplicates?: unknown;
  };
  responsive?: { enabled?: unknown };
  accessibility?: { enabled?: unknown };
}

function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

/**
 * Migrate a version 1 config object to version 2 (spec section 56).
 *
 * Preserves the user's language, known rule flags and enabled categories, then
 * adds the v2 response defaults and switches the default format to `compact`.
 * The raw language value is preserved so an invalid language still fails
 * validation instead of being silently rewritten.
 */
export function migrateConfigV1ToV2(raw: unknown): Record<string, unknown> {
  const legacy = (raw ?? {}) as LegacyConfigShape;
  const priorities = asArray(legacy.priorities);
  const types = asArray(legacy.types);
  const include = asArray(legacy.testcase?.include)?.filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return {
    version: 2,
    language: typeof legacy.language === 'string' ? legacy.language : 'en',
    response: {
      ...DEFAULT_RESPONSE,
      ...(legacy.rules?.include_coverage_summary === true ? { show_coverage_summary: true } : {}),
    },
    testcase: {
      format: 'compact',
      id_prefix:
        typeof legacy.testcase?.id_prefix === 'string' && legacy.testcase.id_prefix.length > 0
          ? legacy.testcase.id_prefix
          : 'TC',
      merge_similar_cases: true,
      only_applicable_cases: true,
      limits: {
        quick: { ...DEFAULT_LIMITS.quick },
        standard: { ...DEFAULT_LIMITS.standard },
        deep: { ...DEFAULT_LIMITS.deep },
      },
      include: include && include.length > 0 ? include : [...DEFAULT_INCLUDE_FIELDS],
    },
    ...(priorities ? { priorities } : {}),
    ...(types ? { types } : {}),
    rules: {
      prevent_business_rule_invention:
        typeof legacy.rules?.prevent_business_rule_invention === 'boolean'
          ? legacy.rules.prevent_business_rule_invention
          : true,
      remove_duplicates:
        typeof legacy.rules?.remove_duplicates === 'boolean'
          ? legacy.rules.remove_duplicates
          : true,
      group_data_variants: true,
      ask_before_testing: false,
      preserve_critical_cases_over_limit: true,
    },
    responsive: {
      enabled: typeof legacy.responsive?.enabled === 'boolean' ? legacy.responsive.enabled : true,
      standard_max_cases: 3,
    },
    accessibility: {
      enabled:
        typeof legacy.accessibility?.enabled === 'boolean' ? legacy.accessibility.enabled : true,
      standard_max_cases: 3,
    },
  };
}
