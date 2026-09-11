# Preset: Table

## Apply When

The UI renders tabular data (rows and columns).

## Core Areas

- Rendering and columns
- Empty / loading / error states
- Long and large content
- Row actions and selection
- Sorting and integration with search/filter/pagination

## Recommended Skills

- ui-analysis
- functional-testing
- state-testing
- interaction-testing
- responsive-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Render rows
Columns
Empty data
Loading
Error
Long text
Large row count
Row action
Selection
Sort if present
Pagination if present
Search/filter integration
Responsive behavior
```

## Missing Business Rules To Flag

```text
default sort order
default page size
column visibility rules
row selection semantics
```

## Common Duplicate Cases

- "Table shows data" vs "rows render".
- Multiple empty-state cases that describe the same condition.
- Selection cases repeated per row-action variation.
