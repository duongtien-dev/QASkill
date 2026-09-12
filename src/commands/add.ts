import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { InstallationError } from '../utils/errors.js';
import { pathExists } from '../utils/filesystem.js';
import { QA_SKILLS_DIR, getQaSkillsDir, getTemplatesDir } from '../utils/paths.js';
import { addPreset, type AddPresetResult } from '../services/preset-manager.js';
import { findProjectRoot } from '../services/project-root.js';

export interface AddCommandOptions {
    cwd?: string;
    templatesDir?: string;
    logger?: Logger;
}

/** `qaskill add <preset>` (spec section 44). */
export async function runAdd(
    preset: string,
    options: AddCommandOptions = {},
): Promise<AddPresetResult> {
    const logger = options.logger ?? defaultLogger;
    const cwd = options.cwd ?? process.cwd();
    const templatesDir = options.templatesDir ?? getTemplatesDir();

    const { root: projectRoot } = findProjectRoot(cwd);
    if (!(await pathExists(getQaSkillsDir(projectRoot)))) {
        throw new InstallationError(`${QA_SKILLS_DIR} is not installed in ${projectRoot}.`, [
            'Run "qaskill init" first.',
        ]);
    }

    // `addPreset` already reports the available presets when a name is unknown.
    const result = await addPreset(projectRoot, preset, { templatesDir });
    logger.success(`Preset "${result.preset}" added`);
    logger.raw(`  Presets installed: ${result.presets.length}`);
    return result;
}
