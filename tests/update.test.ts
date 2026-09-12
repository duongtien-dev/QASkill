import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { updateInstallation } from '../src/services/updater';
import { loadConfig } from '../src/services/config-manager';
import { readMetadata } from '../src/services/metadata';
import { QA_SKILLS_DIR, getQaSkillsDir } from '../src/utils/paths';
import { cleanup, createTempProject, exists } from './helpers';

describe('qaskill update', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
    await initProject({ cwd: projectRoot, logger: silentLogger });
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('creates a timestamped backup', async () => {
    const result = await updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger });
    expect(result.backupDir).toBeTruthy();
    expect(await exists(result.backupDir as string)).toBe(true);
    expect(path.basename(result.backupDir as string)).toMatch(/^\.qa-skills-backup-\d{8}-\d{6}$/);
  });

  it('preserves config.yml and custom content', async () => {
    const configBefore = await fs.readFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'config.yml'),
      'utf8',
    );
    const customFile = path.join(projectRoot, QA_SKILLS_DIR, 'custom', 'team.md');
    await fs.writeFile(customFile, '# team rules\n', 'utf8');

    await updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger });

    const configAfter = await fs.readFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'config.yml'),
      'utf8',
    );
    expect(configAfter).toBe(configBefore);
    expect(await exists(customFile)).toBe(true);
  });

  it('refreshes core skill files and keeps the config valid', async () => {
    await fs.writeFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'core', 'evidence-rules.md'),
      'tampered',
      'utf8',
    );
    await updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger });
    const restored = await fs.readFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'core', 'evidence-rules.md'),
      'utf8',
    );
    expect(restored).not.toBe('tampered');
    const config = await loadConfig(projectRoot);
    expect(config.version).toBe(2);
  });

  it('migrates a version 1 config to version 2 and preserves the language', async () => {
    await fs.writeFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'config.yml'),
      [
        'version: 1',
        'language: vi',
        'testcase:',
        '  format: markdown',
        '  id_prefix: CHECK',
        '  include:',
        '    - id',
        '    - title',
        'rules:',
        '  include_coverage_summary: true',
        '  prevent_business_rule_invention: true',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = await updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger });
    expect(result.configMigrated).toBe(true);

    const config = await loadConfig(projectRoot);
    expect(config.version).toBe(2);
    expect(config.language).toBe('vi');
    expect(config.testcase.id_prefix).toBe('CHECK');
    expect(config.testcase.format).toBe('compact');
    expect(config.response.show_coverage_summary).toBe(true);
  });

  it('keeps metadata version aligned with the package version', async () => {
    await updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger });
    const metadata = await readMetadata(projectRoot);
    expect(metadata?.version).toBeTruthy();
  });

  it('errors when QASkill is not installed', async () => {
    await fs.rm(getQaSkillsDir(projectRoot), { recursive: true, force: true });
    await expect(
      updateInstallation({ cwd: projectRoot, force: true, logger: silentLogger }),
    ).rejects.toThrow(/not installed/);
  });
});
