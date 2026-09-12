# Core: Output Contract

The standardized output format for generated manual test cases.

## Default Response

Start with the test cases. Nothing before them.

Compact table (default, `testcase.format: compact`):

| ID | Type | Test Case | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|

- `Steps` are numbered on one line, separated by `;`.
- `Test Data` stays short. Group data variants instead of adding rows.
- `Expected Result` is one observable result.

Detailed format (`testcase.format: detailed`) is used by Deep mode; see
`templates/testcase-detailed.md`.

## IDs

`<prefix>-<seq>` using `testcase.id_prefix`. Prefer a module prefix when the
module is known (`LOGIN-001`). Global uniqueness across a repository is not
required.

## Types

One primary type per case:

```text
FUNCTIONAL
VALIDATION
BOUNDARY
NEGATIVE
INTERACTION
STATE
RESPONSIVE
ACCESSIBILITY
```

## Priority

```text
HIGH    primary business path, data loss, authentication, critical validation
MEDIUM  secondary behavior, common negative, boundary, loading/empty/error
LOW     minor usability or visual behavior, low-impact edge scenario
```

## After the Cases

Print nothing else by default.

Optional sections, each enabled only by `config.yml`:

- Coverage summary: `response.show_coverage_summary`
  (see `templates/coverage-report.md`).
- Missing rules: allowed up to `response.max_missing_rules` when a required
  business rule is unknown and changes expected results.

## Language

Return test case content in the configured `language` (`en` or `vi`). The
methodology files remain in English for consistency.
