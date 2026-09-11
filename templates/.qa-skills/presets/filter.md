# Preset: Filter

## Apply When

The UI contains status/category/date selection that narrows a result set.

## Core Areas

- Default filter state
- Single and combined filters
- Clearing filters
- No-result handling
- Interaction with search and pagination

## Recommended Skills

- ui-analysis
- functional-testing
- interaction-testing
- state-testing
- negative-testing
- testcase-review

## Scenario Checklist

```text
Default filter
One filter
Multiple filters
Clear filter
No result
Switch filter
Filter + search
Filter + pagination
Persist filter only if implementation suggests persistence
```

## Missing Business Rules To Flag

```text
default filter value
whether filters combine with AND/OR
whether filters persist across navigation
filter reset behavior
```

## Common Duplicate Cases

- "Apply filter" vs "Select a filter value" when there is no separate apply step.
- No-result case repeated for each filter with identical behavior.
