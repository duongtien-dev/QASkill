import path from 'node:path';
import { PresetError } from '../utils/errors.js';
import { copyFile, listMarkdownNames, pathExists, removePath } from '../utils/filesystem.js';
import { getQaSkillsDir, getTemplatesDir } from '../utils/paths.js';
import { readMetadata, writeMetadata } from './metadata.js';

/**
 * Preset management (spec sections 22-32, 44, 45, 54).
 *
 * Presets live in `.qa-skills/presets/<name>.md`. Core skills under
 * `.qa-skills/skills/` can never be removed by `qaskill remove`.
 */
export const CORE_SKILLS = [
    'ui-analysis',
    'functional-testing',
    'form-validation',
    'boundary-value',
    'negative-testing',
    'interaction-testing',
    'state-testing',
    'responsive-testing',
    'accessibility-testing',
    'testcase-review',
] as const;

/** Built-in presets shipped with the package (spec section 54). */
export const ALL_PRESETS = [
    'login',
    'form',
    'crud',
    'table',
    'search',
    'filter',
    'pagination',
    'modal',
    'upload',
    'navigation',
] as const;

/** Presets installed by a default `qaskill init`. */
export const DEFAULT_PRESETS = [...ALL_PRESETS];

export type PresetName = (typeof ALL_PRESETS)[number];

export function isCoreSkill(name: string): boolean {
    return (CORE_SKILLS as readonly string[]).includes(name);
}

export function getPresetsDir(projectRoot: string): string {
    return path.join(getQaSkillsDir(projectRoot), 'presets');
}

export function getPresetPath(projectRoot: string, name: string): string {
    return path.join(getPresetsDir(projectRoot), `${name}.md`);
}

/** Presets currently present in `.qa-skills/presets/`. */
export async function listInstalledPresets(projectRoot: string): Promise<string[]> {
    return listMarkdownNames(getPresetsDir(projectRoot));
}

/** Presets bundled with this package version (source of truth). */
export async function listAvailablePresets(templatesDir = getTemplatesDir()): Promise<string[]> {
    const found = await listMarkdownNames(path.join(templatesDir, 'presets'));
    if (found.length > 0) {
        return found;
    }
    return [...ALL_PRESETS];
}

export async function isPresetInstalled(projectRoot: string, name: string): Promise<boolean> {
    return pathExists(getPresetPath(projectRoot, name));
}

export function validatePresetName(name: string): void {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
        throw new PresetError(`Invalid preset name: "${name}".`, [
            'Preset names must be lowercase letters, digits or dashes.',
        ]);
    }
}

export interface AddPresetResult {
    preset: string;
    presets: string[];
}

export interface AddPresetOptions {
    templatesDir?: string;
}

/** Add a preset, refusing to duplicate an existing one. */
export async function addPreset(
    projectRoot: string,
    name: string,
    options: AddPresetOptions = {},
): Promise<AddPresetResult> {
    validatePresetName(name);
    const templatesDir = options.templatesDir ?? getTemplatesDir();
    const available = await listAvailablePresets(templatesDir);

    if (isCoreSkill(name)) {
        throw new PresetError(`"${name}" is a core skill and is always installed.`);
    }
    if (!available.includes(name)) {
        throw new PresetError(`Preset "${name}" was not found.`, [
            'Available presets:',
            ...available,
        ]);
    }
    if (await isPresetInstalled(projectRoot, name)) {
        throw new PresetError(`Preset "${name}" is already installed.`);
    }

    const source = path.join(templatesDir, 'presets', `${name}.md`);
    await copyFile(source, getPresetPath(projectRoot, name));
    const installed = await listInstalledPresets(projectRoot);
    await syncMetadataPresets(projectRoot, installed);
    return { preset: name, presets: installed };
}

export interface RemovePresetResult {
    preset: string;
    presets: string[];
}

/** Remove an installed preset. Core skills cannot be removed. */
export async function removePreset(
    projectRoot: string,
    name: string,
): Promise<RemovePresetResult> {
    validatePresetName(name);
    if (isCoreSkill(name)) {
        throw new PresetError(`"${name}" is a core skill and cannot be removed.`, [
            'Only optional presets may be removed with this command.',
        ]);
    }
    const presetPath = getPresetPath(projectRoot, name);
    if (!(await pathExists(presetPath))) {
        throw new PresetError(`Preset "${name}" is not installed.`);
    }
    await removePath(presetPath);
    const installed = await listInstalledPresets(projectRoot);
    await syncMetadataPresets(projectRoot, installed);
    return { preset: name, presets: installed };
}

/** Keep the metadata preset list aligned with what is on disk. */
export async function syncMetadataPresets(
    projectRoot: string,
    installed: string[],
): Promise<void> {
    const metadata = await readMetadata(projectRoot);
    if (!metadata) {
        return;
    }
    metadata.presets = [...installed];
    await writeMetadata(projectRoot, metadata);
}
