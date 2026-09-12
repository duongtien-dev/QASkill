# Preset: Modal

## Apply When

The UI contains a dialog, drawer or confirmation overlay.

## Candidate Areas

```text
open modal
close button
cancel
confirm
Escape if supported
click outside if supported
focus behavior
submit inside modal
loading
validation
prevent duplicate confirm
modal on mobile viewport
```

## Only Applicable

Include only the dismissal and interaction paths the modal supports.

## Missing Rules To Flag

```text
whether Escape closes
whether outside-click closes
whether scroll is locked
confirm side effects
```

## Common Duplicates

- "Close button" vs "Cancel" when both dismiss with no difference.
- Confirm repeated for each wording variation.

Do not assume outside-click or Escape behavior if the implementation prevents it.
