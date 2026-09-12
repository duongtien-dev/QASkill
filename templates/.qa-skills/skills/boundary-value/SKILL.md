# Skill: Boundary Value Analysis

## Purpose

Test the edges of known ranges, limits and counts.

## Apply When

A numeric, length, date or count boundary is known from source or requirement.

## Procedure

1. Find each known boundary.
2. Use values `min-1, min, min+1` and `max-1, max, max+1`.
3. Derive the expected result from the source/requirement rule.

## Compact Output Rule

Never print one case per value. Group the data variants into a single case:

```text
Test Data: 7, 8, 9 (min-1, min, min+1); 19, 20, 21 (max-1, max, max+1)
```

## Do Not Assume

- Do not invent boundaries or numeric limits (page size, max count) that no
  evidence supports.

## Output Expectations

BOUNDARY cases naming the exact values and their source.
