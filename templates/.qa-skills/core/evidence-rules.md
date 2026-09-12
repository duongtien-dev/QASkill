# Core: Evidence Rules

Every test case must be justified by evidence, a clearly marked assumption, or a
standard UI behavior.

## Evidence Priority

```text
1. Explicit requirement / business rule
2. Current source code
3. API contract
4. UI screenshot
5. Existing project conventions
6. Reasonable QA hypothesis marked as an ASSUMPTION
```

## Evidence Controls Correctness, Not Verbosity

Evidence reasoning is internal. Do not print an evidence summary by default.

Surface evidence only when:

- it changes the meaning or expected result of a case; or
- the user explicitly asks for traceability
  (`response.show_evidence_summary: true`).

## Status Values

```text
KNOWN                stated explicitly or observable and certain
INFERRED_FROM_CODE   derived from source that clearly implements the behavior
ASSUMPTION           a reasonable hypothesis, not confirmed by evidence
UNKNOWN              a business rule that is required but not provided
```

Never silently convert an ASSUMPTION into a requirement.

## Missing Rules

When a required rule is unknown, do not fabricate an expected result. Report it as
a missing rule (limited by `response.max_missing_rules`) or omit it when it does
not matter.

## Example (Internal Reasoning)

```text
Requirement: password length is 8-20.
Source: LoginForm.tsx sets minLength={8} maxLength={20}.
Result: one BOUNDARY case with data 7, 8, 9, 19, 20, 21.
```
