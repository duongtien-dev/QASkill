import path from 'node:path';
import type { Logger } from '../utils/logger.js';
import { silentLogger } from '../utils/logger.js';
import { InstallationError } from '../utils/errors.js';
import {
  copyDir,
  ensureDir,
  listEntries,
  pathExists,
  removePath,
  type CopyFilterInfo,
} from '../utils/filesystem.js';
import {
  METADATA_FILENAME,
  QA_SKILLS_DIR,
  getPackageInfo,
  getQaSkillsDir,
  getTemplatesDir,
} from '../utils/paths.js';
import { buildDefaultConfig, type Language, type QaskillConfig } from '../schemas/config.schema.js';
import { writeDefaultConfig } from './config-manager.js';
import { buildMetadata, writeMetadata } from './metadata.js';
import { DEFAULT_PRESETS, listInstalledPresets } from './preset-manager.js';
import { findProjectRoot } from './project-root.js';
import { confirm } from '../utils/prompt.js';

/**
 * Entries QASkill owns inside `.qa-skills` and may replace on install/update.
 * `custom/` is intentionally absent: user content is never overwritten
 * (spec sections 97-99).
 */
export const MANAGED_ENTRIES = [
  'SKILL.md',
  'config.yml',
  METADATA_FILENAME,
  'core',
  'skills',
  'presets',
  'templates',
] as const;

export interface InitOptions {
  cwd?: string;
  force?: boolean;
  yes?: boolean;
  language?: Language;
  /** Install without domain presets (spec section 118). */
  minimal?: boolean;
  /** Preview only; no filesystem writes. */
  dryRun?: boolean;
  /** Override the bundled templates directory (used by tests). */
  templatesDir?: string;
  logger?: Logger;
}

export interface InitResult {
  projectRoot: string;
  rootDetected: boolean;
  rootIndicator?: string;
  qaSkillsDir: string;
  version: string;
  config: QaskillConfig;
  presets: string[];
  overwritten: boolean;
  dryRun: boolean;
  /** Relative paths (from `.qa-skills`) that were created or would be created. */
  files: string[];
}

interface TemplateSelection {
  presets: readonly string[];
  minimal: boolean;
}

function segments(relative: string): string[] {
  return relative.split(path.sep).filter((part) => part.length > 0);
}

/** Decide whether a template path should be copied into the installation. */
function buildTemplateFilter(selection: TemplateSelection) {
  const allowedPresets = new Set(selection.presets);
  return (info: CopyFilterInfo): boolean => {
    const parts = segments(info.relative);
    if (parts.length === 0) {
      return true;
    }
    const first = parts[0];
    if (first === 'config.yml' || first === METADATA_FILENAME) {
      return false;
    }
    if (first === 'presets') {
      if (selection.minimal) {
        return false;
      }
      if (parts.length === 1) {
        // The presets directory itself.
        return true;
      }
      const fileName = parts[parts.length - 1] ?? '';
      return allowedPresets.has(fileName.replace(/\.md$/, ''));
    }
    return true;
  };
}

/** Compute the relative files a template copy would produce. */
async function collectTemplateFiles(
  templatesDir: string,
  selection: TemplateSelection,
): Promise<string[]> {
  const filter = buildTemplateFilter(selection);
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
        files.push(path.join(QA_SKILLS_DIR, relative));
      }
    }
  };
  await walk(templatesDir);
  return files.sort((a, b) => a.localeCompare(b));
}

export { buildTemplateFilter, collectTemplateFiles };

/**
 * `qaskill init` (spec section 42).
 *
 * Detects the project root, protects an existing installation, copies the
 * methodology assets, writes `config.yml` and finally records metadata.
 */
export async function initProject(options: InitOptions = {}): Promise<InitResult> {
  const logger = options.logger ?? silentLogger;
  const templatesDir = options.templatesDir ?? getTemplatesDir();
  const cwd = options.cwd ?? process.cwd();
  const language: Language = options.language ?? 'en';
  const minimal = options.minimal ?? false;
  const dryRun = options.dryRun ?? false;
  const presets = minimal ? [] : [...DEFAULT_PRESETS];
  const version = getPackageInfo().version;

  if (!(await pathExists(templatesDir))) {
    throw new InstallationError(`Bundled templates were not found at ${templatesDir}.`);
  }

  const rootResult = findProjectRoot(cwd);
  const projectRoot = rootResult.root;
  if (!rootResult.found) {
    logger.warning(
      `No project indicator found (package.json, .git, lockfile). Using current directory: ${projectRoot}`,
    );
  }

  const qaSkillsDir = getQaSkillsDir(projectRoot);
  const alreadyExists = await pathExists(qaSkillsDir);
  let overwritten = false;

  if (alreadyExists && !dryRun) {
    if (options.force || options.yes) {
      overwritten = true;
    } else {
      const answer = await confirm(
        `${QA_SKILLS_DIR} already exists in ${projectRoot}. Overwrite the managed files?`,
      );
      if (answer === undefined) {
        throw new InstallationError(`${QA_SKILLS_DIR} already exists.`, [
          'Run with --force to reinstall.',
        ]);
      }
      if (!answer) {
        throw new InstallationError('Installation cancelled.');
      }
      overwritten = true;
    }
  }

  const selection: TemplateSelection = { presets, minimal };

  if (dryRun) {
    const files = await collectTemplateFiles(templatesDir, selection);
    files.push(path.join(QA_SKILLS_DIR, 'config.yml'));
    files.push(path.join(QA_SKILLS_DIR, METADATA_FILENAME));
    return {
      projectRoot,
      rootDetected: rootResult.found,
      ...(rootResult.indicator ? { rootIndicator: rootResult.indicator } : {}),
      qaSkillsDir,
      version,
      config: buildDefaultConfig(language),
      presets: [...presets],
      overwritten: alreadyExists,
      dryRun: true,
      files: files.sort((a, b) => a.localeCompare(b)),
    };
  }

  if (overwritten) {
    for (const entry of MANAGED_ENTRIES) {
      await removePath(path.join(qaSkillsDir, entry));
    }
  }

  await ensureDir(qaSkillsDir);
  await copyDir(templatesDir, qaSkillsDir, { filter: buildTemplateFilter(selection) });

  const config = await writeDefaultConfig(projectRoot, language);
  const installedPresets = await listInstalledPresets(projectRoot);
  await writeMetadata(projectRoot, buildMetadata(version, installedPresets));

  const files = await collectTemplateFiles(templatesDir, selection);
  files.push(path.join(QA_SKILLS_DIR, 'config.yml'));
  files.push(path.join(QA_SKILLS_DIR, METADATA_FILENAME));

  return {
    projectRoot,
    rootDetected: rootResult.found,
    ...(rootResult.indicator ? { rootIndicator: rootResult.indicator } : {}),
    qaSkillsDir,
    version,
    config,
    presets: installedPresets,
    overwritten,
    dryRun: false,
    files: files.sort((a, b) => a.localeCompare(b)),
  };
}

