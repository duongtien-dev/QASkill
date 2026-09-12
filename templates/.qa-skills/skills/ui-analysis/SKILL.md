# Skill: UI Analysis

## Purpose

Build a complete internal inventory of the target screen before writing any case.

## Apply When

Always, as the first internal step.

## Procedure

1. Name the screen/feature and its business goal.
2. List interactive elements: inputs, textarea, select, combobox, date picker,
   buttons, links, icon buttons, checkboxes, radios, toggles, upload, tabs,
   accordions, modal/dialog, toast, table, pagination, search, filters, menus.
3. List visible states: default, loading, success, error, empty, disabled,
   read-only, no-permission, no-result, partial.
4. List data surfaces: tables, lists, cards.
5. List navigation entry and exit points.

## Internal Only

The inventory is analysis. Do not print it unless `response.show_ui_inventory` is
`true`.

## Do Not Assume

- Do not infer a control's behavior from its label alone.
- Do not assume hidden interactions a screenshot cannot show.
