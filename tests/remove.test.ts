import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import { silentLogger } from '../src/utils/logger';
import { initProject } from '../src/services/installer';
import { removePreset } from '../src/services/preset-manager';
import { readMetadata } from '../src/services/metadata';
import { QA_SKILLS_DIR } from '../src/utils/paths';
import { cleanup, createTempProject, exists } from './helpers';

describe('qaskill remove', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await createTempProject();
    await initProject({ cwd: projectRoot, logger: silentLogger });
  });

  afterEach(async () => {
    await cleanup(projectRoot);
  });

  it('removes an installed preset', async () => {
    const result = await removePreset(projectRoot, 'upload');
    expect(result.preset).toBe('upload');
    expect(await exists(path.join(projectRoot, QA_SKILLS_DIR, 'presets', 'upload.md'))).toBe(false);
  });

  it('updates metadata after removing', async () => {
    await removePreset(projectRoot, 'upload');
    const metadata = await readMetadata(projectRoot);
    expect(metadata?.presets).not.toContain('upload');
  });

  it('cannot remove a core skill', async () => {
    await expect(removePreset(projectRoot, 'ui-analysis')).rejects.toThrow(/core skill/);
    expect(
      await exists(path.join(projectRoot, QA_SKILLS_DIR, 'skills', 'ui-analysis', 'SKILL.md')),
    ).toBe(true);
  });

  it('errors when the preset is not installed', async () => {
    await removePreset(projectRoot, 'upload');
    await expect(removePreset(projectRoot, 'upload')).rejects.toThrow(/not installed/);
  });
});
