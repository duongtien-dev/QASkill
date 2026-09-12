# Core: Coverage Checklist (Internal)

Use this to audit your own work. Do **not** print the checklist or a per-area
report.

## Checklist

- [ ] Every interactive element has at least one case, or a clear reason to skip it.
- [ ] Every primary action has a success case and an expected-failure case.
- [ ] Every known numeric/length/date/page constraint has boundary cases
      (min-1, min, min+1, max-1, max, max+1), grouped into one case.
- [ ] Validation error display and error clearing are covered.
- [ ] Loading/empty/error/success states are covered when they exist.
- [ ] Negative cases target the most plausible failures only.
- [ ] Responsive cases are limited to `responsive.standard_max_cases`.
- [ ] Accessibility cases are limited to `accessibility.standard_max_cases`.
- [ ] No duplicate cases remain; data variants are grouped.
- [ ] Case count is within the active mode limits.
- [ ] Unknown business rules are noted only when they change expected results.

## Printing

A coverage summary is opt-in via `response.show_coverage_summary`. When enabled,
use `templates/coverage-report.md` and prefer a qualitative status
(Strong / Partial / Missing information) over invented percentages.
