# QASkill

Manual QA skills for AI coding agents.

Install a repeatable QA methodology into any frontend project and teach your AI
assistant to generate comprehensive manual test cases without inventing business
rules.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

> Installable Manual QA skills for AI coding agents. Generate more complete UI test
> cases from your code, screenshots and requirements.

---

## Why QASkill exists

Ask a generic AI assistant "create test cases for this login screen" and the result
is often incomplete. It may:

- generate only happy-path scenarios
- miss boundary values
- miss negative cases
- ignore buttons, links, checkboxes, modals, tables, pagination and filters
- **invent business rules that were never provided**
- omit loading / error / empty states
- forget mobile / responsive cases
- produce inconsistent output formats
- create duplicate test cases
- fail to distinguish facts from assumptions

QASkill installs a **repeatable QA methodology** into your project so the AI follows
the same test-design process every time — and clearly separates what comes from
evidence from what still needs a business decision.

QASkill is **not** a replacement for professional QA engineers. It is a development
support tool that helps developers self-test before handing work to QA.

---

## How it works

```text
Developer implements a UI
        ↓
Developer asks the AI coding agent to test it
        ↓
AI reads .qa-skills/SKILL.md
        ↓
AI analyzes screenshot / source / requirements
        ↓
AI generates Manual QA test cases (evidence-based, non-duplicated)
        ↓
Developer self-tests before sending work to QA
```

QASkill itself is only:

```text
npm CLI + Markdown/YAML skill files + templates + presets
```

It has **no** LLM API, backend, database, login, dashboard, vector database, or
browser automation. Your AI coding tool already provides the LLM. QASkill provides
the methodology, instructions, rules, checklists, presets and output contract.

---

## Installation

Run inside any project:

```bash
npx qaskill init
```

Node.js **>= 20** is required.

Or install globally:

```bash
npm install -g qaskill
qaskill init
```

`init` flags:

```bash
qaskill init --force            # reinstall over an existing installation
qaskill init --language vi      # en (default) or vi
qaskill init --minimal          # core skills only, no presets
qaskill init --dry-run          # list files without writing them
```

---

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

Short version for daily use:

> Use QASkill to test this screen. Read `.qa-skills/SKILL.md`.

Commit the methodology so the whole team shares it:

```bash
git add .qa-skills
git commit -m "chore: add QASkill manual QA rules"
```

Do **not** add `.qa-skills` to `.gitignore`.

## Inputs supported

| Input | Priority |
|---|---|
| Explicit requirement / business rule | 1 (highest) |
| Current source code | 2 |
| API contract | 3 |
| UI screenshot | 4 |
| Existing project conventions | 5 |
| Reasonable QA hypothesis (marked as ASSUMPTION) | 6 (lowest) |

A screenshot can justify "a button exists". It cannot justify "the account locks
after 5 failed attempts".

---

## Example: login workflow

Given `LoginForm.tsx` (see `examples/login/`) with `minLength={8}`, `maxLength={20}`,
a show/hide password toggle and a submit button disabled while loading, QASkill
produces coverage for:

```text
valid login
empty email
invalid email format
empty password
password 7 / 8 / 9 characters
password 19 / 20 / 21 characters
show / hide password
submit while loading
loading + error states
responsive + keyboard/accessibility basics
```

And it will **not** invent:

```text
account lock after 5 attempts
15 minute lock
redirect to Dashboard
password complexity
```

Those instead appear under **Questions / Missing Rules**.

See `examples/user-management/` for a CRUD + table + search + filter + pagination +
modal example.

---

## CLI commands

```bash
qaskill init              # install QASkill into the current project
qaskill list              # show installed skills and presets
qaskill add <preset>      # add a QA preset
qaskill remove <preset>   # remove a QA preset
qaskill update            # update managed QA skill files (with backup)
qaskill doctor            # validate the installation
qaskill version           # show the QASkill version
qaskill --help
```

Exit codes: `0` success, `1` user/validation error.

`update` behavior:

