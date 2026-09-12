# Preset: Pagination

## Apply When

The UI provides page navigation for a list or table.

## Candidate Areas

```text
first page
next page
previous page
last page if present
single page
no data
exactly page-size records (only if page size is known)
page-size + 1 records (only if page size is known)
change page after search/filter
deleted last item on page
disabled previous on first page
disabled next on last page
```

## Only Applicable

Include only the controls the UI implements. Only use numeric boundaries when the
page size is known.

## Missing Rules To Flag

```text
page size
total count source
behavior when the current page becomes empty
max page links shown
```

## Common Duplicates

- "Go to next page" vs "click page 2" when they are the same navigation.
- Boundary count cases when the page size is unknown (they become assumptions).
