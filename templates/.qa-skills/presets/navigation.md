# Preset: Navigation

## Apply When

The UI contains routes, menus, tabs or browser back/forward behavior.

## Candidate Areas

```text
click navigation link
active state
browser back
browser forward
refresh
direct URL access
missing route handling
permission handling only if known
external link target only if defined
```

## Only Applicable

Include only the routes and behaviors the UI implements.

## Missing Rules To Flag

```text
protected routes
redirect-on-unauthorized behavior
default landing route
external link target/rel rules
```

## Common Duplicates

- "Navigate via menu" vs "navigate via link" when the destination and path are the same.
- Back/forward cases repeated per route with identical behavior.
