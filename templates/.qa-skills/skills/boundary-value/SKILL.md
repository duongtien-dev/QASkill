# Skill: Boundary Value Analysis

## Purpose

Test the edges of every known range, limit or count.

## Apply When

Any constraint with a known numeric or length boundary exists, or any paginated /
counted collection exists.

## Inputs To Inspect

- min / max / minLength / maxLength
- Page size, total counts, item limits
- Date ranges, quantities, percentages, scores

## Procedure

1. Find each known boundary.
2. Design cases at `min-1, min, min+1` and `max-1, max, max+1`.
3. Derive expected results from the source/requirement rule.

## General Formula

```text
min - 1
min
min + 1
max - 1
max
max + 1
```

Example with `min = 8`, `max = 20`:

```text
7, 8, 9, 19, 20, 21
```

## Checklist — Apply To

```text
string length
numeric value
date range
pagination
file count
quantity
time
score
percentage
allowed items
```

## Do Not Assume

- Do not generate imaginary boundaries.
- Do not use numeric boundaries (e.g. page size) unless the value is known.

## Output Expectations

Cases classified as type BOUNDARY, each stating the exact value used and its source.
