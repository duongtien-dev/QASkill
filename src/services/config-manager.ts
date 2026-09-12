import path from 'node:path';
import YAML from 'yaml';
import { ConfigError, errorMessage } from '../utils/errors.js';
import { pathExists, readTextFile, writeTextFile } from '../utils/filesystem.js';
import { CONFIG_FILENAME, getQaSkillsDir } from '../utils/paths.js';
import {
    buildDefaultConfig,
    configSchema,
    migrateConfigV1ToV2,
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

/**
 * Decide whether a parsed config needs migration from version 1.
 *
 * A version 2 file is always kept as-is. A version 1 (or unversioned legacy)
 * file is upgraded in memory so existing installations keep working.
 */
export function needsMigration(parsed: unknown): boolean {
    if (parsed === null || typeof parsed !== 'object') {
        return false;
    }
    const version = (parsed as { version?: unknown }).version;
    if (version === 2) {
        return false;
    }
    return version === 1 || version === undefined;
}

/** Parse and validate raw YAML text, migrating version 1 configs in memory. */
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
    const data = needsMigration(parsed) ? migrateConfigV1ToV2(parsed) : parsed;
    return validateConfig(data);
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

/**
 * Migrate an on-disk version 1 `config.yml` to version 2 (spec section 56).
 *
 * Returns `false` when the file is already version 2 or missing. The caller is
 * responsible for creating a backup before calling this (spec section 57).
 */
export async function migrateConfigFile(projectRoot: string): Promise<boolean> {
    const configPath = getConfigPath(projectRoot);
    if (!(await pathExists(configPath))) {
        return false;
    }
    let parsed: unknown;
    try {
        parsed = YAML.parse(await readTextFile(configPath));
    } catch (error) {
        throw new ConfigError(`config.yml is not valid YAML: ${errorMessage(error)}`);
    }
    if (!needsMigration(parsed)) {
        return false;
    }
    const migrated = validateConfig(migrateConfigV1ToV2(parsed));
    await writeTextFile(configPath, serializeConfig(migrated));
    return true;
}
