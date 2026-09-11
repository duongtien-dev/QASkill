# Skill: Interaction Testing

## Purpose

Verify that interactive controls respond correctly to user and browser input.

## Apply When

Any clickable, focusable, keyboard-reachable or dismissible element exists.

## Inputs To Inspect

- Event handlers and disabled conditions
- Keyboard listeners (keydown, Escape, Enter, Tab)
- Modal/drawer open-close logic
- Focus management

## Procedure

1. List interactive elements from the UI inventory.
2. Identify their supported input paths (mouse, keyboard, touch).
3. Generate only the applicable interaction cases.

## Checklist

```text
single click
double click
rapid click
keyboard submit
Enter key
Escape key
Tab navigation
focus movement
button disabled during submit
modal open/close
click outside modal
browser back
refresh
switch tab
change filter
clear search
```

## Do Not Assume

- Do not assume Escape or outside-click closes a modal if the implementation
  explicitly prevents it.
- Do not assume Enter submits if the form does not support it.

## Output Expectations

Cases classified as type INTERACTION, with the interaction path described precisely.
