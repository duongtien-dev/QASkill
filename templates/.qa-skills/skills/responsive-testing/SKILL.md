# Skill: Responsive Testing

## Purpose

Check that the UI stays usable across viewport sizes.

## Apply When

A UI/page is available and `responsive.enabled` is `true`. Skip otherwise.

## Procedure

1. Confirm responsive behavior exists (Tailwind `sm:`/`md:`/`lg:`, media queries,
   grid/flex).
2. Derive expectations from visible breakpoints when present.
3. Otherwise use Mobile / Tablet / Desktop as the categories.

## Compact Mode Rule

In Standard mode, generate at most `responsive.standard_max_cases` cases
(default 3). Do not emit a case per breakpoint combination.

## Checklist

```text
no horizontal overflow | text does not overlap | buttons/inputs usable
modal fits viewport | table usable | images scale | navigation adapts
important actions visible
```

## Do Not Assume

Do not invent breakpoints, pixel widths or behaviors that are not in evidence.

## Output Expectations

RESPONSIVE cases referencing the breakpoint and its source.
