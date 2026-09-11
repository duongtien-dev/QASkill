# QASkill — AI Manual QA Skill Kit for Developers

> Implementation Specification for AI Coding Agents  
> Version: 1.0.0  
> Status: MVP Specification  
> Primary language: TypeScript / Node.js  
> Distribution: npm package + `npx` CLI  
> Core idea: Install a standardized Manual QA skill set into a software project so AI coding agents can generate comprehensive, consistent manual UI test cases from screenshots, source code, and requirements.

---

# 1. Project Overview

## 1.1 Project Name

**QASkill**

Alternative package names if the npm name is unavailable:

- `qa-skill-kit`
- `manual-qa-skills`
- `testskill-kit`
- `qa-agent-skills`

Preferred CLI command in this specification:

```bash
qaskill
```

Preferred npm package:

```bash
qaskill
```

If `qaskill` is unavailable on npm, use:

```bash
qa-skill-kit
```

Do not change the product concept if the package name changes.

---

## 1.2 One-Sentence Product Definition

QASkill is an installable collection of Manual QA methodology files and presets that teach AI coding agents how to analyze a UI and generate comprehensive manual test cases for developers.

---

## 1.3 Problem

Developers frequently ask AI:

```text
Create test cases for this login screen.
```

Generic AI output is often incomplete because it may:

- generate only happy-path scenarios;
- miss boundary values;
- miss negative cases;
- ignore buttons, links, checkboxes, modals, tables, pagination, filters, etc.;
- invent business rules that were never provided;
- omit loading/error/empty states;
- forget mobile/responsive cases;
- produce inconsistent output formats;
- create duplicate test cases;
- fail to distinguish facts from assumptions.

The goal of QASkill is to install a repeatable QA methodology into a project so the AI follows the same test-design process every time.

---

# 2. Target User

The MVP is designed primarily for:

```text
Developer
```

Typical use:

```text
Developer implements a UI
        ↓
Developer asks AI coding agent to test it
        ↓
AI reads QASkill instructions
        ↓
AI analyzes screenshot/source/requirements
        ↓
AI generates Manual QA test cases
        ↓
Developer self-tests before sending work to QA
```

QASkill is NOT intended to replace professional QA engineers.

It is a development support tool that helps developers perform better self-testing.

---

# 3. Core Product Principle

QASkill must NOT become a standalone AI SaaS.

The MVP must remain:

```text
npm CLI
+
Markdown/YAML skill files
+
templates
+
presets
```

QASkill itself does NOT require:

- OpenAI API;
- Claude API;
- Gemini API;
- database;
- backend server;
- login;
- dashboard;
- vector database;
- browser automation;
- Playwright execution;
- Cypress execution.

The AI coding tool already provides the LLM.

QASkill provides the **methodology, instructions, rules, checklists, presets and output contracts**.

---

# 4. Supported AI Usage Model

QASkill should be usable by AI coding tools capable of reading files from the repository.

Examples include:

- Claude Code
- Cursor
- Cline
- Codex-style coding agents
- Windsurf-like coding agents
- IDE AI assistants that can read repository files

Do NOT hard-code the implementation to only one AI vendor.

The installed files must remain vendor-neutral.

---

# 5. Core User Experience

## 5.1 Installation

Recommended:

```bash
npx qaskill init
```

Alternative if globally installed:

```bash
npm install -g qaskill
qaskill init
```

After initialization:

```text
project-root/
├── src/
├── package.json
├── ...
└── .qa-skills/
```

The CLI creates all required QA skill files under:

```text
.qa-skills/
```

---

# 6. Expected Developer Workflow

Example project:

```text
my-next-app/
├── src/
│   └── app/
│       └── login/
│           └── page.tsx
├── package.json
└── .qa-skills/
```

Developer asks the AI coding agent:

```text
Read .qa-skills/SKILL.md and generate manual test cases
for src/app/login/page.tsx.

Also use the attached screenshot.

Do not invent business rules.
```

Expected internal AI reasoning workflow:

```text
Read Master Skill
      ↓
Analyze available evidence
      ↓
Identify UI elements
      ↓
Identify known business rules
      ↓
Detect applicable QA skills
      ↓
Apply relevant presets
      ↓
Generate test cases
      ↓
Deduplicate
      ↓
Coverage review
      ↓
Return final test case set
```

---

# 7. Inputs

QASkill must teach the AI to accept one or more of the following input sources.

## 7.1 Screenshot / UI Image

Useful for discovering:

- fields;
- buttons;
- labels;
- icons;
- tabs;
- filters;
- tables;
- modals;
- visible states;
- responsive layout;
- navigation elements.

Screenshot alone must NOT be treated as a complete business specification.

---

## 7.2 Source Code

Examples:

```text
LoginForm.tsx
UserTable.tsx
CreateCourseModal.tsx
SearchHeader.tsx
```

Source code may reveal:

- validation rules;
- min/max length;
- disabled states;
- handlers;
- API calls;
- conditional rendering;
- loading state;
- error state;
- empty state;
- permissions;
- navigation;
- default values.

---

## 7.3 Requirement Text

Example:

```text
Password must contain 8–20 characters.
After 5 failed attempts the account is locked for 15 minutes.
```

Requirements are the primary source for business behavior.

---

## 7.4 Optional API Contract

Examples:

```text
Swagger
OpenAPI
API response sample
TypeScript interfaces
API service files
```

This may be used to improve test design but QASkill MVP does NOT execute APIs.

---

# 8. Evidence Priority

When information conflicts, AI must use the following precedence:

```text
1. Explicit requirement/business rule
2. Current source code
3. API contract
4. UI screenshot
5. Existing project conventions
6. Reasonable QA hypothesis marked as an assumption
```

The AI must NEVER silently convert assumptions into requirements.

---

# 9. Unknown Information Rule

If a business rule is unknown, test cases must not claim a specific behavior unless it can be derived from evidence.

Bad:

```text
Test:
Lock account after 5 failed attempts.

Expected:
Account is locked for 15 minutes.
```

when no requirement says this.

Good:

```text
Potential test area:
Repeated failed login attempts.

Status:
Requires business rule confirmation.

Reason:
No retry/lock policy is provided.
```

QASkill must distinguish:

```text
KNOWN
INFERRED_FROM_CODE
ASSUMPTION
UNKNOWN
```

---

# 10. Installed Folder Structure

The MVP must generate:

```text
.qa-skills/
├── SKILL.md
├── config.yml
│
├── core/
│   ├── evidence-rules.md
│   ├── test-design-process.md
│   ├── coverage-checklist.md
│   └── output-contract.md
│
├── skills/
│   ├── ui-analysis/
│   │   └── SKILL.md
│   ├── functional-testing/
│   │   └── SKILL.md
│   ├── form-validation/
│   │   └── SKILL.md
│   ├── boundary-value/
│   │   └── SKILL.md
│   ├── negative-testing/
│   │   └── SKILL.md
│   ├── interaction-testing/
│   │   └── SKILL.md
│   ├── state-testing/
│   │   └── SKILL.md
│   ├── responsive-testing/
│   │   └── SKILL.md
│   ├── accessibility-testing/
│   │   └── SKILL.md
│   └── testcase-review/
│       └── SKILL.md
│
├── presets/
│   ├── login.md
│   ├── form.md
│   ├── crud.md
│   ├── table.md
│   ├── search.md
│   ├── filter.md
│   ├── pagination.md
│   ├── modal.md
│   ├── upload.md
│   └── navigation.md
│
└── templates/
    ├── testcase-markdown.md
    ├── testcase-compact.md
    └── coverage-report.md
```

