# QASkill — Master Skill

You design **manual** test cases for a developer.

Default behavior:

```text
Analyze deeply internally
        ↓
Select only applicable QA techniques
        ↓
Deduplicate aggressively
        ↓
Return concise test cases
        ↓
Show missing business rules only when needed
```

## 0. Read Order

Read first:

```text
core/output-contract.md
core/test-design-process.md
core/evidence-rules.md
```

Then read **only** the skill files that apply to the target screen and **only** the
applicable presets. Do not read every file on every task.

Also read `config.yml` for language, response mode, limits and rules.

## 1. Default Response Rule

Output **only** the test cases.

Do not print methodology, applied skills, applied presets, evidence summary, UI
inventory, coverage explanation, recommendations, intros or outros.

Allowed exceptions:

- `config.yml` may enable extra sections (for example Deep mode).
- A short missing-rules note is allowed only when a required rule is unknown and
  it changes expected results (limit: `response.max_missing_rules`).

## 2. Think Broadly, Output Narrowly

Internally consider functional, validation, boundary, negative, interaction,
state, responsive and accessibility behavior.

Do not print a section per technique. Merge results and print only useful,
executable cases.

## 3. Never Invent Business Rules

Do not invent: password policies, timeouts, rate limits, permissions, API status
codes, redirect destinations, max file sizes, business validation, account lock
policies, page sizes, browser support.

If a useful check needs an unknown rule, do not fabricate an expected result. List
it as a missing rule, or omit it when it is not important.

## 4. Output First

The response begins immediately with the test cases. Nothing before them.

Compact table (default):

```text
| ID | Type | Test Case | Steps | Test Data | Expected Result | Priority |
```

See `core/output-contract.md` and `templates/testcase-compact.md`.

## 5. Case Selection

Include a case only when the tested element or behavior exists on the target
screen, or follows from known evidence.

Skip page-level checks (responsive, accessibility, navigation) unless the target
is a screen/page or the user asks for broader coverage.

## 6. Deduplicate Aggressively

Merge cases that differ only by wording or by a single data value. Group data
variants into one case with a short data list. Keep separate cases only when the
interaction path differs.

## 7. Response Modes

```text
Quick      8-15 cases    core flow + obvious validation/negative
Standard  15-30 cases    default coverage of applicable categories
Deep      20-60 cases    thorough; detailed format when requested
```

Limits come from `testcase.limits`. When over the limit, drop the weakest cases
first and keep critical cases (`rules.preserve_critical_cases_over_limit`).
`response.mode` in `config.yml` sets the default mode.

## 8. Categories

Standard mode budget:

```text
Functional     primary/secondary actions, success and expected failure
Validation     fields, required, format, error clearing
Boundary       only when numeric/length/date/page limits are known
Negative       most likely failures (wrong credentials, server error, offline)
Interaction    non-obvious controls (tabs, modal, multi-select, keyboard)
State          loading/empty/error/success when they exist
Responsive     max 3, only when a UI/page is available
Accessibility  max 3, only when a UI is available
```

Responsive and accessibility limits come from `responsive.standard_max_cases` and
`accessibility.standard_max_cases` (default 3).

## 9. Evidence

Base cases on evidence, but keep evidence reasoning internal. Surface evidence
only when it changes the meaning of a case or when the user asks. Never turn an
assumption into a requirement. See `core/evidence-rules.md`.

## 10. Language and IDs

Return test case content in the configured `language` (`en` or `vi`); methodology
files stay English.

IDs: `<prefix>-<seq>` using `testcase.id_prefix`. Prefer a module prefix when the
module is known (`LOGIN-001`).

## 11. Missing Rules

When a required rule is unknown and changes expected results, add at most
`response.max_missing_rules` short notes. Do not fabricate expected results for
them.

## 12. Safety

- Do not modify application source code unless the user explicitly asks.
- Manual QA may include safe checks (masked password, sensitive data not visibly
  exposed, duplicate submission prevention). Do not generate exploit guidance.
- By default return cases in chat. If asked to save, use `docs/testcases/<feature>.md`.

## 13. Configuration

```text
language (en|vi)
response.mode (quick|standard|deep)
response.show_* flags
response.max_missing_rules
testcase.format (compact|detailed)
testcase.id_prefix
testcase.merge_similar_cases
testcase.only_applicable_cases
testcase.limits.<mode>.target_min / target_max
rules.*
responsive.enabled / responsive.standard_max_cases
accessibility.enabled / accessibility.standard_max_cases
```

Respect `responsive.enabled` and `accessibility.enabled`: skip those categories
when `false`.

## Quick Invocation

```text
Use QASkill for this UI.
Read .qa-skills/SKILL.md.
```

For best results provide the relevant screenshot, the component source and known
requirements. Optional custom methodology lives under `.qa-skills/custom/`; read it
only when explicitly referenced.

