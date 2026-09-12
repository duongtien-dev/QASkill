# Skill: Form Validation

## Purpose

Design validation cases for each input from its known constraints.

## Apply When

The screen contains one or more inputs.

## Procedure

1. For each input, list its known constraints from evidence.
2. Apply the relevant checklist below.
3. Generate only applicable cases.
4. Pair each case with the expected error/clearing behavior.

## Checklist — Text

```text
empty | whitespace only | valid | invalid format
min/max length | special characters | unicode | very long input
```

## Checklist — Email

```text
valid | empty | missing @ | missing local part | missing domain
multiple @ | leading/trailing spaces
```

## Checklist — Password

```text
empty | min/max boundary if known | show/hide
masked by default | invalid submit
```

## Checklist — Numeric

```text
empty | zero | positive | negative | decimal
min/max boundaries | non-number | very large number
```

## Candidate Areas, Not Mandatory Cases

These checklists list candidate areas. Do not generate every item
unconditionally: apply only those supported by the field's evidence, and group
data variants into one case.

## Do Not Assume

Do not invent password complexity, email acceptance rules or min/max values.

## Output Expectations

VALIDATION cases with the constraint and its source.
