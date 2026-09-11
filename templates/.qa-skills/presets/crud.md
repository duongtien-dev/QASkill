# Preset: CRUD

## Apply When

The UI allows creating, reading, updating or deleting records.

## Core Areas

- Create flow
- Read/list and detail view
- Update flow
- Delete flow with confirmation
- Post-mutation refresh and error handling

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- negative-testing
- interaction-testing
- state-testing
- responsive-testing
- testcase-review

## Scenario Checklist

```text
Create
Read/List
View detail
Update
Delete
Cancel delete
Delete confirmation
Refresh after mutation
Error handling
Permission if known
Duplicate item if relevant
Empty state
```

## Missing Business Rules To Flag

```text
required fields per entity
unique constraints
delete permissions
cascade behavior
audit/soft-delete rules
```

## Common Duplicate Cases

- "Delete" and "Confirm delete" treated as separate when only confirmation matters.
- "Cancel delete" repeated for each entry point with no path difference.
- "Refresh after create" vs "list reload after create" when they are the same event.
