# Preset: Search

## Apply When

The UI contains a keyword/text search input.

## Candidate Areas

```text
exact match
partial match
no result
clear search
whitespace
special characters
case sensitivity only if known
rapid typing
debounce behavior if code indicates debounce
search then pagination
search then filter
```

## Only Applicable

Include only the behaviors the search implements.

## Missing Rules To Flag

```text
case sensitivity
which fields are searched
debounce delay
minimum query length
result ordering
```

## Common Duplicates

- "Search with no results" vs "search returns empty" when they are the same state.
- Clear-search repeated after each query variation with no path difference.
