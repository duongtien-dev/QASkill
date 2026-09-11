# Preset: Search

## Apply When

The UI contains a keyword/text search input.

## Core Areas

- Match behavior
- No-result handling
- Clearing and whitespace
- Interaction with pagination and filters

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- negative-testing
- interaction-testing
- state-testing
- testcase-review

## Scenario Checklist

```text
Exact match
Partial match
No result
Clear search
Whitespace
Special characters
Case sensitivity only if known
Rapid typing
Debounce behavior if code indicates debounce
Search then pagination
Search then filter
```

## Missing Business Rules To Flag

```text
case sensitivity
which fields are searched
debounce delay
minimum query length
result ordering
```

## Common Duplicate Cases

- "Search with no results" vs "search returns empty" when they are the same state.
- Clear-search repeated after each query variation with no path difference.
