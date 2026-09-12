# Preset: Login

## Apply When

The UI contains authentication (email/username + password, or social/SSO sign-in).

## Candidate Areas

```text
valid login
invalid credentials
empty username/email
empty password
invalid input format if known
password masking
show/hide password
remember me if present
forgot password navigation if present
keyboard submit (Enter) if supported
duplicate submit
loading and error feedback
disabled state
session behavior only if requirements exist
account lock only if requirements exist
social login only if present
```

## Only Applicable

Include only the areas that exist on the screen.

## Missing Rules To Flag

```text
retry lock
lock duration
session / token duration
password complexity
post-login destination
exact invalid-credential message
```

## Common Duplicates

- "Leave email empty" vs "Do not enter email" vs "Submit without email".
- "Click login" vs "Submit the form" when no interaction path differs.
- Repeating the invalid-credential case for each minor input variation.
