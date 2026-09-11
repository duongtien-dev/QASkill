import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { runList } from '../src/commands/list';
import { removePreset } from '../src/services/preset-manager';
import { cleanup, createTempProject } from './helpers';

describe('qaskill list', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('reports a non-installed project with all presets available', async () => {
    const result = await runList({ cwd: projectRoot, logger: silentLogger });
    expect(result.installed).toBe(false);
    expect(result.presets.length).toBeGreaterThanOrEqual(10);
    expect(result.presets.every((preset) => preset.installed === false)).toBe(true);
  });

  it('shows installed core skills and presets after init', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    const result = await runList({ cwd: projectRoot, logger: silentLogger });
    expect(result.installed).toBe(true);
    expect(result.coreSkills.length).toBe(10);
    expect(result.coreSkills.every((skill) => skill.installed)).toBe(true);
    const login = result.presets.find((preset) => preset.name === 'login');
    expect(login?.installed).toBe(true);
  });

  it('reflects a removed preset as not installed', async () => {
    await initProject({ cwd: projectRoot, logger: silentLogger });
    await removePreset(projectRoot, 'upload');
    const result = await runList({ cwd: projectRoot, logger: silentLogger });
    const upload = result.presets.find((preset) => preset.name === 'upload');
    expect(upload?.installed).toBe(false);
  });
});
