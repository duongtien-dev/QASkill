import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { runDoctor } from '../src/services/health-check';
import { QA_SKILLS_DIR } from '../src/utils/paths';
import { cleanup, createTempProject } from './helpers';

describe('qaskill doctor', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('reports a healthy installation', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    const result = await runDoctor(projectRoot);
    expect(result.healthy).toBe(true);
    expect(result.counts.coreSkills).toBe(10);
    expect(result.counts.presets).toBe(10);
  });

  it('fails when the managed directory is missing', async () => {
    const result = await runDoctor(projectRoot);
    expect(result.healthy).toBe(false);
    expect(result.checks[0]?.ok).toBe(false);
  });

  it('fails when the master skill is missing', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    await fs.rm(path.join(projectRoot, QA_SKILLS_DIR, 'SKILL.md'));
    const result = await runDoctor(projectRoot);
    expect(result.healthy).toBe(false);
    expect(result.checks.find((check) => check.name === 'Master skill')?.ok).toBe(false);
  });

  it('fails when config.yml is invalid', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    await fs.writeFile(
      path.join(projectRoot, QA_SKILLS_DIR, 'config.yml'),
      'version: 1\nlanguage: fr\n',
      'utf8',
    );
    const result = await runDoctor(projectRoot);
    expect(result.healthy).toBe(false);
    expect(result.checks.find((check) => check.name === 'Config')?.ok).toBe(false);
  });

  it('fails when a core skill is missing', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    await fs.rm(path.join(projectRoot, QA_SKILLS_DIR, 'skills', 'boundary-value'), {
      recursive: true,
      force: true,
    });
    const result = await runDoctor(projectRoot);
    expect(result.healthy).toBe(false);
    expect(result.counts.coreSkills).toBe(9);
    expect(
      result.checks.find((check) => check.name.includes('core skills'))?.ok,
    ).toBe(false);
  });
});