```text
- compares the package version
- creates a backup at .qa-skills-backup-YYYYMMDD-HHmmss/
- refreshes managed standard files
- preserves config.yml
- never overwrites .qa-skills/custom/
```

---

## Installed folder structure

```text
.qa-skills/
├── SKILL.md                  # master orchestration skill
├── config.yml                # language, format, rules
├── .qaskill.json             # installation metadata (managed)
│
├── core/
│   ├── evidence-rules.md
│   ├── test-design-process.md
│   ├── coverage-checklist.md
│   └── output-contract.md
│
├── skills/                   # 10 core QA skills
│   ├── ui-analysis/SKILL.md
│   ├── functional-testing/SKILL.md
│   ├── form-validation/SKILL.md
│   ├── boundary-value/SKILL.md
│   ├── negative-testing/SKILL.md
│   ├── interaction-testing/SKILL.md
│   ├── state-testing/SKILL.md
│   ├── responsive-testing/SKILL.md
│   ├── accessibility-testing/SKILL.md
│   └── testcase-review/SKILL.md
│
├── presets/                  # domain checklists
│   ├── login.md  form.md  crud.md  table.md  search.md
│   └── filter.md  pagination.md  modal.md  upload.md  navigation.md
│
├── templates/
│   ├── testcase-markdown.md
│   ├── testcase-compact.md
│   └── coverage-report.md
│
└── custom/                   # your project-specific content (never overwritten)
    └── README.md
```

---

## Configuration

`.qa-skills/config.yml`:

```yaml
version: 1

language: en            # en | vi

testcase:
  format: markdown      # markdown | compact
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

priorities: [HIGH, MEDIUM, LOW]

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

`language` controls the language of the **generated test cases**; the methodology
files remain English for consistency.

---

## Available presets

```text
login        authentication screens
form         generic data-entry forms
crud         create / read / update / delete flows
table        tabular data rendering
search       keyword search
filter       status / category narrowing
pagination   page navigation
modal        dialogs and confirmations
upload       file pickers and drop zones
navigation   routes, menus, back/forward
```

Add or remove presets with `qaskill add <preset>` / `qaskill remove <preset>`.

---

## Rules against hallucinated business logic

The master skill explicitly forbids inventing:

```text
password policies, timeout values, rate limits, permissions,
API status codes, redirect destinations, maximum file sizes,
business validation, account lock policies, pagination limits,
browser support
```

unless supported by evidence. Anything useful to test but unknown is listed under
**Questions / Missing Rules** instead of being turned into a fabricated expected
result.

---

## Privacy

QASkill is local methodology only. It **sends no project data anywhere** and
collects no telemetry (no paths, source code, test cases, usage or screenshots).
Your chosen AI coding tool has its own data policy, which is outside QASkill's
scope.

---

## Development

```bash
git clone <repo>
cd qaskill
npm install
npm run build
npm test
```

Local CLI testing:

```bash
npm link
# in another sample project:
qaskill init
```

Other scripts:

```bash
npm run dev        # run the CLI from source with tsx
npm run test:watch # watch mode
npm run lint       # eslint
```

Project layout:

```text
src/          CLI implementation (commands, services, schemas, utils)
templates/    the .qa-skills assets installed into user projects
tests/        Vitest unit + integration tests
examples/     demo targets for manual quality checks
```

---

## Roadmap

MVP is complete. Possible future work (not part of MVP):

- new presets: checkout, payment, registration, forgot-password, dashboard,
  drag-drop, rich-text-editor, notification, real-time/chat, date/time, permissions
- AI-tool adapters (`qaskill adapter claude|cursor|cline`) that reference the
  canonical `.qa-skills/` files without duplicating methodology
- an evaluation harness comparing generic output vs QASkill output

---

## License

MIT — see [LICENSE](./LICENSE).

QASkill is a portfolio/capstone-style project that demonstrates turning ad-hoc
"ask the AI for tests" into a **version-controlled, team-shared QA methodology**.


"# QASkill" 
