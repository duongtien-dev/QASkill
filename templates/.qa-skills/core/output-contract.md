# Core: Output Contract

The standardized output format for generated manual test cases.

## Default Fields

```text
ID
Module
Type
Title
Preconditions
Steps
Test Data
Expected Result
Priority
Evidence
```

## IDs

Default when no module is known:

```text
TC-001
TC-002
TC-003
```

Prefer a module-specific prefix when the module is known:

```text
LOGIN-001
USER-001
COURSE-001
```

Global uniqueness across the whole repository is not required.

## Types

One primary type per case (choose the dominant concern):

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

## Priority Guidance

```text
HIGH    primary business path, data loss risk, critical validation,
        create/update/delete, authentication, blocking error

MEDIUM  secondary behavior, common negative case, boundary,
        search/filter, loading/empty/error state

LOW     minor usability, non-critical visual/interaction behavior,
        low-impact edge scenario
```

Priority is a heuristic unless project rules specify otherwise.

## Test Context Header

```markdown
# Manual Test Cases — <Feature>

## Test Context

**Target:** <screen / feature>

**Evidence used:**
- `<file>`
- <screenshot / requirement>

**Applied skills:**
- <skill>

**Applied presets:**
- <preset>
```

## Formats

- Markdown (default): see `templates/testcase-markdown.md`.
- Compact table (when `testcase.format: compact`): see `templates/testcase-compact.md`.
- Coverage summary: see `templates/coverage-report.md`.

## Language

Return test case content in the configured `language` (`en` or `vi`). The skill
methodology files remain in English for consistency.