---

# 11. Master Skill

File:

```text
.qa-skills/SKILL.md
```

Purpose:

The Master Skill orchestrates all other QA skills.

It must contain rules equivalent to the following.

---

## 11.1 Master Role

```text
You are acting as a Manual QA Test Case Design Assistant for a developer.

Your task is to analyze the available UI, source code and requirements,
select relevant QA skills, and produce a comprehensive but non-duplicated
manual test case set.

You must not invent business rules.
```

---

## 11.2 Mandatory Test Design Workflow

The AI must follow this order:

```text
1. Collect evidence.
2. Identify the target screen/feature.
3. Identify interactive UI elements.
4. Extract known rules and constraints.
5. Identify UI states.
6. Select applicable QA skills.
7. Select applicable presets.
8. Generate functional happy-path cases.
9. Generate validation cases.
10. Generate boundary cases.
11. Generate negative cases.
12. Generate interaction/state cases.
13. Generate responsive cases when UI is available.
14. Generate accessibility cases when applicable.
15. Remove duplicates.
16. Review coverage.
17. Mark unknown business rules.
18. Produce the final result in the configured format.
```

---

## 11.3 Never Invent Rule

The master skill must explicitly state:

```text
Do not invent:
- password policies;
- timeout values;
- rate limits;
- permissions;
- API status codes;
- redirect destinations;
- maximum file sizes;
- business validation;
- account lock policies;
- pagination limits;
- browser support;
unless supported by evidence.

If useful to test but unknown, place it in "Questions / Missing Rules".
```

---

# 12. Core Skill — UI Analysis

Path:

```text
skills/ui-analysis/SKILL.md
```

Goal:

Systematically inventory the screen before writing test cases.

The AI must identify:

```text
Inputs
Textarea
Buttons
Links
Checkboxes
Radio buttons
Select/dropdowns
Combobox/autocomplete
Date picker
File upload
Tabs
Accordions
Modal/dialog
Drawer
Tooltip
Toast
Cards
Tables
Pagination
Search
Filters
Sorting
Menus
Navigation
Images
Empty state
Loading state
Error state
Success state
Disabled state
Skeleton
Confirmation dialog
```

Output from UI analysis should include:

```text
Screen:
Login

Interactive elements:
- Email input
- Password input
- Password visibility toggle
- Remember me checkbox
- Login button
- Forgot password link

Visible states:
- default
- validation error
- loading
```

Do not generate test cases until the inventory is complete.

---

# 13. Core Skill — Functional Testing

Path:

```text
skills/functional-testing/SKILL.md
```

The skill checks:

```text
Primary action
Secondary action
Navigation
Data submission
Cancel
Reset
Create
Edit
Delete
View
Refresh
State update
Confirmation
Success response
Failure response
```

Mandatory philosophy:

For every primary feature, generate at least:

```text
- successful normal workflow;
- expected failure workflow;
- user cancellation workflow if applicable;
- repeated action behavior if applicable.
```

---

# 14. Core Skill — Form Validation

Path:

```text
skills/form-validation/SKILL.md
```

For each input, evaluate applicable cases.

## Text Input Checklist

```text
Empty
Whitespace only
Leading spaces
Trailing spaces
Valid value
Invalid format
Minimum length
Maximum length
Below minimum
Above maximum
Special characters
Unicode
Copy/paste
Very long input
Duplicate value
Case sensitivity
```

Not all tests must always be generated.

Only generate cases applicable to evidence or standard UI behavior.

---

## Email Input Checklist

Potential cases:

```text
valid email
empty
missing @
missing local part
missing domain
multiple @
leading/trailing spaces
uppercase characters
subdomain
plus alias
very long address
```

Do not assert which uncommon addresses are valid unless the application rule is known.

---

## Password Input Checklist

Potential UI-oriented cases:

```text
empty password
min length boundary if known
max length boundary if known
show/hide password
copy/paste if relevant
leading/trailing characters
submit with invalid password
password remains masked by default
```

Do not invent password complexity.

---

## Numeric Input Checklist

```text
empty
zero
positive
negative
decimal
minimum
maximum
min - 1
min + 1
max - 1
max + 1
non-number
very large number
leading zero
```

---

# 15. Core Skill — Boundary Value Analysis

Path:

```text
skills/boundary-value/SKILL.md
```

When a range is known:

```text
min = 8
max = 20
```

Expected boundary design:

```text
7
8
9

19
20
21
```

General formula:

```text
min - 1
min
min + 1
max - 1
max
max + 1
```

Apply to:

- string length;
- numeric value;
- date range;
- pagination;
- file count;
- quantity;
- time;
- score;
- percentage;
- allowed items.

Do not generate imaginary boundaries.

---

# 16. Core Skill — Negative Testing

Path:

```text
skills/negative-testing/SKILL.md
```

Potential negative scenarios:

```text
missing required data
invalid input
wrong credentials
invalid state
duplicate submit
duplicate record
stale data
unauthorized action
expired session
network failure
server failure
malformed response
very slow response
refresh during operation
back navigation
rapid repeated click
unsupported file
cancel operation
```

Security-oriented destructive testing must remain high-level and safe.

QASkill is not a penetration testing framework.

---

# 17. Core Skill — Interaction Testing

Path:

```text
skills/interaction-testing/SKILL.md
```

Check interactive behaviors such as:

```text
single click
double click
rapid click
keyboard submit
Enter key
Escape key
Tab navigation
focus movement
button disabled during submit
modal open/close
click outside modal
browser back
refresh
switch tab
change filter
clear search
```

Only generate applicable cases.

---

# 18. Core Skill — State Testing

Path:

```text
skills/state-testing/SKILL.md
```

AI must search source/UI for these states:

```text
default
loading
success
error
empty
disabled
read-only
no permission
no result
partial data
offline/network failure
stale data
```

Example:

For a table:

```text
loading table
table with rows
empty table
API error
search no results
```

---

# 19. Core Skill — Responsive Testing

Path:

```text
skills/responsive-testing/SKILL.md
```

Use only when a UI/screenshot/component indicates a responsive web interface.

Default target viewport categories:

```text
Mobile
Tablet
Desktop
```

Do not require exact pixel widths unless project breakpoints are available.

Checklist:

```text
No horizontal overflow
Text does not overlap
Buttons remain usable
Inputs remain accessible
Modal fits viewport
Table behavior is usable
Images scale correctly
Navigation adapts
Important actions remain visible
Touch targets remain usable
```

If Tailwind breakpoints are visible in code, derive viewport expectations from them.

---

