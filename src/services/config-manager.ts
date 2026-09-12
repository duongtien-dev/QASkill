import path from 'node:path';
import YAML from 'yaml';
import { ConfigError, errorMessage } from '../utils/errors.js';
import { pathExists, readTextFile, writeTextFile } from '../utils/filesystem.js';
import { CONFIG_FILENAME, getQaSkillsDir } from '../utils/paths.js';
import {
    buildDefaultConfig,
    configSchema,
    type Language,
    type QaskillConfig,
} from '../schemas/config.schema.js';

export function getConfigPath(projectRoot: string): string {
    return path.join(getQaSkillsDir(projectRoot), CONFIG_FILENAME);
}

/** Validate a plain object parsed from YAML against the Zod schema. */
export function validateConfig(data: unknown): QaskillConfig {
    const result = configSchema.safeParse(data);
    if (!result.success) {
        const details = result.error.issues.map(
            (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        );
        throw new ConfigError('config.yml is invalid.', details);
    }
    return result.data;
}

/** Parse and validate raw YAML text. */
export function parseConfigString(raw: string): QaskillConfig {
    let parsed: unknown;
    try {
        parsed = YAML.parse(raw);
    } catch (error) {
        throw new ConfigError(`config.yml is not valid YAML: ${errorMessage(error)}`);
    }
    if (parsed === null || typeof parsed !== 'object') {
        throw new ConfigError('config.yml must contain a YAML mapping.');
    }
    return validateConfig(parsed);
}

/** Serialize a config to YAML (never wraps long lines). */
export function serializeConfig(config: QaskillConfig): string {
    return YAML.stringify(config, { lineWidth: 0 });
}

/** Load and validate `.qa-skills/config.yml` from a project. */
export async function loadConfig(projectRoot: string): Promise<QaskillConfig> {
    const configPath = getConfigPath(projectRoot);
    if (!(await pathExists(configPath))) {
        throw new ConfigError(`Missing configuration file: ${configPath}`);
    }
    return parseConfigString(await readTextFile(configPath));
}

/** Write the default config (configurable language) to a project. */
export async function writeDefaultConfig(
    projectRoot: string,
    language: Language = 'en',
): Promise<QaskillConfig> {
    const config = buildDefaultConfig(language);
    await writeTextFile(getConfigPath(projectRoot), serializeConfig(config));
    return config;
}
