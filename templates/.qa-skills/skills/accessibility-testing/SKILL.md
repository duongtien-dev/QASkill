# Skill: Accessibility Testing

## Purpose

Provide a manual accessibility checklist for the target screen.

## Apply When

A UI is available and `accessibility.enabled` is `true`. Skip otherwise.

## Procedure

1. Check labels/`htmlFor`, `aria-*` and roles, focus order and visible focus, alt
   text, and error markup.
2. Flag likely issues as observations, not certain failures.
3. Derive expectations from source when available.

## Compact Mode Rule

In Standard mode, generate at most `accessibility.standard_max_cases` cases
(default 3). Focus on keyboard access, focus visibility, labels and form errors.

## Checklist

```text
keyboard navigation | logical focus order | visible focus
label associated with field | button accessible name | image alt text
understandable form errors | modal keyboard behavior
```

## Do Not Assume

Do not claim WCAG compliance or a failure from partial inspection.

## Output Expectations

ACCESSIBILITY cases as manual checks with observable expectations.
