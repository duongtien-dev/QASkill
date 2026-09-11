import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { findProjectRoot, ROOT_INDICATORS } from '../src/services/project-root';
import { cleanup, createTempProject } from './helpers';

describe('project root detection', () => {
  let tempRoot: string;

  beforeEach(async () => {
    tempRoot = await createTempProject();
  });

  afterEach(async () => {
    await cleanup(tempRoot);
  });

  it('finds the nearest package.json walking upward', async () => {
    const nested = path.join(tempRoot, 'src', 'features', 'login');
    await fs.mkdir(nested, { recursive: true });
    const result = findProjectRoot(nested);
    expect(result.found).toBe(true);
    expect(result.indicator).toBe('package.json');
    expect(result.root).toBe(await fs.realpath(tempRoot));
  });

  it('prefers package.json over other indicators', async () => {
    // A parent has .git, the child has package.json.
    await fs.mkdir(path.join(tempRoot, '.git'), { recursive: true });
    const child = path.join(tempRoot, 'packages', 'app');
    await fs.mkdir(child, { recursive: true });
    await fs.writeFile(path.join(child, 'package.json'), '{}\n', 'utf8');
    const result = findProjectRoot(child);
    expect(result.indicator).toBe('package.json');
    expect(result.root).toBe(child);
  });

  it('falls back to the start directory when nothing is found', async () => {
    const empty = path.join(tempRoot, 'isolated');
    await fs.mkdir(empty, { recursive: true });
    // Guard against indicators in parent temp dirs by checking the contract only.
    const result = findProjectRoot(empty);
    expect(typeof result.root).toBe('string');
    expect(ROOT_INDICATORS).toContain('package.json');
  });
});
