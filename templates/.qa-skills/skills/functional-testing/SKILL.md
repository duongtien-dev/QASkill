# Skill: Functional Testing

## Purpose

Verify each feature performs its intended job under normal and abnormal conditions.

## Apply When

Always, for every primary and secondary action.

## Procedure

1. Identify primary and secondary actions (cancel, reset, refresh, export).
2. For each action, derive success and failure behavior from evidence.
3. Cover: successful flow, expected failure, cancellation (if applicable),
   repeated action (if applicable).

## Compact Output Rule

Do not create one case per wording. "Click Login" and "Submit the form" are the
same case when the path is identical.

## Do Not Assume

Do not assume redirect destinations, status codes or success messages.

## Output Expectations

FUNCTIONAL cases with a single observable result.
