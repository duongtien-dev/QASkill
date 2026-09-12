# Preset: Filter

## Apply When

The UI contains status/category/date selection that narrows a result set.

## Candidate Areas

```text
default filter
one filter
multiple filters
clear filter
no result
switch filter
filter + search
filter + pagination
persist filter only if implementation suggests persistence
```

## Only Applicable

Include only the filters and combinations the UI supports.

## Missing Rules To Flag

```text
default filter value
whether filters combine with AND/OR
whether filters persist across navigation
filter reset behavior
```

## Common Duplicates

- "Apply filter" vs "Select a filter value" when there is no separate apply step.
- No-result case repeated for each filter with identical behavior.
