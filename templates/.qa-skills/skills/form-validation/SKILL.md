# Skill: Form Validation

## Purpose

Design validation cases for each input based on its known constraints.

## Apply When

The screen contains one or more inputs (text, email, password, numeric, date,
select, file).

## Inputs To Inspect

- Input `type`, `required`, `pattern`
- `min`, `max`, `minLength`, `maxLength`, `step`
- Validation schema (Zod / Yup / React Hook Form) and error messages
- Error rendering and error clearing logic

## Procedure

1. For each input, list its known constraints from evidence.
2. Apply the relevant checklist below.
3. Generate only the cases that are applicable to the evidence or standard
   browser behavior.
4. Pair each validation case with the expected error/clearing behavior.

## Checklist — Text Input

```text
Empty
Whitespace only
Leading spaces
Trailing spaces
Valid value
Invalid format
Minimum length
Maximum length
Below minimum
Above maximum
Special characters
Unicode
Copy/paste
Very long input
Duplicate value
Case sensitivity
```

## Checklist — Email Input

```text
valid email
empty
missing @
missing local part
missing domain
multiple @
leading/trailing spaces
uppercase characters
subdomain
plus alias
very long address
```

## Checklist — Password Input

```text
empty password
min length boundary if known
max length boundary if known
show/hide password
copy/paste if relevant
leading/trailing characters
submit with invalid password
password remains masked by default
```

## Checklist — Numeric Input

```text
empty / zero / positive / negative / decimal
minimum / maximum / min-1 / min+1 / max-1 / max+1
non-number / very large number / leading zero
```

## Do Not Assume

- Do not invent password complexity.
- Do not assert which uncommon email addresses are valid unless the app rule is known.
- Do not invent minimum/maximum values.

## Output Expectations

Cases classified as type VALIDATION, with the constraint and its source in Evidence.
