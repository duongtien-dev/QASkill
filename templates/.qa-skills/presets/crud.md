# Preset: CRUD

## Apply When

The UI allows creating, reading, updating or deleting records.

## Candidate Areas

```text
create
read / list
view detail
update
delete
cancel delete
delete confirmation
refresh after mutation
error handling
permission if known
duplicate item if relevant
empty state
```

## Only Applicable

Include only the operations the screen implements.

## Missing Rules To Flag

```text
required fields per entity
unique constraints
delete permissions
cascade behavior
audit / soft-delete rules
```

## Common Duplicates

- "Delete" and "Confirm delete" treated as separate when only confirmation matters.
- "Cancel delete" repeated for each entry point with no path difference.
- "Refresh after create" vs "list reload after create" when they are the same event.
