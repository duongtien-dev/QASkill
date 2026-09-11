# Output Template: Test Case (Compact)

Template for `testcase.format: compact`. Useful when developers want quick
self-test cases.

| ID | Type | Scenario | Test Data | Expected | Priority |
|---|---|---|---|---|---|
| <PREFIX>-001 | FUNCTIONAL | <scenario> | <data> | <observable result> | HIGH |
| <PREFIX>-002 | VALIDATION | <scenario> | <data> | <observable result> | MEDIUM |
| <PREFIX>-003 | BOUNDARY | <scenario> | <value at boundary> | <observable result> | MEDIUM |

Notes:

- Keep the same ID, priority and evidence discipline as the Markdown format.
- The compact format is a rendering choice, not a reduction in coverage.
- Evidence may be summarized in the Scenario column when necessary.
