import path from 'node:path';
import type { Logger } from '../utils/logger.js';
import { silentLogger } from '../utils/logger.js';
import { InstallationError } from '../utils/errors.js';
import {
  copyDir,
  ensureDir,
  listEntries,
  pathExists,
  type CopyFilterInfo,
} from '../utils/filesystem.js';
import {
  METADATA_FILENAME,
  QA_SKILLS_DIR,
  getPackageInfo,
  getQaSkillsDir,
  getTemplatesDir,
} from '../utils/paths.js';
import { readMetadata, writeMetadata } from './metadata.js';
import { listInstalledPresets } from './preset-manager.js';
import { findProjectRoot } from './project-root.js';
import { confirm } from '../utils/prompt.js';

/**
 * `qaskill update` (spec section 46).
 *
 * Refreshes the managed standard files to the current package version while:
 *   - creating a timestamped backup,
 *   - preserving `config.yml`,
 *   - preserving `.qa-skills/custom/`.
 */
export interface UpdateOptions {
  cwd?: string;
  /** Refresh without prompting. */
  force?: boolean;
  /** Answer prompts with "yes" (non-interactive). */
  yes?: boolean;
  dryRun?: boolean;
  templatesDir?: string;
  logger?: Logger;
}

export interface UpdateResult {
  projectRoot: string;
  backupDir?: string;
  updatedFiles: string[];
  version: string;
  dryRun: boolean;
}

/** `qaskill-backup-YYYYMMDD-HHmmss` in the project root. */
export function backupDirectoryName(date = new Date()): string {
  const pad = (value: number, size = 2): string => String(value).padStart(size, '0');
  const stamp =
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  return `${QA_SKILLS_DIR}-backup-${stamp}`;
}

function buildUpdateFilter(installedPresets: readonly string[]) {
  const allowed = new Set(installedPresets);
  return (info: CopyFilterInfo): boolean => {
    const parts = info.relative.split(path.sep).filter((part) => part.length > 0);
    const first = parts[0];
    if (parts.length === 0) {
      return true;
    }
    // Never touch user content or the user's configuration.
    if (first === 'custom' || first === 'config.yml' || first === METADATA_FILENAME) {
      return false;
    }
    if (first === 'presets') {
      if (parts.length === 1) {
        return true;
      }
      const fileName = parts[parts.length - 1] ?? '';
      return allowed.has(fileName.replace(/\.md$/, ''));
    }
    return true;
  };
}

export async function updateInstallation(options: UpdateOptions = {}): Promise<UpdateResult> {
  const logger = options.logger ?? silentLogger;
  const templatesDir = options.templatesDir ?? getTemplatesDir();
  const cwd = options.cwd ?? process.cwd();
  const dryRun = options.dryRun ?? false;
  const version = getPackageInfo().version;

  const { root: projectRoot } = findProjectRoot(cwd);
  const qaSkillsDir = getQaSkillsDir(projectRoot);

  if (!(await pathExists(qaSkillsDir))) {
    throw new InstallationError(`${QA_SKILLS_DIR} is not installed in ${projectRoot}.`, [
      'Run "qaskill init" first.',
    ]);
  }
  if (!(await pathExists(templatesDir))) {
    throw new InstallationError(`Bundled templates were not found at ${templatesDir}.`);
  }

  const metadata = await readMetadata(projectRoot);
  const installedPresets = await listInstalledPresets(projectRoot);
  const files = await collectManagedFiles(templatesDir, installedPresets);

  if (dryRun) {
    return { projectRoot, updatedFiles: files, version, dryRun: true };
  }

  if (!options.force && !options.yes) {
    const answer = await confirm(
      `Update managed QASkill files to v${version} and create a backup first?`,
    );
    if (answer === undefined) {
      logger.warning('Non-interactive shell detected. Re-run with --force to update.');
      throw new InstallationError('Update cancelled. Run with --force to proceed.');
    }
    if (!answer) {
      throw new InstallationError('Update cancelled.');
    }
  }

  const backupDir = path.join(projectRoot, backupDirectoryName());
  await ensureDir(backupDir);
  await copyDir(qaSkillsDir, backupDir);
  logger.info(`Backup created: ${path.relative(projectRoot, backupDir)}`);

  await copyDir(templatesDir, qaSkillsDir, { filter: buildUpdateFilter(installedPresets) });

  if (metadata) {
    metadata.version = version;
    metadata.presets = installedPresets;
    await writeMetadata(projectRoot, metadata);
  }

  return { projectRoot, backupDir, updatedFiles: files, version, dryRun: false };
}

async function collectManagedFiles(
  templatesDir: string,
  installedPresets: readonly string[],
): Promise<string[]> {
  const filter = buildUpdateFilter(installedPresets);
  const files: string[] = [];
  const walk = async (current: string): Promise<void> => {
    for (const entry of await listEntries(current)) {
      const absolute = path.join(current, entry.name);
      const relative = path.relative(templatesDir, absolute);
      const keep = filter({
        source: absolute,
        relative,
        isDirectory: entry.isDirectory,
        isFile: entry.isFile,
      });
      if (!keep) {
        continue;
      }
      if (entry.isDirectory) {
        await walk(absolute);
      } else if (entry.isFile) {
        files.push(relative);
      }
    }
  };
  await walk(templatesDir);
  return files.sort((a, b) => a.localeCompare(b));
}
