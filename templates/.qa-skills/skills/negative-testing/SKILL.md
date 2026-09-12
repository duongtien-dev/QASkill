# Skill: Negative Testing

## Purpose

Confirm the application behaves safely and predictably under invalid or
disruptive conditions.

## Apply When

Always for primary actions, but include only realistic failures.

## Procedure

1. Identify the actions that can fail.
2. Derive the expected behavior from source/requirement.
3. Generate the most plausible negative scenarios only.

## Candidate Scenarios

```text
missing required data | invalid input | wrong credentials | duplicate submit
unauthorized action | expired session (if the app has auth)
network failure | server error | very slow response
rapid repeated click | unsupported file
```

## Only Applicable

Include a negative case only when its condition is realistic for the target. Do
not add far-fetched scenarios to increase the count.

## Do Not Assume

Do not assume exact error messages, status codes or retry policies.
Keep security-oriented tests safe and high level.

## Output Expectations

NEGATIVE cases with expected behavior from evidence, or a missing-rule note when
the behavior is unknown.
