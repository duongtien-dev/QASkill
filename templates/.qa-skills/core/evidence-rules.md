# Core: Evidence Rules

Every test case must be justified by evidence, an assumption (clearly marked), or a
standard UI behavior. This file defines how to classify and record evidence.

## Evidence Priority

```text
1. Explicit requirement / business rule
2. Current source code
3. API contract
4. UI screenshot
5. Existing project conventions
6. Reasonable QA hypothesis marked as an ASSUMPTION
```

## Evidence Status Values

```text
KNOWN              stated explicitly or observable and certain
INFERRED_FROM_CODE derived from source code that clearly implements the behavior
ASSUMPTION         a reasonable QA hypothesis, not confirmed by evidence
UNKNOWN            a business rule that is required but not provided
```

Never silently convert an ASSUMPTION into a requirement.

## Evidence Field Examples

```text
Evidence:
Requirement: Password length is 8-20 characters.
```

```text
Evidence:
Source: LoginForm.tsx sets minLength={8} and maxLength={20}.
```

```text
Evidence:
UI: Remember me checkbox is visible on the login screen.
```

```text
Evidence:
Assumption: Standard browser behavior for a native email input.
```

## Rules

- Prefer source code over screenshots for validation thresholds.
- Cite the specific file, prop, attribute or requirement text when possible.
- If two sources conflict, follow the priority order above and note the conflict.
- If evidence is missing, do not guess a numeric rule. Use the Unknown Rule format.

## Unknown Rule Format

When a business rule is unknown, do not assert a specific behavior.

```text
Potential test area:
Repeated failed login attempts.

Status:
Requires business rule confirmation.

Reason:
No retry/lock policy is provided.
```
