# Core: Coverage Checklist

Use this before returning the result. Confirm each applicable area is covered.

## Coverage Areas

```text
Functional
Validation
Boundary
Negative
Interaction
State
Responsive
Accessibility
```

## Checklist

- [ ] Every interactive element from the inventory has at least one case.
- [ ] Every primary action has a success case.
- [ ] Every primary action has an expected-failure case.
- [ ] Every numeric/length constraint has boundary cases (min-1, min, min+1, max-1, max, max+1).
- [ ] Validation shows error states and error clearing.
- [ ] Loading, empty, error and success states are covered when they exist.
- [ ] Negative/edge cases are covered.
- [ ] Responsive behavior is covered when a UI is available.
- [ ] Keyboard/accessibility basics are covered when applicable.
- [ ] No duplicate cases remain.
- [ ] Every case has evidence.
- [ ] Unknown business rules are listed separately.

## Coverage Summary Template

```text
UI elements discovered: <n>
UI elements covered: <n>

Covered areas:
- Functional
- Validation
- Boundary
- Negative
- Interaction
- State
- Responsive
- Accessibility

Missing/unknown:
- <business rule 1>
- <business rule 2>
```

Prefer a qualitative status (Strong / Partial / Missing information) over invented
percentages. Do not produce fake mathematical precision.
