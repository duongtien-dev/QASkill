# Output Template: Coverage Report

Append this section after the test cases only when
`response.show_coverage_summary` is `true`.

```markdown
## Coverage Summary

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

Prefer a qualitative status over invented percentages:

```text
Coverage status: Strong / Partial / Missing information
```

Do not produce fake mathematical precision when coverage cannot be objectively
measured.

Missing rules are always limited by `response.max_missing_rules`:

```markdown
## Questions / Missing Rules

1. <question about a missing business rule>
2. <question about a missing business rule>
```
