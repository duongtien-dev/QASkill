# Preset: Pagination

## Apply When

The UI provides page navigation for a list or table.

## Core Areas

- Navigation controls
- Boundary states (first/last page)
- Page-size boundaries
- Interaction with search/filter and deletions

## Recommended Skills

- ui-analysis
- functional-testing
- boundary-value
- interaction-testing
- state-testing
- testcase-review

## Scenario Checklist

```text
First page
Next page
Previous page
Last page if present
Single page
No data
Exactly page-size records
Page-size + 1 records
Change page after search/filter
Deleted last item on page
Disabled previous on first page
Disabled next on last page
```

## Missing Business Rules To Flag

```text
page size
total count source
behavior when the current page becomes empty
max page links shown
```

## Common Duplicate Cases

- "Go to next page" vs "click page 2" when they are the same navigation.
- Boundary count cases when page size is unknown (they become assumptions).

Only use numeric boundaries if page size is known.
