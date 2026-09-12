import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { InstallationError } from '../utils/errors.js';
import { isLanguage, type Language } from '../schemas/config.schema.js';
import { initProject, type InitResult } from '../services/installer.js';

export interface InitCommandOptions {
    cwd?: string;
    force?: boolean;
    yes?: boolean;
    language?: string;
    minimal?: boolean;
    dryRun?: boolean;
    templatesDir?: string;
    logger?: Logger;
}

function resolveLanguage(value: string | undefined): Language {
    const language = value ?? 'en';
    if (!isLanguage(language)) {
        throw new InstallationError(`Unsupported language "${language}".`, [
            'Supported values: en, vi',
        ]);
    }
    return language;
}

function printInstructions(result: InitResult, logger: Logger): void {
    logger.raw('');
    logger.raw('QASkill installed.');
    logger.raw('');
    logger.raw('AI prompt:');
    logger.raw('Use QASkill for this UI.');
    logger.raw('Read `.qa-skills/SKILL.md`.');
    logger.raw('');
}

/** `qaskill init` (spec sections 42, 67). */
export async function runInit(options: InitCommandOptions = {}): Promise<InitResult> {
    const logger = options.logger ?? defaultLogger;
    const language = resolveLanguage(options.language);

    const result = await initProject({
        ...(options.cwd !== undefined ? { cwd: options.cwd } : {}),
        force: options.force ?? false,
        yes: options.yes ?? false,
        language,
        minimal: options.minimal ?? false,
        dryRun: options.dryRun ?? false,
        ...(options.templatesDir !== undefined ? { templatesDir: options.templatesDir } : {}),
        logger,
    });

    logger.raw('');
    logger.raw('QASkill');
    logger.raw('');

    if (result.dryRun) {
        logger.info(`Dry run — no files were written (${result.files.length} files).`);
    }

    if (result.rootDetected) {
        logger.success(`Project root detected (${result.rootIndicator})`);
    } else {
        logger.warning('Project root not detected, using current directory');
    }

    logger.success(
        result.overwritten
            ? 'Existing installation refreshed'
            : 'Installation directory created',
    );
    logger.success('Master skill installed');
    logger.success('Core QA skills installed');
    if (result.presets.length > 0) {
        logger.success(`${result.presets.length} presets installed`);
    } else {
        logger.info('Minimal install — no presets installed (use "qaskill add <preset>")');
    }
    logger.success(`Config created (version 2, language: ${result.config.language})`);

    logger.raw('');
    logger.raw(`Location: ${result.qaSkillsDir}`);
    if (result.dryRun) {
        logger.raw('');
        logger.raw('Files that would be created:');
        for (const file of result.files) {
            logger.raw(`  ${file}`);
        }
        return result;
    }

    printInstructions(result, logger);
    return result;
}