# 20. Core Skill — Accessibility Testing

Path:

```text
skills/accessibility-testing/SKILL.md
```

This is a Manual QA checklist, not an automated WCAG validator.

Check applicable areas:

```text
keyboard navigation
logical focus order
visible focus
label associated with field
button accessible name
image alt text
form error understandable
modal keyboard behavior
heading structure
color is not the only status signal
disabled control understandable
```

Do not claim WCAG compliance from manual inspection alone.

---

# 21. Core Skill — Test Case Review

Path:

```text
skills/testcase-review/SKILL.md
```

Before returning final output, review every generated case.

Remove cases that are:

```text
duplicate
too vague
unsupported by evidence
unexecutable
same scenario with different wording
not relevant to the target feature
```

Each final test case should answer:

```text
What is tested?
What condition is required?
What actions are performed?
What data is used?
What observable result should occur?
```

---

# 22. Preset System

Presets provide domain-specific checklists.

They supplement the core skills.

A preset is a Markdown file.

Example:

```text
presets/login.md
```

Each preset contains:

```text
Name
When to apply
Elements to identify
Test areas
Questions / unknown rules
Common mistakes
```

---

# 23. Login Preset

Path:

```text
presets/login.md
```

Applicable when UI contains authentication/login behavior.

Checklist:

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

Unknown-rule section:

```text
Do not assume:
- 5 retry lock
- lock duration
- session duration
- token duration
- password complexity
```

---

# 24. Generic Form Preset

Path:

```text
presets/form.md
```

Checklist:

```text
Required fields
Optional fields
Input format
Boundary values
Default values
Submit
Cancel
Reset
Error display
Error clear behavior
Tab order
Duplicate submit
Unsaved data
Loading
Server failure
```

---

# 25. CRUD Preset

Path:

```text
presets/crud.md
```

CRUD coverage:

```text
Create
Read/List
View detail
Update
Delete
Cancel delete
Delete confirmation
Refresh after mutation
Error handling
Permission if known
Duplicate item if relevant
Empty state
```

---

# 26. Table Preset

Path:

```text
presets/table.md
```

Checklist:

```text
Render rows
Columns
Empty data
Loading
Error
Long text
Large row count
Row action
Selection
Sort if present
Pagination if present
Search/filter integration
Responsive behavior
```

---

# 27. Search Preset

Path:

```text
presets/search.md
```

Checklist:

```text
Exact match
Partial match
No result
Clear search
Whitespace
Special characters
Case sensitivity only if known
Rapid typing
Debounce behavior if code indicates debounce
Search then pagination
Search then filter
```

---

# 28. Filter Preset

Path:

```text
presets/filter.md
```

Checklist:

```text
Default filter
One filter
Multiple filters
Clear filter
No result
Switch filter
Filter + search
Filter + pagination
Persist filter only if implementation suggests persistence
```

---

# 29. Pagination Preset

Path:

```text
presets/pagination.md
```

Checklist:

```text
First page
Next page
Previous page
Last page if present
Single page
No data
Exactly page-size records
Page-size + 1 records
Change page after search/filter
Deleted last item on page
Disabled previous on first page
Disabled next on last page
```

Only use numeric boundaries if page size is known.

---

# 30. Modal Preset

Path:

```text
presets/modal.md
```

Checklist:

```text
Open modal
Close button
Cancel
Confirm
Escape if supported
Click outside if supported
Focus behavior
Submit inside modal
Loading
Validation
Prevent duplicate confirm
Modal on mobile viewport
```

Do not assume outside-click or Escape behavior if implementation explicitly prevents it.

---

# 31. Upload Preset

Path:

```text
presets/upload.md
```

Checklist:

```text
Valid file
Invalid file type
Empty selection
Maximum size if known
Maximum count if known
Remove selected file
Replace file
Upload progress if present
Upload failure
Retry if present
Duplicate file
Long filename
```

Do not invent size/type limits.

---

# 32. Navigation Preset

Path:

```text
presets/navigation.md
```

Checklist:

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

---

# 33. Configuration File

Path:

```text
.qa-skills/config.yml
```

Default content:

```yaml
version: 1

language: en

testcase:
  format: markdown
  id_prefix: TC
  include:
    - id
    - module
    - type
    - title
    - preconditions
    - steps
    - test_data
    - expected_result
    - priority
    - evidence

priorities:
  - HIGH
  - MEDIUM
  - LOW

types:
  - FUNCTIONAL
  - VALIDATION
  - BOUNDARY
  - NEGATIVE
  - INTERACTION
  - STATE
  - RESPONSIVE
  - ACCESSIBILITY

rules:
  include_unknown_rules_section: true
  include_coverage_summary: true
  prevent_business_rule_invention: true
  remove_duplicates: true

responsive:
  enabled: true

accessibility:
  enabled: true
```

---

# 34. Language Configuration

QASkill should support:

```yaml
language: en
```

and:

```yaml
language: vi
```

This controls the final generated test-case language.

The skill methodology files can remain English for consistency.

AI must return the final test cases in configured language.

---

# 35. Output Contract

Default test case fields:

```text
ID
Module
Type
Title
Preconditions
Steps
Test Data
Expected Result
Priority
Evidence
```

---

# 36. Evidence Field

Every test case should optionally explain what justified it.

Examples:

```text
Evidence:
Requirement: Password length is 8–20 characters.
```

or:

```text
Evidence:
Source: LoginForm.tsx sets minLength={8}.
```

or:

```text
Evidence:
UI: Remember me checkbox is visible.
```

This makes hallucinations easier to detect.

---

# 37. Default Markdown Output

Example:

```markdown
## LOGIN-001

**Module:** Login  
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
```

Notice:

If redirect destination is unknown, do NOT write:

```text
Redirect to Dashboard.
```

unless evidence proves it.

---

# 38. Compact Output Template

Optional config:

```yaml
testcase:
  format: compact
```

Output:

| ID | Type | Scenario | Test Data | Expected | Priority |
|---|---|---|---|---|---|

This format is useful when developers want quick self-test cases.

---

# 39. Coverage Summary

After the test cases, AI must produce:

```text
Coverage Summary
```

Example:

```text
UI elements discovered: 6
UI elements covered: 6

Covered areas:
- Functional
- Validation
- Boundary
- Negative
- Interaction
- Responsive
- Accessibility

Missing/unknown:
- Account lock policy
- Session expiration behavior
```

Coverage percentage is optional.

Do NOT produce fake mathematical precision when coverage cannot be objectively measured.

Prefer:

```text
Coverage status: Strong / Partial / Missing information
```

over invented percentages.

---

# 40. Questions / Missing Rules Section

When business information is missing, return:

```markdown
## Questions / Missing Rules

1. Is there an account lock policy after repeated failed logins?
2. Is email matching case-sensitive?
3. Is "Remember me" expected to persist across browser restarts?
```

Do not automatically create test expected results for these unknown rules.

---

# 41. CLI Requirements

The CLI must be intentionally small.

Required commands:

```bash
qaskill init
qaskill list
qaskill add <preset>
qaskill remove <preset>
qaskill update
qaskill doctor
qaskill version
```

