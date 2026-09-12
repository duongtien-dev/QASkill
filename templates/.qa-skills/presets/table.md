# Preset: Table

## Apply When

The UI renders tabular data (rows and columns).

## Candidate Areas

```text
rows and columns render
empty / loading / error states
long text
large row count
row action
selection
sort if present
pagination if present
search / filter integration
responsive behavior
```

## Only Applicable

Include only the features the table implements.

## Missing Rules To Flag

```text
default sort order
default page size
column visibility rules
row selection semantics
```

## Common Duplicates

- "Table shows data" vs "rows render".
- Multiple empty-state cases describing the same condition.
- Selection cases repeated per row-action variation.
