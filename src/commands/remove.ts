import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { InstallationError, PresetError } from '../utils/errors.js';
import { pathExists } from '../utils/filesystem.js';
import { QA_SKILLS_DIR, getQaSkillsDir } from '../utils/paths.js';
import { removePreset, type RemovePresetResult } from '../services/preset-manager.js';
import { findProjectRoot } from '../services/project-root.js';
import { confirm } from '../utils/prompt.js';

export interface RemoveCommandOptions {
  cwd?: string;
  yes?: boolean;
  logger?: Logger;
}

/** `qaskill remove <preset>` (spec section 45). */
export async function runRemove(
  preset: string,
  options: RemoveCommandOptions = {},
): Promise<RemovePresetResult> {
  const logger = options.logger ?? defaultLogger;
  const cwd = options.cwd ?? process.cwd();

  const { root: projectRoot } = findProjectRoot(cwd);
  if (!(await pathExists(getQaSkillsDir(projectRoot)))) {
    throw new InstallationError(`${QA_SKILLS_DIR} is not installed in ${projectRoot}.`, [
      'Run "qaskill init" first.',
    ]);
  }

  if (!options.yes) {
    const answer = await confirm(`Remove preset "${preset}"?`);
    if (answer === undefined) {
      throw new PresetError('Non-interactive shell detected.', [
        'Re-run with --yes to remove without prompting.',
      ]);
    }
    if (!answer) {
      throw new PresetError('Removal cancelled.');
    }
  }

  const result = await removePreset(projectRoot, preset);
  logger.success(`Preset "${result.preset}" removed`);
  logger.raw(`  Presets installed: ${result.presets.length}`);
  return result;
}
