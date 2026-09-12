# Preset: Form

## Apply When

A generic data-entry form (not login, not a CRUD flow).

## Candidate Areas

```text
required vs optional fields
input format and boundaries
default values
submit / cancel / reset
error display and clearing
duplicate submit
unsaved-change warning if implemented
loading / server failure
```

## Only Applicable

Include only the fields and actions present on the form.

## Missing Rules To Flag

```text
field-level format rules
save/submit destination
unsaved-change warning
permission requirements
```

## Common Duplicates

- One "required field" case repeated verbatim for every field (combine or vary).
- "Cancel" and "close" when they perform the same action.
- "Empty form submit" duplicated for each field.
