import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { addPreset, listInstalledPresets } from '../src/services/preset-manager';
import { readMetadata } from '../src/services/metadata';
import { QA_SKILLS_DIR } from '../src/utils/paths';
import { cleanup, createTempProject, exists } from './helpers';

describe('qaskill add', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
    // Minimal install: no presets, so `add` has something to do.
    await initProject({ cwd: projectRoot, minimal: true, logger: silentLogger });
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('adds a known preset', async () => {
    const result = await addPreset(projectRoot, 'login');
    expect(result.preset).toBe('login');
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'presets', 'login.md'))).toBe(true);
  });

  it('does not duplicate an installed preset', async () => {
    await addPreset(projectRoot, 'login');
    await expect(addPreset(projectRoot, 'login')).rejects.toThrow(/already installed/);
  });

  it('rejects an unknown preset', async () => {
    await expect(addPreset(projectRoot, 'payments')).rejects.toThrow(/was not found/);
  });

  it('rejects an invalid preset name', async () => {
    await expect(addPreset(projectRoot, 'Invalid Name')).rejects.toThrow(/Invalid preset name/);
  });

  it('updates metadata after adding', async () => {
    await addPreset(projectRoot, 'table');
    const metadata = await readMetadata(projectRoot);
    expect(metadata?.presets).toContain('table');
  });

  it('keeps the installed list sorted and unique', async () => {
    await addPreset(projectRoot, 'upload');
    await addPreset(projectRoot, 'crud');
    const installed = await listInstalledPresets(projectRoot);
    expect(installed).toEqual([...installed].sort((a, b) => a.localeCompare(b)));
    expect(new Set(installed).size).toBe(installed.length);
  });
});