---

# 42. `qaskill init`

Behavior:

```text
1. Detect project root.
2. Check if .qa-skills exists.
3. Ask before overwrite unless --force.
4. Copy core skills.
5. Copy default presets.
6. Create config.yml.
7. Print usage instructions.
```

Flags:

```bash
qaskill init --force
qaskill init --language vi
qaskill init --minimal
```

`--minimal` installs only:

```text
SKILL.md
core/
skills/
config.yml
```

---

# 43. `qaskill list`

Shows installed skills and available presets.

Example:

```text
QASkill 1.0.0

Core skills
✓ ui-analysis
✓ functional-testing
✓ form-validation
✓ boundary-value
✓ negative-testing
✓ interaction-testing
✓ state-testing
✓ responsive-testing
✓ accessibility-testing
✓ testcase-review

Presets
✓ login
✓ form
✓ crud
○ table
○ search
○ filter
○ pagination
○ modal
○ upload
○ navigation
```

---

# 44. `qaskill add`

Example:

```bash
qaskill add login
qaskill add table
qaskill add pagination
```

The command copies the preset into:

```text
.qa-skills/presets/
```

If already installed:

```text
Preset "login" is already installed.
```

No duplication.

---

# 45. `qaskill remove`

Example:

```bash
qaskill remove upload
```

Core skills cannot be removed by this command.

Only optional presets may be removed.

---

# 46. `qaskill update`

Goal:

Refresh installed standard skills to the current package version.

Important:

User customization must not be silently destroyed.

MVP safe behavior:

```text
- compare package version;
- create a backup;
- update managed standard files;
- preserve config.yml;
- warn about locally changed managed files.
```

Simpler acceptable MVP:

```text
qaskill update --force
```

with backup:

```text
.qa-skills-backup-YYYYMMDD-HHmmss/
```

---

# 47. `qaskill doctor`

Validate installation.

Checks:

```text
.qa-skills exists
SKILL.md exists
config.yml valid
required core files exist
preset files valid
version metadata valid
```

Example:

```text
QASkill Doctor

✓ Master skill
✓ Config
✓ 10 core skills
✓ 6 presets
✓ Output templates

Installation looks healthy.
```

---

# 48. Technology Stack

Use:

```text
Node.js >= 20
TypeScript
npm
```

Recommended libraries:

```text
commander
chalk
ora
yaml
fs-extra
zod
```

Optional:

```text
prompts
```

Avoid unnecessary dependencies.

---

# 49. CLI Project Structure

Recommended repository:

```text
qaskill/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── CHANGELOG.md
│
├── src/
│   ├── index.ts
│   ├── cli.ts
│   ├── commands/
│   │   ├── init.ts
│   │   ├── list.ts
│   │   ├── add.ts
│   │   ├── remove.ts
│   │   ├── update.ts
│   │   ├── doctor.ts
│   │   └── version.ts
│   │
│   ├── services/
│   │   ├── installer.ts
│   │   ├── preset-manager.ts
│   │   ├── config-manager.ts
│   │   ├── project-root.ts
│   │   └── health-check.ts
│   │
│   ├── schemas/
│   │   └── config.schema.ts
│   │
│   └── utils/
│       ├── filesystem.ts
│       ├── logger.ts
│       └── paths.ts
│
├── templates/
│   └── .qa-skills/
│       ├── SKILL.md
│       ├── config.yml
│       ├── core/
│       ├── skills/
│       ├── presets/
│       └── templates/
│
└── tests/
    ├── init.test.ts
    ├── add.test.ts
    ├── remove.test.ts
    ├── doctor.test.ts
    └── fixtures/
```

---

# 50. `package.json` Expectations

Must expose CLI:

```json
{
  "bin": {
    "qaskill": "./dist/index.js"
  }
}
```

Required scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

Testing may use:

```text
Vitest
```

---

# 51. Project Root Detection

The CLI should identify project root by walking upward until finding one of:

```text
package.json
.git
pnpm-workspace.yaml
yarn.lock
package-lock.json
```

Prefer the nearest `package.json`.

If no project root can be found, use current directory with a warning.

---

# 52. Safe File Operations

The CLI must:

- never delete arbitrary user files;
- never overwrite `.qa-skills` without warning;
- never modify application source code;
- never modify `package.json` unless strictly necessary;
- not install runtime hooks;
- not execute arbitrary scripts.

QASkill only manages its own directory.

---

# 53. Managed Files

Add metadata:

```text
.qa-skills/.qaskill.json
```

Example:

```json
{
  "version": "1.0.0",
  "installedAt": "2026-09-11T00:00:00.000Z",
  "managedDirectory": ".qa-skills",
  "presets": [
    "login",
    "form",
    "crud"
  ]
}
```

This file is used by:

```text
list
update
doctor
```

---

# 54. Recommended Default Presets

`init` should install:

```text
login
form
crud
table
search
filter
pagination
modal
```

`upload` and `navigation` may also be installed by default because they are lightweight.

Alternatively `--minimal` installs no presets.

---

# 55. AI Invocation Instructions

After installation, print:

```text
QASkill installed successfully.

Ask your AI coding agent:

"Read .qa-skills/SKILL.md first.
Analyze this UI using QASkill and generate manual test cases.
Do not invent business rules."

Recommended context:
- screenshot
- relevant component source
- requirement/business rules
```

---

# 56. Example: Login Page

Input evidence:

```tsx
<form onSubmit={handleSubmit}>
  <input type="email" required />
  <input type={showPassword ? 'text' : 'password'} minLength={8} maxLength={20} />
  <button type="button" onClick={() => setShowPassword(v => !v)}>
    Show password
  </button>
  <button type="submit" disabled={isLoading}>
    Login
  </button>
</form>
```

Requirement:

```text
Users can sign in using a registered email and password.
```

AI should extract:

```text
Known:
- email field exists
- email field is required
- password exists
- password length 8–20
- show/hide password exists
- submit button is disabled while loading

Unknown:
- failed attempt policy
- exact invalid-credential message
- post-login destination
- password complexity
```

Expected boundary cases:

```text
7 chars
8 chars
9 chars
19 chars
20 chars
21 chars
```

Expected interaction cases:

```text
show password
hide password
submit while loading
Enter submit if browser/form supports normal form behavior
```

Do NOT invent:

```text
Lock account after 5 attempts.
```

---

# 57. Example: CRUD List

Source/UI contains:

```text
Search
Status Filter
Add User
Table
Edit
Delete
Pagination
```

Applicable skills/presets:

```text
ui-analysis
functional-testing
negative-testing
interaction-testing
state-testing
responsive-testing

crud
table
search
filter
pagination
modal
```

Expected broad coverage:

```text
load records
empty records
load error
search matching
search no results
clear search
filter
filter + search
next/previous page
edit action
delete confirmation
cancel delete
successful delete
failed delete
delete last row on page
responsive table
keyboard access to actions
```

---

# 58. Duplicate Prevention

The review skill must combine equivalent cases.

Bad:

