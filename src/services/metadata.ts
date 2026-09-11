import path from 'node:path';
import { InstallationError } from '../utils/errors.js';
import { pathExists, readTextFile, writeTextFile } from '../utils/filesystem.js';
import { METADATA_FILENAME, QA_SKILLS_DIR, getQaSkillsDir } from '../utils/paths.js';

/**
 * `.qa-skills/.qaskill.json` metadata (spec section 53).
 *
 * Used by `list`, `update` and `doctor` to know what QASkill installed and when.
 */
export interface QaskillMetadata {
  version: string;
  installedAt: string;
  managedDirectory: string;
  presets: string[];
}

export function getMetadataPath(projectRoot: string): string {
  return path.join(getQaSkillsDir(projectRoot), METADATA_FILENAME);
}

export function buildMetadata(version: string, presets: string[]): QaskillMetadata {
  return {
    version,
    installedAt: new Date().toISOString(),
    managedDirectory: QA_SKILLS_DIR,
    presets: [...presets],
  };
}

export async function readMetadata(projectRoot: string): Promise<QaskillMetadata | undefined> {
  const metadataPath = getMetadataPath(projectRoot);
  if (!(await pathExists(metadataPath))) {
    return undefined;
  }
  const raw = await readTextFile(metadataPath);
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new InstallationError('Installation metadata is not valid JSON.', [metadataPath]);
  }
  if (parsed === null || typeof parsed !== 'object') {
    throw new InstallationError('Installation metadata is malformed.', [metadataPath]);
  }
  const record = parsed as Partial<QaskillMetadata>;
  return {
    version: typeof record.version === 'string' ? record.version : '0.0.0',
    installedAt: typeof record.installedAt === 'string' ? record.installedAt : '',
    managedDirectory:
      typeof record.managedDirectory === 'string' ? record.managedDirectory : QA_SKILLS_DIR,
    presets: Array.isArray(record.presets)
      ? record.presets.filter((value): value is string => typeof value === 'string')
      : [],
  };
}

export async function writeMetadata(
  projectRoot: string,
  metadata: QaskillMetadata,
): Promise<void> {
  const metadataPath = getMetadataPath(projectRoot);
  await writeTextFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
}
