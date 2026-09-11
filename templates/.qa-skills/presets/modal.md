# Preset: Modal

## Apply When

The UI contains a dialog, drawer or confirmation overlay.

## Core Areas

- Open/close behavior
- Dismissal methods
- Focus behavior
- Submit/validation inside the modal
- Loading and duplicate submit

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- interaction-testing
- state-testing
- responsive-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Open modal
Close button
Cancel
Confirm
Escape if supported
Click outside if supported
Focus behavior
Submit inside modal
Loading
Validation
Prevent duplicate confirm
Modal on mobile viewport
```

## Missing Business Rules To Flag

```text
whether Escape closes
whether outside-click closes
whether scroll is locked
confirm side effects
```

## Common Duplicate Cases

- "Close button" vs "Cancel" when both perform the same dismissal with no difference.
- Confirm repeated for each wording variation.

Do not assume outside-click or Escape behavior if the implementation explicitly
prevents it.