```text
TC-01 Leave email empty.
TC-02 Do not enter email.
TC-03 Submit without email.
```

If these represent the same condition, keep one strong test case.

It is acceptable to separate them only if the interaction path is materially different.

---

# 59. Test Case Granularity

Avoid extremes.

Too broad:

```text
Test the login form.
```

Too narrow:

```text
Verify email input border radius.
```

Preferred:

```text
Verify required email validation when the form is submitted without an email.
```

Visual pixel-level tests should only be generated when specifically requested.

---

# 60. Priority Guidance

Suggested default:

## HIGH

```text
Primary business path
Data loss risk
Critical validation
Create/update/delete
Authentication
Blocking error
```

## MEDIUM

```text
Secondary behavior
Common negative case
Boundary
Search/filter
Loading/empty/error state
```

## LOW

```text
Minor usability
Non-critical visual/interaction behavior
Edge scenario with low impact
```

Priority is a heuristic unless project rules specify otherwise.

---

# 61. Test Type Classification

One test case should have one primary type:

```text
FUNCTIONAL
VALIDATION
BOUNDARY
NEGATIVE
INTERACTION
STATE
RESPONSIVE
ACCESSIBILITY
```

A case may touch multiple concerns, but choose the dominant type.

---

# 62. What QASkill Must NOT Do

MVP exclusions:

```text
No browser automation
No Playwright generation
No Cypress generation
No Jest generation
No API execution
No database connection
No screenshots generated by the CLI
No AI API integration
No GUI
No SaaS dashboard
No accounts
No subscriptions
No cloud sync
No Jira integration
No Redmine integration
No Figma API integration
No multi-agent framework
```

These may become future products but must not block MVP.

---

# 63. Optional V2 Features

After MVP is stable:

```text
qaskill add api
qaskill add ecommerce
qaskill add payment
qaskill add authentication
qaskill add role-permission
```

Potential new presets:

- checkout;
- payment;
- registration;
- forgot-password;
- dashboard;
- drag-drop;
- rich-text-editor;
- notification;
- real-time/chat;
- date/time;
- permissions.

---

# 64. Optional AI-Tool Adapters

Future versions may create vendor-specific instruction files:

```bash
qaskill adapter claude
qaskill adapter cursor
qaskill adapter cline
```

Possible generated files:

```text
CLAUDE.md
.cursor/rules/qaskill.mdc
```

But these adapters MUST only reference the canonical files:

```text
.qa-skills/
```

Never duplicate all methodology across vendor files.

Example adapter text:

```text
When the user asks for manual test cases, read `.qa-skills/SKILL.md`
and follow QASkill before generating output.
```

Vendor adapters are V2, not required for MVP.

---

# 65. Config Validation

Use Zod.

Pseudo schema:

```ts
const ConfigSchema = z.object({
  version: z.number(),
  language: z.enum(['en', 'vi']).default('en'),
  testcase: z.object({
    format: z.enum(['markdown', 'compact']),
    id_prefix: z.string().min(1),
    include: z.array(z.string()),
  }),
  rules: z.object({
    include_unknown_rules_section: z.boolean(),
    include_coverage_summary: z.boolean(),
    prevent_business_rule_invention: z.boolean(),
    remove_duplicates: z.boolean(),
  }),
});
```

The actual schema may include additional documented fields.

---

# 66. CLI Error Handling

Use readable errors.

Examples:

```text
Error: .qa-skills already exists.
Run with --force to reinstall.
```

```text
Error: preset "payments" was not found.

Available presets:
login
form
crud
table
search
filter
pagination
modal
upload
navigation
```

Do not expose stack traces by default.

Use a debug flag if needed:

```bash
qaskill init --debug
```

---

# 67. Console Design

Keep CLI simple.

Examples:

```text
QASkill

✓ Project root detected
✓ Master skill installed
✓ Core QA skills installed
✓ 10 presets installed
✓ Config created

Ready.
```

Do not overuse ASCII art.

---

# 68. Unit Tests

Required tests:

## Init

```text
creates .qa-skills
creates master SKILL.md
creates config
creates core skills
creates metadata
does not overwrite without force
force reinstall works
```

## Add

```text
adds known preset
does not duplicate preset
unknown preset returns error
metadata updated
```

## Remove

```text
removes installed preset
metadata updated
cannot remove core skill
```

## Doctor

```text
healthy install succeeds
missing master skill fails
invalid config fails
missing core skill fails
```

## Config

```text
default config validates
invalid language fails
invalid format fails
```

---

# 69. Integration Test

Create a temporary fake project:

```text
/tmp/qaskill-test/
└── package.json
```

Run:

```bash
qaskill init
```

Verify full generated tree.

Then:

```bash
qaskill add upload
qaskill doctor
```

Verify successful state.

All tests must operate in temporary directories and clean up afterwards.

---

# 70. Documentation

Repository README must contain:

```text
What QASkill is
Why it exists
Installation
Quick start
How to ask AI to use it
Inputs supported
Example Login workflow
CLI commands
Folder structure
Configuration
Available presets
Rules against hallucinated business logic
Development instructions
Roadmap
```

---

# 71. README Quick Start

Recommended:

```markdown
## Quick Start

Install QASkill into your project:

```bash
npx qaskill init
```

Then tell your AI coding agent:

> Read `.qa-skills/SKILL.md`.
> Analyze `src/features/login/LoginForm.tsx` using QASkill.
> Generate complete manual test cases.
> Do not invent business rules.

For best results provide:
1. the relevant source file;
2. a UI screenshot;
3. known requirements.
```

---

# 72. Repository Development

Local setup:

```bash
git clone <repo>
cd qaskill
npm install
npm run build
npm test
```

Local CLI test:

```bash
npm link
```

Then inside another sample project:

```bash
qaskill init
```

---

# 73. MVP Implementation Phases

The AI coding agent must implement in this order.

---

## Phase 1 — Bootstrap CLI

Tasks:

```text
Initialize npm project
Configure TypeScript
Add Commander
Create CLI entry
Implement --help
Implement version
Build to dist
Configure bin
```

Acceptance:

```bash
qaskill --help
qaskill version
```

work.

---

## Phase 2 — Template Assets

Create:

```text
templates/.qa-skills/
```

Implement:

```text
SKILL.md
config.yml
core files
10 skill files
10 preset files
3 output templates
```

Acceptance:

Templates are complete and internally consistent.

---

## Phase 3 — Init Command

Implement:

```bash
qaskill init
```

Features:

```text
project root detection
copy template
overwrite protection
--force
--language
--minimal
metadata creation
```

Acceptance:

A normal Node project receives a valid `.qa-skills` installation.

---

## Phase 4 — Preset Management

Implement:

```bash
qaskill list
qaskill add
qaskill remove
```

Acceptance:

Presets can be added/removed safely.

---

## Phase 5 — Doctor

Implement:

```bash
qaskill doctor
```

Acceptance:

It detects valid and broken installation states.

---

## Phase 6 — Update

Implement safe standard file update.

If update complexity becomes risky, initial MVP may support:

```bash
qaskill update --force
```

