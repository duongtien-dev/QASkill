# Expected Test Areas — User Management

Use this to verify QASkill output for `UserManagement.tsx`.

## Applicable presets

```text
crud
table
search
filter
pagination
modal
```

## Functional

- Load records on first render
- Search for an existing user
- Filter by status
- Add user (opens the create flow)
- Edit user
- Delete user with confirmation
- Cancel delete
- Refresh list after a successful delete

## Validation / Negative

- Search with no results
- Clear the search
- Search with whitespace / special characters
- Delete failure (API error) leaves the record intact
- Load error shows the error state

## State

- Loading state
- Loaded state with rows
- Empty state
- Load error state
- No-result state after search / filter

## Interaction

- Debounce: rapid typing triggers a single request after the delay
- Keyboard access to row actions
- Modal open / cancel / confirm
- Switch filter and search in combination

## Pagination (boundary)

- Previous disabled on the first page
- Next disabled on the last page
- Change page after search / filter
- Delete the last item on a page

## Responsive

- Table behavior on Mobile / Tablet / Desktop

## Accessibility

- Search input has an associated label
- Dialog has a role and a discernible name
- Row action buttons have accessible names

## Must remain in Questions / Missing Rules

- Real page size
- Search field coverage and case sensitivity
- Allowed status values
- Delete / edit permissions
- Default sort order
