# Skill: Negative Testing

## Purpose

Confirm the application behaves safely and predictably under invalid, unexpected
or disruptive conditions.

## Apply When

Always, for every primary action and every data-driven surface.

## Inputs To Inspect

- Error handling in source
- API failure branches
- Session/permission logic
- Network/offline handling if present

## Procedure

1. Identify the actions that can fail.
2. Derive expected behavior from source/requirement.
3. Generate the applicable negative scenarios.

## Checklist

```text
missing required data
invalid input
wrong credentials
invalid state
duplicate submit
duplicate record
stale data
unauthorized action
expired session
network failure
server failure
malformed response
very slow response
refresh during operation
back navigation
rapid repeated click
unsupported file
cancel operation
```

## Do Not Assume

- Do not assume exact error messages, status codes or retry policies.
- Keep security-oriented destructive testing high-level and safe. QASkill is not a
  penetration testing framework.

## Output Expectations

Cases classified as type NEGATIVE, with expected behavior derived from evidence or
listed under Questions / Missing Rules when unknown.
