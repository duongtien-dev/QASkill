# Preset: Form

## Apply When

The target is a generic data-entry form (not specifically login, not a CRUD flow).

## Core Areas

- Required vs optional fields
- Input format and boundaries
- Default values
- Submit / cancel / reset
- Error display and clearing

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- boundary-value
- negative-testing
- interaction-testing
- state-testing
- responsive-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Required fields
Optional fields
Input format
Boundary values
Default values
Submit
Cancel
Reset
Error display
Error clear behavior
Tab order
Duplicate submit
Unsaved data
Loading
Server failure
```

## Missing Business Rules To Flag

```text
field-level format rules not stated
save/submit destination
warnings on unsaved changes
permission requirements
```

## Common Duplicate Cases

- One "required field" case repeated verbatim for every field (combine or vary the
  input clearly).
- "Cancel" and "close" when they perform the same action.
- "Empty form submit" duplicated for each field.
