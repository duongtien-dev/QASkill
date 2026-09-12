# Changelog

All notable changes to this project are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-09-12

### Changed

- **Compact output is now the default.** The default AI response starts directly
  with a compact test-case table and no longer prints methodology, applied skills,
  evidence summaries, UI inventories, coverage narration or recommendations.
- `config.yml` moved to **version 2** with a new `response` block:
  - response modes `quick` (8-15 cases), `standard` (15-30, default) and
    `deep` (20-60);
  - `output_only`, `show_*` toggles and `max_missing_rules`.
- `testcase` now uses `format: compact` by default (with `detailed` for Deep mode)
  and adds `merge_similar_cases`, `only_applicable_cases` and per-mode `limits`.
- `rules` now exposes `group_data_variants`, `ask_before_testing` and
  `preserve_critical_cases_over_limit`.
- `responsive` and `accessibility` gained `standard_max_cases` (default 3).
- Master skill, core files, all 10 skills and all 10 presets rewritten to be
  concise and to keep analysis internal.
- `qaskill init` prints a short prompt instead of a long instruction block.

### Added

- Version 1 to version 2 config migration: `qaskill update` backs up `.qa-skills`
  and then migrates `config.yml`; config loading also migrates in memory.
- `templates/testcase-detailed.md` (Deep mode output).
- Tests for the v2 schema, response modes and v1 -> v2 migration.

### Backward Compatibility

- Existing version 1 `config.yml` files keep working (auto-migrated).
- The legacy `markdown` test-case format and `testcase-markdown.md` are retained.

## [1.0.0] - 2026-09-11

### Added

- Initial MVP release.
- `qaskill` CLI (TypeScript / Node ESM) with commands:
  `init`, `list`, `add`, `remove`, `update`, `doctor`, `version`.
- Master skill (`.qa-skills/SKILL.md`) with a mandatory test-design workflow,
  evidence priority and a strict never-invent rule.
- Core methodology files: `evidence-rules`, `test-design-process`,
  `coverage-checklist`, `output-contract`.
- 10 core QA skills: ui-analysis, functional-testing, form-validation,
  boundary-value, negative-testing, interaction-testing, state-testing,
  responsive-testing, accessibility-testing, testcase-review.
- 10 presets: login, form, crud, table, search, filter, pagination, modal,
  upload, navigation.
- Output templates: markdown, compact, coverage report.
- `config.yml` with language, format and rule configuration.
- Installation metadata (`.qa-skills/.qaskill.json`).
- Safe `update` with timestamped backup; preserves `config.yml` and `custom/`.
- Unit and temporary-directory integration tests (Vitest).
- Example targets: `examples/login`, `examples/user-management`.
