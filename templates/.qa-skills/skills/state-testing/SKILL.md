# Skill: State Testing

## Purpose

Ensure every visible UI state renders and transitions correctly.

## Apply When

The screen has asynchronous data, permissions, or conditional rendering.

## Inputs To Inspect

- Loading flags, error flags, empty conditions
- Permission checks and role conditions
- Skeleton/placeholder rendering
- Offline/network handling

## Procedure

1. Enumerate the states from source/UI evidence.
2. For each state, design a case that reaches it and verifies the transition.
3. Verify transitions in both directions (loading -> success, loading -> error).

## Checklist

Search source/UI for these states:

```text
default
loading
success
error
empty
disabled
read-only
no permission
no result
partial data
offline / network failure
stale data
```

Example for a table:

```text
loading table
table with rows
empty table
API error
search no results
```

## Do Not Assume

- Do not invent state triggers that are not implemented.
- Do not assume a specific error presentation without evidence.

## Output Expectations

Cases classified as type STATE, describing the trigger and the expected visible state.
