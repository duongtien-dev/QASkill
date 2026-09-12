# Output Template: Test Case (Compact)

Default template for `testcase.format: compact` (Quick and Standard modes).

| ID | Type | Test Case | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-001 | FUNCTIONAL | Login with valid credentials | 1. Enter valid email; 2. Enter valid password; 3. Click Login | valid account | Request succeeds; the app reaches the authenticated state | HIGH |
| TC-002 | VALIDATION | Submit without email | 1. Leave email empty; 2. Click Login | (empty) | Required-email error is shown | HIGH |
| TC-003 | BOUNDARY | Password length boundaries | Enter passwords at min-1, min, min+1, max-1, max, max+1 | 7, 8, 9, 19, 20, 21 chars | Values outside the rule are rejected; valid values accepted | MEDIUM |

Rules:

- Number the steps on one line, separated by `;`.
- Group data variants in `Test Data`; do not add a row per value.
- One observable result per case.
- Keep the same ID, priority and evidence discipline as the detailed format.
- The compact format is a rendering choice, not a reduction in coverage.
