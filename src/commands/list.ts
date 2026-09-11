import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { pathExists } from '../utils/filesystem.js';
import { QA_SKILLS_DIR, getPackageInfo, getQaSkillsDir, getTemplatesDir } from '../utils/paths.js';
import {
  CORE_SKILLS,
  listAvailablePresets,
  listInstalledPresets,
} from '../services/preset-manager.js';
import { findProjectRoot } from '../services/project-root.js';
import { readMetadata } from '../services/metadata.js';

export interface ListCommandOptions {
  cwd?: string;
  templatesDir?: string;
  logger?: Logger;
}

export interface ListResult {
  version: string;
  installed: boolean;
  coreSkills: { name: string; installed: boolean }[];
  presets: { name: string; installed: boolean }[];
}

/** `qaskill list` (spec section 43). */
export async function runList(options: ListCommandOptions = {}): Promise<ListResult> {
  const logger = options.logger ?? defaultLogger;
  const cwd = options.cwd ?? process.cwd();
  const templatesDir = options.templatesDir ?? getTemplatesDir();
  const { version } = getPackageInfo();

  const { root: projectRoot } = findProjectRoot(cwd);
  const qaSkillsDir = getQaSkillsDir(projectRoot);
  const installed = await pathExists(qaSkillsDir);

  logger.raw(`QASkill ${version}`);
  logger.raw('');

  if (!installed) {
    logger.warning(`${QA_SKILLS_DIR} is not installed here.`);
    logger.raw('Run "qaskill init" to install it.');
    logger.raw('');

    const available = await listAvailablePresets(templatesDir);
    logger.raw('Core skills (available)');
    for (const skill of CORE_SKILLS) {
      logger.raw(`  ○ ${skill}`);
    }
    logger.raw('');
    logger.raw('Presets (available)');
    for (const preset of available) {
      logger.raw(`  ○ ${preset}`);
    }
    return {
      version,
      installed: false,
      coreSkills: CORE_SKILLS.map((name) => ({ name, installed: false })),
      presets: available.map((name) => ({ name, installed: false })),
    };
  }

  const installedPresets = await listInstalledPresets(projectRoot);
  const availablePresets = await listAvailablePresets(templatesDir);
  const metadata = await readMetadata(projectRoot);

  const coreSkills = CORE_SKILLS.map((name) => ({
    name,
    installed: true,
  }));

  logger.raw('Core skills');
  for (const skill of coreSkills) {
    logger.raw(`  ${skill.installed ? '✓' : '○'} ${skill.name}`);
  }
  logger.raw('');

  logger.raw('Presets');
  const presetNames = Array.from(new Set([...installedPresets, ...availablePresets])).sort((a, b) =>
    a.localeCompare(b),
  );
  const presets = presetNames.map((name) => ({
    name,
    installed: installedPresets.includes(name),
  }));
  for (const preset of presets) {
    logger.raw(`  ${preset.installed ? '✓' : '○'} ${preset.name}`);
  }
  logger.raw('');

  if (metadata) {
    const installedAt = metadata.installedAt ? ` (installed ${metadata.installedAt})` : '';
    logger.raw(`Metadata version: ${metadata.version}${installedAt}`);
  } else {
    logger.warning('Metadata file .qaskill.json is missing.');
  }

  return { version, installed, coreSkills, presets };
}
