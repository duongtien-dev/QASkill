# Custom QASkill Content

This directory is reserved for project-specific QA methodology.

QASkill **never** overwrites anything in `custom/` during `qaskill update`.

## Usage

Add your own skill or rule file:

```text
.qa-skills/custom/company-auth.md
```

Add custom presets:

```text
.qa-skills/custom/presets/company-course-management.md
```

Files here are **not** loaded automatically. Reference them explicitly when
prompting your AI coding agent, for example:

```text
Read .qa-skills/SKILL.md and .qa-skills/custom/company-auth.md,
then generate manual test cases for this screen.
```

QASkill does not register custom files automatically; keeping them explicit keeps
the AI context small and predictable.
