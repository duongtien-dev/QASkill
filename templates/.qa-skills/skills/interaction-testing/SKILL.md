# Skill: Interaction Testing

## Purpose

Verify interactive controls respond correctly to user and browser input.

## Apply When

Any clickable, focusable, keyboard-reachable or dismissible element exists.

## Procedure

1. List interactive elements from the internal inventory.
2. Identify supported input paths (mouse, keyboard, touch).
3. Generate only applicable interaction cases.

## Candidate Scenarios

```text
single/rapid click | keyboard submit | Enter | Escape | Tab/focus movement
disabled during submit | modal open/close and outside click
browser back | refresh | change filter | clear search
```

## Only Applicable

Skip scenarios the implementation does not support (for example Escape-to-close
when it is disabled).

## Do Not Assume

Do not assume Escape or outside-click closes a modal, or that Enter submits,
without evidence.

## Output Expectations

INTERACTION cases with the precise interaction path.