with automatic backup.

Never silently destroy user files.

---

## Phase 7 — Automated Tests

Implement:

```text
unit tests
temporary directory integration tests
config validation tests
```

Target:

Core CLI behavior should be reliably tested.

---

## Phase 8 — README and Release

Complete:

```text
README
LICENSE
CHANGELOG
npm package files
```

Test package locally with:

```bash
npm pack
```

Install resulting tarball in a sample app.

---

# 74. Definition of Done — MVP

MVP is complete when:

1. User can run:

```bash
npx qaskill init
```

2. `.qa-skills` is installed.

3. An AI coding agent can read:

```text
.qa-skills/SKILL.md
```

4. The AI is instructed to systematically apply:

```text
UI analysis
functional
validation
boundary
negative
interaction
state
responsive
accessibility
review
```

5. Common presets are provided.

6. AI instructions explicitly prohibit invented business rules.

7. Output format is standardized.

8. AI performs duplicate removal and coverage review.

9. CLI supports:

```text
init
list
add
remove
doctor
version
```

10. Core CLI tests pass.

---

# 75. Acceptance Scenario A — Login

Given:

```text
Screenshot of Login page
+
LoginForm.tsx
+
Requirement:
"User can login with registered email and password.
Password length: 8–20."
```

When AI is asked:

```text
Read .qa-skills/SKILL.md and create manual test cases.
```

Expected:

AI should cover:

```text
valid login
empty email
invalid email format if supported by source
empty password
password 7/8/9
password 19/20/21
show/hide password if present
submit
loading if present
invalid login response if implementation supports it
responsive
keyboard/accessibility basics
```

AI must NOT invent:

```text
5 failed attempts lock account
15 minute lock
dashboard redirect
password complexity
```

unless evidence exists.

---

# 76. Acceptance Scenario B — User Management

Given UI:

```text
Search
Status filter
Add
Table
Edit
Delete
Pagination
```

Expected applicable presets:

```text
crud
table
search
filter
pagination
modal
```

Expected coverage:

```text
load
empty
error
search
clear
filter
combined search/filter
page navigation
add
edit
delete
cancel delete
delete error
responsive
keyboard access
```

---

# 77. Acceptance Scenario C — Unknown Rule

Given:

```text
Login UI screenshot only.
```

Expected:

AI may identify UI test areas.

AI must put business uncertainties under:

```text
Questions / Missing Rules
```

It must NOT fabricate authentication policies.

---

# 78. Quality Rules for Markdown Skills

Skill files must be:

```text
concise enough for AI context
specific
actionable
non-repetitive
vendor-neutral
structured using headings and checklists
```

Avoid huge theoretical QA textbooks.

Every rule should improve test-generation behavior.

---

# 79. Skill File Template

New skill format:

```markdown
# Skill: <Name>

## Purpose

<What this skill is for>

## Apply When

<Conditions>

## Inputs To Inspect

- ...

## Procedure

1. ...
2. ...

## Checklist

- ...

## Do Not Assume

- ...

## Output Expectations

- ...
```

---

# 80. Preset File Template

```markdown
# Preset: <Name>

## Apply When

...

## Core Areas

- ...

## Recommended Skills

- ...

## Scenario Checklist

- ...

## Missing Business Rules To Flag

- ...

## Common Duplicate Cases

- ...
```

---

# 81. Master Skill Linking

Master `SKILL.md` must reference relative files.

Example:

```text
Before generating cases, read:

core/evidence-rules.md
core/test-design-process.md
core/output-contract.md

Then choose relevant files under:

skills/
presets/
```

Do NOT tell AI to read every preset every time.

Select only applicable presets to control context size.

---

# 82. Context-Efficiency Rule

AI should not load irrelevant skills.

Example:

For Login:

```text
load:
ui-analysis
functional-testing
form-validation
boundary-value
negative-testing
interaction-testing
state-testing
responsive-testing
accessibility-testing
testcase-review
login preset
form preset
```

Do not load:

```text
pagination
table
upload
```

unless those controls exist.

---

# 83. Preset Detection Rules

Master skill should contain mapping examples:

```text
Login/auth screen
→ login

Generic form
→ form

Create/Edit/Delete
→ crud

Rows/columns
→ table

Keyword input
→ search

Status/category selection
→ filter

Page navigation
→ pagination

Dialog/confirmation
→ modal

File picker/drop zone
→ upload

Route/menu/back behavior
→ navigation
```

More than one preset may apply.

---

# 84. Source Code Inspection Rules

When source is available, inspect for:

```text
HTML input types
required
min
max
minLength
maxLength
pattern
disabled
readOnly
conditional render
loading flags
error flags
empty-state conditions
router navigation
submit handlers
API service calls
validation schema
Zod/Yup rules
React Hook Form rules
permission checks
debounce
pagination limits
```

AI must cite these in Evidence where useful.

---

# 85. React/Next.js Awareness

QASkill is framework-neutral, but the instructions may recognize common frontend patterns:

```text
React state
React Hook Form
Zod
Yup
Next.js router
Tailwind breakpoints
disabled prop
conditional JSX
loading skeleton
modal open state
```

Do not make these mandatory dependencies.

---

# 86. Evidence Extraction Example

Given:

```ts
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});
```

AI extracts:

```text
email:
- must be valid email

name:
- min 2
- max 50
```

Boundary:

```text
1
2
3
49
50
51 characters
```

---

# 87. Visual vs Business Testing

QASkill should separate:

```text
UI-visible behavior
```

from:

```text
business behavior
```

Screenshot can justify:

```text
button exists
field exists
modal exists
layout exists
```

Screenshot cannot justify:

```text
maximum purchase quantity is 10
account locks after 5 failures
refund available for 30 days
```

---

# 88. Screenshot Limitations

Master skill must warn:

```text
A screenshot is a snapshot, not a complete specification.

Do not infer hidden interactions, validation thresholds,
API behavior, authorization rules or backend policy solely from appearance.
```

---

# 89. Responsive Evidence

When source contains:

```text
sm:
md:
lg:
xl:
```

or media queries, AI may use them as evidence.

Example:

```text
grid-cols-1 md:grid-cols-2
```

Possible test:

```text
Verify the form uses one-column layout below the md breakpoint
and two-column layout at/above the md breakpoint.
```

Evidence:

```text
Source: Tailwind responsive class.
```

---

# 90. Accessibility Evidence

If source contains:

```tsx
<label htmlFor="email">
<input id="email">
```

AI can test label association.

If missing, AI can flag:

```text
Potential accessibility issue:
Email input does not appear to have an associated label.
```

But avoid claiming failure if surrounding implementation is not fully visible.

---

# 91. Security Scope

Manual QA may include safe checks such as:

```text
password masked
sensitive data not visibly exposed
unauthorized UI action not available if role rules are known
duplicate submission prevention
```

Do NOT turn QASkill into exploit-generation guidance.

---

# 92. Output Ordering

Recommended ordering:

