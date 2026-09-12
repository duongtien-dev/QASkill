# Output Template: Test Case (Detailed)

Used for Deep mode or when `testcase.format: detailed`.

````markdown
## TC-001 — Login successfully with valid credentials

- **Type:** FUNCTIONAL
- **Priority:** HIGH
- **Preconditions:** User has a valid active account; the login page is open.

**Steps**

1. Enter a valid registered email.
2. Enter the valid password.
3. Click **Login**.

**Test Data**

- Email: valid registered email
- Password: valid password

**Expected Result**

- The login request succeeds.
- The app transitions to the authenticated state defined by the implementation.

---

## TC-002 — Submit without email

- **Type:** VALIDATION
- **Priority:** HIGH
- **Preconditions:** The login page is open.

**Steps**

1. Leave the email field empty.
2. Enter a valid password.
3. Click **Login**.

**Test Data**

- Email: (empty)

**Expected Result**

- A required-email validation error is shown and no request is sent.
````

Only use the detailed format when the mode or configuration asks for it. Avoid
stating a specific result (for example "redirect to Dashboard") unless evidence
proves it.
