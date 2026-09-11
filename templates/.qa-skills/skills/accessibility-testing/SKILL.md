# Skill: Accessibility Testing

## Purpose

Provide a manual accessibility checklist for the target screen.

## Apply When

A UI is available and accessibility is applicable. Skip when
`accessibility.enabled` is `false` in `config.yml`.

## Inputs To Inspect

- Labels and `htmlFor`/`id` association
- `aria-*` attributes and roles
- Focus order and visible focus styles
- Alt text on images
- Error message markup and associations

## Procedure

1. Check each applicable area.
2. Flag likely issues as observations, not certain failures.
3. Derive expectations from the source when available.

## Checklist

```text
keyboard navigation
logical focus order
visible focus
label associated with field
button accessible name
image alt text
form error understandable
modal keyboard behavior
heading structure
color is not the only status signal
disabled control understandable
```

## Evidence Example

```tsx
<label htmlFor="email">
<input id="email">
```

Source evidence supports testing label association. If the label is missing:

```text
Potential accessibility issue:
Email input does not appear to have an associated label.
```

## Do Not Assume

- Do not claim WCAG compliance from manual inspection alone.
- Do not claim a failure when the surrounding implementation is not fully visible.

## Output Expectations

Cases classified as type ACCESSIBILITY, phrased as manual checks with observable
expectations.