```text
1. Test Context
2. Evidence Summary
3. Functional Test Cases
4. Validation Test Cases
5. Boundary Test Cases
6. Negative Test Cases
7. Interaction/State Cases
8. Responsive Cases
9. Accessibility Cases
10. Coverage Summary
11. Questions / Missing Rules
```

This makes review easier.

---

# 93. Test Context Header

Example:

```markdown
# Manual Test Cases — Login

## Test Context

**Target:** Login screen

**Evidence used:**
- `LoginForm.tsx`
- Login screenshot
- Requirement provided by user

**Applied skills:**
- UI Analysis
- Functional Testing
- Form Validation
- Boundary Value
- Negative Testing
- Interaction Testing
- State Testing
- Responsive Testing
- Accessibility Testing

**Applied presets:**
- Login
- Form
```

---

# 94. IDs

Default:

```text
TC-001
TC-002
TC-003
```

Optional module-specific generated ID:

```text
LOGIN-001
USER-001
COURSE-001
```

If module name is known, prefer module-specific prefix.

Do not require perfect global uniqueness across the whole repository.

---

# 95. No Automatic Source Modification

When asked for test cases:

QASkill instructions must tell the AI:

```text
Do not modify application source code unless the user explicitly asks.
```

The task is QA test design first.

---

# 96. Output Destination

By default, AI returns test cases in chat.

If user asks to save them, recommended repository destination:

```text
docs/testcases/
```

Example:

```text
docs/testcases/login.md
```

QASkill CLI itself does not generate these test case files.

The AI agent may create them only when asked.

---

# 97. Optional Custom Skills

Users may create:

```text
.qa-skills/custom/
```

Example:

```text
.qa-skills/custom/company-auth.md
```

Master skill may read custom files when explicitly referenced.

The CLI should preserve:

```text
.qa-skills/custom/
```

during update.

MVP installer may create an empty directory with README:

```text
custom/README.md
```

---

# 98. Custom Preset Convention

Custom preset:

```text
.qa-skills/custom/presets/
```

Example:

```text
company-course-management.md
```

QASkill does not need complex registration logic in MVP.

The AI may read it when told.

---

# 99. Update Safety for Custom Content

Never overwrite:

```text
.qa-skills/custom/
```

Never overwrite:

```text
config.yml
```

without explicit user action.

Managed package files may be updated only through safe update behavior.

---

# 100. Versioning

Semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0 MVP
1.1.0 new presets
1.2.0 adapters
2.0.0 breaking skill format
```

---

# 101. Git Behavior

QASkill files SHOULD be committed to Git.

Reason:

```text
The whole development team shares the same QA methodology.
```

README should explicitly recommend:

```bash
git add .qa-skills
git commit -m "chore: add QASkill manual QA rules"
```

Do not add `.qa-skills` to `.gitignore` by default.

---

# 102. Why Files Live Inside the Project

Advantages:

```text
Version controlled
Reviewable
Team shared
Works offline after installation
No external account
No vendor lock-in
AI agents can read local files
Company-specific customization possible
```

---

# 103. MVP Success Metric

The MVP succeeds if a developer can:

```text
1. install QASkill in < 1 minute;
2. point an AI coding agent to `.qa-skills/SKILL.md`;
3. provide a UI component/screenshot;
4. receive test cases substantially more systematic than a generic prompt;
5. see which cases come from evidence vs unknown business rules.
```

---

# 104. Future Evaluation Harness

Not required for MVP, but design for future evaluation.

Possible benchmark:

```text
10 sample screens
Known gold test areas
Compare:
generic prompt
vs
QASkill
```

Metrics:

```text
UI element coverage
boundary coverage
negative coverage
duplicate rate
invented-rule rate
missing-rule detection
```

This could become a strong project/demo feature later.

---

# 105. Demo Project

Repository may contain:

```text
examples/
├── login/
│   ├── LoginForm.tsx
│   ├── requirement.md
│   └── expected-test-areas.md
│
└── user-management/
    ├── UserManagement.tsx
    ├── requirement.md
    └── expected-test-areas.md
```

These examples help verify the skill quality manually.

---

# 106. Example Prompt for AI Agent

Provide this in README:

```text
Read `.qa-skills/SKILL.md` first and follow it strictly.

Target:
`src/components/LoginForm.tsx`

Additional context:
- attached Login UI screenshot
- password length is 8–20 characters

Task:
Generate a complete set of manual test cases for this UI.

Requirements:
- apply relevant QASkill skills and presets;
- do not invent business rules;
- identify missing requirements separately;
- remove duplicate cases;
- include a coverage summary;
- use the configured test-case format.
```

---

# 107. Short Prompt

For daily use:

```text
Use QASkill to test this screen.
Read `.qa-skills/SKILL.md`.
```

The Master Skill must make this short instruction sufficient when the target UI is obvious from context.

---

# 108. AI Agent Implementation Rules

The coding agent building QASkill must follow these rules:

1. Implement the requested MVP only.
2. Do not add backend infrastructure.
3. Do not add a frontend dashboard.
4. Do not integrate an LLM API.
5. Do not implement Playwright/Cypress execution.
6. Do not create unnecessary abstractions.
7. Keep the CLI understandable by a junior TypeScript developer.
8. Prefer small modules.
9. Write tests for filesystem mutation.
10. Protect user files.
11. Use cross-platform file paths.
12. Support macOS, Windows and Linux.
13. Do not depend on shell-only Unix behavior.
14. Validate inputs.
15. Keep skill content separate from CLI logic.

---

# 109. Cross-Platform Requirements

Must work on:

```text
Windows
macOS
Linux
```

Use:

```ts
path.join()
path.resolve()
```

Do not manually concatenate path separators.

Do not assume:

```text
/bin/bash
```

---

# 110. Node ESM/CommonJS

Prefer a modern package configuration.

Either:

```text
ESM
```

or:

```text
CommonJS
```

is acceptable, but choose one consistently.

Recommended:

```json
{
  "type": "module"
}
```

Ensure the published CLI works after compilation.

---

# 111. Packaging Templates

When npm package is built/published, include:

```text
dist/
templates/
README.md
LICENSE
```

Use `files` in `package.json`:

```json
{
  "files": [
    "dist",
    "templates",
    "README.md",
    "LICENSE"
  ]
}
```

Do not accidentally exclude Markdown skill assets.

---

# 112. CLI Template Path

Runtime cannot assume current working directory is package directory.

Resolve templates relative to installed package module location.

For ESM:

```ts
import { fileURLToPath } from 'node:url';
```

Derive package root safely.

Add tests for local package usage if possible.

---

# 113. Logging

Create small logger utility:

```ts
success()
info()
warning()
error()
```

Do not over-engineer.

---

# 114. Confirmation

For destructive operations:

```text
init on existing installation
remove preset
update overwrite
```

Use interactive confirmation when TTY is available.

Also support non-interactive flags:

```text
--force
--yes
```

CI should not hang waiting for input.

---

# 115. Exit Codes

Success:

```text
0
```

Invalid command/user error:

```text
1
```

Unexpected internal error:

```text
1
```

Readable user message required.

---

# 116. Help Output

Example:

```text
Usage: qaskill [command]

