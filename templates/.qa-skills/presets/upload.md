# Preset: Upload

## Apply When

The UI contains a file picker or drag-and-drop drop zone.

## Core Areas

- Valid / invalid selection
- Size and count limits (only if known)
- Remove / replace
- Progress and failure handling
- Filename edge cases

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- boundary-value
- negative-testing
- interaction-testing
- state-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Valid file
Invalid file type
Empty selection
Maximum size if known
Maximum count if known
Remove selected file
Replace file
Upload progress if present
Upload failure
Retry if present
Duplicate file
Long filename
```

## Missing Business Rules To Flag

```text
allowed file types
maximum size
maximum count
storage destination
virus/security scanning
```

## Common Duplicate Cases

- "Select file" vs "choose file" when they describe the same action.
- Size-limit cases generated when the limit is unknown (they become assumptions).

Do not invent size/type limits.
