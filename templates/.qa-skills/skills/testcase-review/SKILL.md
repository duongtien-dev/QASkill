# Skill: Test Case Review

## Purpose

Final internal quality gate before returning the case set.

## Apply When

Always, as the last internal step.

## Procedure

1. Remove duplicates and merge equivalent cases.
2. Merge data variants into one case (`rules.group_data_variants`).
3. Remove vague, unexecutable or unsupported cases.
4. Ensure every case has one clear observable result.
5. Apply the active mode limits; keep critical cases when over the limit.
6. Confirm IDs are unique and ordered.

## Remove Cases That Are

```text
duplicate
too vague
unsupported by evidence
unexecutable
same condition with different wording
not relevant to the target feature
```

## Do Not Print

Do not print the review, a coverage summary, applied skills or applied presets
unless `config.yml` enables them. Return only the final cases.

## Output Expectations

A de-duplicated, prioritized, evidence-backed case set within the mode limits.
