# Skill: UI Analysis

## Purpose

Systematically inventory a screen before writing any test case, so coverage is
driven by what actually exists.

## Apply When

Always. This is the first skill applied to any target screen.

## Inputs To Inspect

- Screenshot / UI image
- Component source (JSX/TSX/HTML/Vue/Svelte templates)
- Route definitions and layouts

## Procedure

1. Name the screen and its business goal.
2. List every interactive element.
3. List every visible state.
4. List every displayed data surface (tables, lists, cards).
5. List navigation entry/exit points.

## Checklist

Identify, when present:

```text
Inputs / Textarea / Select / Combobox / Autocomplete / Date picker
Buttons / Links / Icon buttons
Checkboxes / Radio buttons / Toggle / Switch
File upload / Drop zone
Tabs / Accordions / Drawer / Tooltip / Popover
Modal / Dialog / Confirmation dialog
Toast / Notification / Banner
Cards / Tables / Pagination / Search / Filters / Sorting
Menus / Navigation / Breadcrumbs
Images / Icons
Empty state / Loading state / Error state / Success state
Disabled state / Read-only state / Skeleton
```

## Do Not Assume

- Do not assume a control's behavior from its label alone.
- Do not assume hidden interactions that a screenshot cannot show.

## Output Expectations

```text
Screen:
<name>

Interactive elements:
- <element>

Visible states:
- <state>

Data surfaces:
- <surface>
```

Do not generate test cases until the inventory is complete.
