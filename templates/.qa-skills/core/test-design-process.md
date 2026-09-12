# Core: Test Design Process (Internal)

Run these steps internally. Do **not** print them. The response contains only the
final test cases.

## Steps

```text
1. Collect evidence: requirement, source, API contract, screenshot, existing tests.
2. Identify the target screen/feature and its business goal.
3. Inventory interactive elements and states (see skills/ui-analysis).
4. Extract known constraints: required, min/max, minLength/maxLength, pattern,
   disabled/loading/error conditions, permissions.
5. Select only the skills and presets whose elements exist on the target.
6. Generate candidate cases by category:
   functional, validation, boundary, negative, interaction, state,
   responsive, accessibility.
7. Deduplicate and merge data variants.
8. Rank by importance, apply the active mode limits, keep critical cases.
9. Produce the output in the configured format.
```

Steps 1-6 are analysis only and must never appear in the response.

## Granularity

Avoid extremes.

```text
Too broad:  "Test the login form."
Too narrow: "Verify email input border radius."
Preferred:  "Verify required email validation when the form is submitted without an email."
```

Generate pixel-level visual tests only when explicitly requested.

## Mode Limits

```text
quick      8-15 cases
standard   15-30 cases (default)
deep       20-60 cases
```

Limits come from `testcase.limits`. When over the limit, remove the weakest cases
first and keep critical ones (`rules.preserve_critical_cases_over_limit`).
