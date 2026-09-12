# Preset: Upload

## Apply When

The UI contains a file picker or drag-and-drop drop zone.

## Candidate Areas

```text
valid file
invalid file type
empty selection
maximum size if known
maximum count if known
remove selected file
replace file
upload progress if present
upload failure
retry if present
duplicate file
long filename
```

## Only Applicable

Include only the behaviors the upload implements. Do not invent size/type limits.

## Missing Rules To Flag

```text
allowed file types
maximum size
maximum count
storage destination
virus / security scanning
```

## Common Duplicates

- "Select file" vs "choose file" when they describe the same action.
- Size-limit cases generated when the limit is unknown (they become assumptions).
