# Skill: Test Case Review

## Purpose

Review the generated set before returning it, to guarantee quality and eliminate
noise.

## Apply When

Always, as the final step before producing output.

## Inputs To Inspect

- The full list of generated cases
- The UI inventory
- The evidence for each case

## Procedure

1. Remove duplicates and merge equivalent cases.
2. Remove vague, unexecutable or unsupported cases.
3. Ensure every case has a single clear observable result.
4. Confirm coverage using `core/coverage-checklist.md`.
5. Confirm IDs are unique and ordered.

## Remove Cases That Are

```text
duplicate
too vague
unsupported by evidence
unexecutable
same scenario with different wording
not relevant to the target feature
```

## Every Final Case Must Answer

```text
What is tested?
What condition is required?
What actions are performed?
What data is used?
What observable result should occur?
```

## Do Not Assume

- Do not keep a case just to increase the count.
- Do not keep separate cases for the same condition with different wording.

## Output Expectations

A de-duplicated, prioritized, evidence-backed case set followed by a Coverage
Summary and a Questions / Missing Rules section.
