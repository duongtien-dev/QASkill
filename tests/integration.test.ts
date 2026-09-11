import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { addPreset, listInstalledPresets } from '../src/services/preset-manager';
import { runDoctor } from '../src/services/health-check';
import { loadConfig } from '../src/services/config-manager';
import { QA_SKILLS_DIR } from '../src/utils/paths';
import { cleanup, createTempProject, exists, listFilesRelative } from './helpers';

/**
 * End-to-end integration test (spec section 69): simulate a fake project and run
 * the full CLI behavior in a temporary directory.
 */
describe('integration: init -> add -> doctor', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('installs a minimal project, adds a preset and reports a healthy install', async () => {
    const initResult = await initProject({
      cwd: projectRoot,
      minimal: true,
      language: 'vi',
      logger: silentLogger,
    });
    expect(initResult.presets).toEqual([]);
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'SKILL.md'))).toBe(true);

    const addResult = await addPreset(projectRoot, 'upload');
    expect(addResult.presets).toContain('upload');

    const config = await loadConfig(projectRoot);
    expect(config.language).toBe('vi');

    const doctor = await runDoctor(projectRoot);
    expect(doctor.healthy).toBe(true);
    expect(doctor.counts.presets).toBe(1);
  });

  it('produces the complete default tree with all presets', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    const qaSkillsDir = path.join(projectRoot, QA_SKILLS_DIR);
    const files = await listFilesRelative(qaSkillsDir);

    // Core files.
    expect(files.filter((file) => file.startsWith('core/')).length).toBe(4);
    // 10 core skills, each a SKILL.md.
    expect(files.filter((file) => /^skills\/.+\/SKILL\.md$/.test(file)).length).toBe(10);
    // 10 presets, 3 output templates.
    expect(files.filter((file) => file.startsWith('presets/')).length).toBe(10);
    expect(files.filter((file) => file.startsWith('templates/')).length).toBe(3);
    expect(files).toContain('custom/README.md');

    const installed = await listInstalledPresets(projectRoot);
    expect(installed.length).toBe(10);
  });
});
