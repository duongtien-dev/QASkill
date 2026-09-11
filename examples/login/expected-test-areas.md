# Expected Test Areas — Login

This file documents the areas QASkill should cover for `LoginForm.tsx`.
Use it to manually verify the quality of the generated test cases.

## Functional

- Successful login with valid credentials
- Login attempt with invalid credentials shows an error
- Submit button is disabled while loading
- Repeated submit while loading does not duplicate the request

## Validation

- Empty email
- Invalid email format (native `type="email"`)
- Empty password
- Show / hide password toggling changes masking
- Password field masks input by default

## Boundary (from `minLength={8}` / `maxLength={20}`)

- 7 characters (below minimum)
- 8 characters (minimum)
- 9 characters
- 19 characters
- 20 characters (maximum)
- 21 characters (above maximum)

## Negative

- Network / server failure during submit
- Malformed response handling

## Interaction

- Submit using Enter in a field
- Toggle "Remember me"
- Navigate to "Forgot password?"
- Focus order across email → password → show/hide → remember me → submit

## State

- Loading state on the submit button
- Error state rendering

## Responsive

- Form is usable on Mobile / Tablet / Desktop

## Accessibility

- Labels are associated with inputs
- Error message is announced / understandable
- Keyboard-only operation is possible

## Must remain in Questions / Missing Rules

- Account lock policy after repeated failed logins
- Whether email matching is case-sensitive
- Whether "Remember me" persists across browser restarts
- Post-login destination
