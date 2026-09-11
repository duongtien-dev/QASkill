# Skill: Functional Testing

## Purpose

Verify that each feature performs its intended job under normal and abnormal
conditions.

## Apply When

Always, for every primary and secondary action on the screen.

## Inputs To Inspect

- Event handlers (onClick, onSubmit, onChange)
- API service calls and their success/failure handling
- Navigation/redirect logic
- Feature requirements

## Procedure

1. Identify the primary action of the screen.
2. Identify secondary actions (cancel, reset, refresh, export).
3. For each action, derive success and failure behavior from evidence.
4. Generate a success case, an expected-failure case, a cancellation case and a
   repeated-action case where applicable.

## Checklist

```text
Primary action
Secondary action
Navigation
Data submission
Cancel
Reset
Create
Edit
Delete
View
Refresh
State update
Confirmation
Success response
Failure response
```

## Do Not Assume

- Do not assume redirect destinations, status codes or success messages.
- Do not assume a rule (limits, permissions) that no evidence supports.

## Output Expectations

For every primary feature, at least:

```text
- successful normal workflow
- expected failure workflow
- user cancellation workflow (if applicable)
- repeated action behavior (if applicable)
```

Each case classified as type FUNCTIONAL and justified with Evidence.