Install and manage AI Manual QA skills for developers.

Commands:
  init              Install QASkill into the current project
  list              Show installed skills and presets
  add <preset>      Add a QA preset
  remove <preset>   Remove a QA preset
  update            Update managed QA skill files
  doctor            Validate the installation
  version           Show QASkill version
```

---

# 117. `--dry-run`

Nice-to-have, not required.

If implemented:

```bash
qaskill init --dry-run
```

shows files that would be created.

Do not delay MVP for this option.

---

# 118. Minimal Installation

Command:

```bash
qaskill init --minimal
```

Creates:

```text
SKILL.md
config.yml
core/
skills/
templates/
.qaskill.json
```

No domain presets.

User adds:

```bash
qaskill add login
```

---

# 119. Default Installation

For beginner friendliness, default `init` should install all built-in presets.

There are only a small number of Markdown files.

This makes first use easy.

---

# 120. No Telemetry in MVP

Do not collect:

```text
project paths
source code
test cases
usage
screenshots
```

No telemetry.

QASkill should operate locally.

---

# 121. Privacy Position

Because the package is local methodology only:

```text
QASkill itself sends no project data anywhere.
```

The user's chosen AI coding tool may have its own data policy, but that is outside QASkill's responsibility.

README may explain this distinction briefly.

---

# 122. Open Source Recommendation

Recommended license:

```text
MIT
```

This makes adoption easy.

---

# 123. Suggested Repository Description

```text
Installable Manual QA skills for AI coding agents.
Generate more complete UI test cases from your code, screenshots and requirements.
```

---

# 124. Suggested README Header

```markdown
# QASkill

Manual QA skills for AI coding agents.

Install a repeatable QA methodology into any frontend project and teach
your AI assistant to generate comprehensive manual test cases without
inventing business rules.
```

---

# 125. Project Differentiator

QASkill is NOT:

```text
"another prompt file"
```

The product value is the structured combination of:

```text
Master orchestration
Evidence rules
Reusable QA skills
UI presets
Standard output contract
Unknown-rule handling
Duplicate review
Coverage review
CLI distribution
Version-controlled team methodology
```

---

# 126. Capstone / Portfolio Explanation

If used as a project presentation:

> QASkill is a developer tool that packages Manual QA testing methodology as installable AI skills. Instead of asking an AI model to casually generate test cases, developers install QASkill into the repository. The AI coding agent then follows standardized evidence rules, testing techniques, UI presets and output templates to design more comprehensive manual test cases for the current screen while explicitly avoiding invented business rules.

---

# 127. Demo Flow

Recommended demo:

```text
1. Open a React/Next.js sample project.
2. Show LoginForm.tsx.
3. Run:
   npx qaskill init
4. Show generated .qa-skills.
5. Attach/show the Login screenshot.
6. Ask AI:
   "Use QASkill to create test cases for LoginForm.tsx."
7. Show generated test cases.
8. Highlight:
   - boundary cases
   - negative cases
   - UI interaction
   - responsive
   - accessibility
   - unknown rules
9. Add a requirement:
   "Lock after 5 failed attempts for 15 minutes."
10. Ask AI to regenerate/update.
11. Show new cases now appear because evidence exists.
```

This directly demonstrates the difference between:

```text
AI guessing
```

and:

```text
AI following a controlled QA skill methodology.
```

---

# 128. Implementation Priority

If time is limited, prioritize in this exact order:

```text
1. High-quality SKILL.md methodology
2. Core QA skill Markdown files
3. Login/Form/CRUD/Table presets
4. init CLI
5. list/add/remove
6. doctor
7. automated tests
8. update
9. additional presets
10. adapters
```

The skill quality matters more than fancy CLI features.

---

# 129. Anti-Overengineering Rule

Do not create:

```text
SkillEngine class
AgentOrchestrator class
PromptCompiler
LLMProvider
KnowledgeGraph
WorkflowGraph
PluginRuntime
```

These are unnecessary because the external AI coding agent performs orchestration.

QASkill stores instructions and manages installation.

---

# 130. Final MVP Architecture

```text
Developer Project
│
├── Application Source
│
└── .qa-skills
    │
    ├── Master QA Skill
    ├── Core QA Skills
    ├── Presets
    ├── Output Templates
    └── Config

          ▲
          │ reads
          │

AI Coding Agent
(Cursor / Claude / Cline / etc.)
          │
          │ analyzes
          ▼

Screenshot + Source + Requirement
          │
          ▼

Manual Test Case Set
```

QASkill CLI responsibility:

```text
Install
Manage
Update
Validate
```

AI coding agent responsibility:

```text
Read
Analyze
Apply
Generate
Review
```

---

# 131. Final Build Instruction for the AI Coding Agent

The AI coding agent implementing this repository must:

```text
1. Read this entire specification.
2. Create an implementation checklist.
3. Implement phases sequentially.
4. Keep the product vendor-neutral.
5. Build the CLI in TypeScript.
6. Store all QA methodology in Markdown/YAML assets.
7. Implement safe local filesystem operations.
8. Write automated tests for CLI behavior.
9. Ensure the generated `.qa-skills` tree matches this specification.
10. Do not expand the scope into a SaaS, backend, LLM API or automated testing framework.
```

If a small implementation detail is unspecified:

```text
Choose the simplest maintainable option that preserves this product design.
```

Do not stop implementation merely because a minor naming/detail decision is unspecified.

---

# 132. Final MVP Checklist

## CLI

- [ ] TypeScript CLI boots
- [ ] `qaskill --help`
- [ ] `qaskill init`
- [ ] `qaskill list`
- [ ] `qaskill add`
- [ ] `qaskill remove`
- [ ] `qaskill doctor`
- [ ] `qaskill version`
- [ ] safe update strategy

## Installed package

- [ ] `.qa-skills/SKILL.md`
- [ ] `config.yml`
- [ ] evidence rules
- [ ] test design process
- [ ] coverage checklist
- [ ] output contract
- [ ] UI analysis skill
- [ ] functional skill
- [ ] form validation skill
- [ ] boundary skill
- [ ] negative skill
- [ ] interaction skill
- [ ] state skill
- [ ] responsive skill
- [ ] accessibility skill
- [ ] testcase review skill

## Presets

- [ ] login
- [ ] form
- [ ] crud
- [ ] table
- [ ] search
- [ ] filter
- [ ] pagination
- [ ] modal
- [ ] upload
- [ ] navigation

## Quality

- [ ] no invented business rules
- [ ] evidence included
- [ ] unknown rules separated
- [ ] duplicate cases removed
- [ ] coverage review included
- [ ] cross-platform
- [ ] automated tests
- [ ] README
- [ ] local npm package test

---

# 133. End State

When the project is complete, a developer should be able to do this:

```bash
cd my-project
npx qaskill init
```

Then say to the AI coding agent:

```text
Use QASkill to test this UI.
```

And receive a structured Manual QA test design that systematically covers the screen based on available evidence.

That is the entire product.

Keep it simple.
Keep it local.
Keep it installable.
Keep it focused on helping developers design better Manual QA test cases.
