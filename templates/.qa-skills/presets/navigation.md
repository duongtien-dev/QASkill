# Preset: Navigation

## Apply When

The UI contains routes, menus, tabs or browser back/forward behavior.

## Core Areas

- Link/navigation behavior
- Active state
- Browser history
- Direct URL access
- Missing route handling

## Recommended Skills

- ui-analysis
- functional-testing
- interaction-testing
- state-testing
- responsive-testing
- accessibility-testing
- testcase-review

## Scenario Checklist

```text
Click navigation link
Active state
Browser back
Browser forward
Refresh
Direct URL access
Missing route handling
Permission handling only if known
External link target only if defined
```

## Missing Business Rules To Flag

```text
protected routes
redirect-on-unauthorized behavior
default landing route
external link target/rel rules
```

## Common Duplicate Cases

- "Navigate via menu" vs "navigate via link" when the destination and path are the same.
- Back/forward cases repeated per route with identical behavior.
