# Output Template: Test Case (Markdown — Legacy)

Kept for backward compatibility with v1 installations.

New projects should use `testcase-compact.md` (default) or
`testcase-detailed.md`. This file documents the per-case block layout that the
`markdown` format produced.

````markdown
# Manual Test Cases — <Feature>

## <PREFIX>-001

**Module:** <module>
**Type:** FUNCTIONAL
**Priority:** HIGH

### Title

Login successfully with valid credentials.

### Preconditions

- User has a valid active account.
- Login page is open.

### Steps

1. Enter a valid registered email.
2. Enter the valid password.
3. Click **Login**.

### Test Data

- Email: valid registered email
- Password: valid password

### Expected Result

- The login request succeeds.
- The application transitions to the authenticated state defined by the implementation.

### Evidence

- UI contains email, password and Login controls.
````

Avoid stating a specific result (for example "redirect to Dashboard") unless
evidence proves it.
