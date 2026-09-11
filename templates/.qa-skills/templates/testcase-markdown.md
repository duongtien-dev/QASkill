# Output Template: Test Case (Markdown)

Template for the default `testcase.format: markdown`.

````markdown
# Manual Test Cases — <Feature>

## Test Context

**Target:** <screen / feature>

**Evidence used:**
- `<file>`
- <screenshot / requirement>

**Applied skills:**
- UI Analysis
- Functional Testing

**Applied presets:**
- <preset>

---

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
evidence proves it. If the destination is unknown, describe the observable result
that is actually supported by evidence.
