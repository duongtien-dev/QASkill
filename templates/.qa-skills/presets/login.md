# Preset: Login

## Apply When

The UI contains authentication/login behavior (email/username + password, or
social/SSO sign-in).

## Core Areas

- Credentials entry
- Password masking / visibility
- Submit behavior
- Loading and error feedback
- Remember me / forgot password (if present)

## Recommended Skills

- ui-analysis
- functional-testing
- form-validation
- boundary-value
- negative-testing
- interaction-testing
- state-testing
- responsive-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Valid login
Invalid credentials
Empty username/email
Empty password
Invalid input format if known
Password masking
Show/hide password
Remember me if present
Forgot password navigation if present
Submit using Enter
Duplicate submit
Loading state
Error response
Disabled state
Session-related behavior only if requirements exist
Account lock only if requirements exist
Social login only if present
```

## Missing Business Rules To Flag

```text
5 retry lock
lock duration
session duration
token duration
password complexity
post-login destination
exact invalid-credential message
```

## Common Duplicate Cases

- "Leave email empty" vs "Do not enter email" vs "Submit without email".
- "Click login" vs "Submit the form" when no interaction path differs.
- Repeating the same invalid-credential case for each minor input variation.
