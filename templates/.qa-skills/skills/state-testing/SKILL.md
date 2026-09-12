# Skill: State Testing

## Purpose

Ensure visible UI states render and transition correctly.

## Apply When

The screen has asynchronous data, permissions or conditional rendering.

## Procedure

1. Enumerate states from evidence: default, loading, success, error, empty,
   disabled, read-only, no-permission, no-result, partial, offline, stale.
2. For each state, design a case that reaches it and verifies the transition.
3. Verify transitions (loading -> success, loading -> error).

## Relevance Rule

Include only states the implementation can actually produce. Do not add states
the code cannot reach.

## Do Not Assume

Do not invent triggers or assume a specific error presentation.

## Output Expectations

STATE cases describing the trigger and the expected visible state.
