# Skill: Responsive Testing

## Purpose

Verify the UI remains usable across viewport sizes.

## Apply When

A UI, screenshot or component indicates a responsive web interface. Skip when
`responsive.enabled` is `false` in `config.yml`.

## Inputs To Inspect

- Tailwind classes (`sm:`, `md:`, `lg:`, `xl:`)
- Media queries
- Grid/flex configuration
- Container and layout components

## Procedure

1. Determine whether responsive behavior exists.
2. Derive expectations from breakpoints when visible in code.
3. Otherwise test the default categories: Mobile, Tablet, Desktop.

## Default Target Categories

```text
Mobile
Tablet
Desktop
```

Do not require exact pixel widths unless project breakpoints are available.

## Checklist

```text
No horizontal overflow
Text does not overlap
Buttons remain usable
Inputs remain accessible
Modal fits viewport
Table behavior is usable
Images scale correctly
Navigation adapts
Important actions remain visible
Touch targets remain usable
```

## Evidence Example

Source: `grid-cols-1 md:grid-cols-2`

```text
Verify the form uses one-column layout below the md breakpoint
and two-column layout at/above the md breakpoint.
```

## Do Not Assume

- Do not invent breakpoints that are not in the code or requirements.
- Do not claim exact pixel behavior without evidence.

## Output Expectations

Cases classified as type RESPONSIVE, referencing the breakpoint and its source.
