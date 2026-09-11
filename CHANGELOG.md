# Changelog

All notable changes to this project are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

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
