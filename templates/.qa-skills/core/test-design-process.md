# Core: Test Design Process

Follow these steps in order. Do not generate test cases before the inventory is
complete.

## Step 1 — Collect Evidence

Gather requirements, source code, API contract, screenshots and existing tests.

## Step 2 — Identify Target

Name the screen/feature and the business goal it serves.

## Step 3 — Inventory UI Elements

Use `skills/ui-analysis/SKILL.md`. List every interactive and stateful element.

## Step 4 — Extract Known Rules and Constraints

From source and requirements, list concrete constraints:

```text
required
minLength / maxLength
min / max
pattern
disabled conditions
loading conditions
error and empty conditions
permission checks
```

## Step 5 — Identify UI States

Look for default, loading, success, error, empty, disabled, read-only,
no-permission, no-result, partial, offline and stale states.

## Step 6 — Select Skills and Presets

Pick only the skills and presets whose elements exist on the target screen.

## Step 7 — Generate Cases by Category

Generate in this order so nothing is missed:

```text
1. Functional (happy path)
2. Validation
3. Boundary
4. Negative
5. Interaction
6. State
7. Responsive (if UI available)
8. Accessibility (if applicable)
```

For every primary feature, include at least a successful workflow, an expected
failure workflow, a cancellation workflow when applicable, and repeated-action
behavior when applicable.

## Step 8 — Remove Duplicates

Apply `skills/testcase-review/SKILL.md`.

## Step 9 — Review Coverage

Apply `core/coverage-checklist.md`.

## Step 10 — Mark Unknown Rules

Add a `## Questions / Missing Rules` section.

## Step 11 — Produce Output

Use the configured format from `core/output-contract.md`.

## Granularity

Avoid extremes.

```text
Too broad:  "Test the login form."
Too narrow: "Verify email input border radius."
Preferred:  "Verify required email validation when the form is submitted without an email."
```

Generate pixel-level visual tests only when explicitly requested.
