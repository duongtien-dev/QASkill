import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { loadConfig } from '../src/services/config-manager';
import { readMetadata } from '../src/services/metadata';
import { CORE_SKILLS, DEFAULT_PRESETS } from '../src/services/preset-manager';
import { QA_SKILLS_DIR } from '../src/utils/paths';
import { cleanup, createTempProject, exists, listFilesRelative } from './helpers';

describe('qaskill init', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('creates the .qa-skills directory and the master SKILL.md', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR))).toBe(true);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'SKILL.md'))).toBe(true);
  });

  it('creates a valid config with the default language', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'config.yml'))).toBe(true);
    const config = await loadConfig(projectRoot);
    expect(config.version).toBe(2);
    expect(config.language).toBe('en');
    expect(config.testcase.format).toBe('compact');
    expect(config.response.mode).toBe('standard');
  });

  it('honours the --language flag', async () => {
    await initProject({ cwd: projectRoot, language: 'vi', logger: silentLogger });
    const config = await loadConfig(projectRoot);
    expect(config.language).toBe('vi');
  });

  it('creates all core skills', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    for (const skill of CORE_SKILLS) {
      expect(
        await exists(path.join(projectRoot, QA_SKILLS_DIR, 'skills', skill, 'SKILL.md')),
        `missing skill ${skill}`,
      ).toBe(true);
    }
  });

  it('creates all default presets and the output templates', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    for (const preset of DEFAULT_PRESETS) {
      expect(
        await exists(path.join(projectRoot, QA_SKILLS_DIR, 'presets', `${preset}.md`)),
        `missing preset ${preset}`,
      ).toBe(true);
    }
    for (const template of [
      'testcase-markdown.md',
      'testcase-compact.md',
      'testcase-detailed.md',
      'coverage-report.md',
    ]) {
      expect(
        await exists(path.join(projectRoot, QA_SKILLS_DIR, 'templates', template)),
        `missing template ${template}`,
      ).toBe(true);
    }
  });

  it('creates metadata describing the installation', async () => {
    const result = await initProject({ cwd: projectRoot, logger: silentLogger });
    const metadata = await readMetadata(projectRoot);
    expect(metadata?.managedDirectory).toBe(QA_SKILLS_DIR);
    expect(metadata?.version).toBe(result.version);
    expect(metadata?.presets).toEqual([...DEFAULT_PRESETS].sort((a, b) => a.localeCompare(b)));
  });

  it('does not overwrite an existing installation without --force', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    await expect(initProject({ cwd: projectRoot, logger: silentLogger })).rejects.toThrow(
      /already exists/,
    );
  });

  it('reinstalls with --force and preserves custom content', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    const customFile = path.join(projectRoot, QA_SKILLS_DIR, 'custom', 'company-auth.md');
    await fs.writeFile(customFile, '# custom\n', 'utf8');

    const result = await initProject({ cwd: projectRoot, force: true, logger: silentLogger });
    expect(result.overwritten).toBe(true);
    expect(await exists(customFile)).toBe(true);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'SKILL.md'))).toBe(true);
  });

  it('installs no presets with --minimal but keeps core skills', async () => {
    await initProject({ cwd: projectRoot, minimal: true, logger: silentLogger });
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'SKILL.md'))).toBe(true);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'skills', 'ui-analysis'))).toBe(true);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'presets'))).toBe(false);
    const metadata = await readMetadata(projectRoot);
    expect(metadata?.presets).toEqual([]);
  });

  it('produces the documented tree shape', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    const files = await listFilesRelative(path.join(projectRoot, QA_SKILLS_DIR));
    for (const expected of [
      'SKILL.md',
      'config.yml',
      '.qaskill.json',
      'core/evidence-rules.md',
      'core/test-design-process.md',
      'core/coverage-checklist.md',
      'core/output-contract.md',
      'skills/ui-analysis/SKILL.md',
      'skills/testcase-review/SKILL.md',
      'presets/login.md',
      'templates/coverage-report.md',
      'templates/testcase-detailed.md',
      'custom/README.md',
    ]) {
      expect(files, `expected ${expected} in installation`).toContain(expected);
    }
  });

  it('supports --dry-run without writing files', async () => {
    const result = await initProject({ cwd: projectRoot, dryRun: true, logger: silentLogger });
    expect(result.dryRun).toBe(true);
    expect(result.files.length).toBeGreaterThan(0);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR))).toBe(false);
  });
});
