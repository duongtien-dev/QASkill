import path from 'node:path';
import { ConfigError, errorMessage, isQaskillError } from '../utils/errors.js';
import { pathExists, readTextFile } from '../utils/filesystem.js';
import {
    CONFIG_FILENAME,
    MASTER_SKILL_FILENAME,
    QA_SKILLS_DIR,
    getPackageInfo,
    getQaSkillsDir,
} from '../utils/paths.js';
import { loadConfig } from './config-manager.js';
import { readMetadata } from './metadata.js';
import { CORE_SKILLS, listInstalledPresets } from './preset-manager.js';

/**
 * `qaskill doctor` (spec section 47).
 *
 * Every check is independent so a broken install reports all problems at once.
 */
export interface DoctorCheck {
    name: string;
    ok: boolean;
    /** Human readable detail shown next to the check. */
    detail?: string;
}

export interface DoctorResult {
    healthy: boolean;
    projectRoot: string;
    checks: DoctorCheck[];
    counts: {
        coreSkills: number;
        presets: number;
    };
}

export const OUTPUT_TEMPLATES = [
    'testcase-markdown.md',
    'testcase-compact.md',
    'coverage-report.md',
];

export async function runDoctor(projectRoot: string): Promise<DoctorResult> {
    const qaSkillsDir = getQaSkillsDir(projectRoot);
    const checks: DoctorCheck[] = [];
    let coreSkillCount = 0;

    // 1. Managed directory exists.
    const dirExists = await pathExists(qaSkillsDir);
    checks.push({
        name: `${QA_SKILLS_DIR} exists`,
        ok: dirExists,
        ...(dirExists ? {} : { detail: 'Run "qaskill init" first.' }),
    });

    if (!dirExists) {
        return {
            healthy: false,
            projectRoot,
            checks,
            counts: { coreSkills: 0, presets: 0 },
        };
    }

    // 2. Master skill.
    const masterPath = path.join(qaSkillsDir, MASTER_SKILL_FILENAME);
    const masterExists = await pathExists(masterPath);
    checks.push({ name: 'Master skill', ok: masterExists, ...(masterExists ? {} : { detail: masterPath }) });

    // 3. Config.
    const configPath = path.join(qaSkillsDir, CONFIG_FILENAME);
    let configOk = false;
    let configDetail: string | undefined;
    if (!(await pathExists(configPath))) {
        configDetail = `Missing ${configPath}`;
    } else {
        try {
            await loadConfig(projectRoot);
            configOk = true;
        } catch (error) {
            configDetail = isQaskillError(error) ? error.message : errorMessage(error);
            if (error instanceof ConfigError && error.details.length > 0) {
                configDetail = `${configDetail} (${error.details.join('; ')})`;
            }
        }
    }
    checks.push({ name: 'Config', ok: configOk, ...(configDetail ? { detail: configDetail } : {}) });

    // 4. Core skills.
    const missingSkills: string[] = [];
    for (const skill of CORE_SKILLS) {
        const skillPath = path.join(qaSkillsDir, 'skills', skill, MASTER_SKILL_FILENAME);
        if (await pathExists(skillPath)) {
            coreSkillCount += 1;
        } else {
            missingSkills.push(skill);
        }
    }
    checks.push({
        name: `${CORE_SKILLS.length} core skills`,
        ok: missingSkills.length === 0,
        ...(missingSkills.length === 0
            ? {}
            : { detail: `Missing: ${missingSkills.join(', ')}` }),
    });

    // 5. Output templates.
    const missingTemplates: string[] = [];
    for (const template of OUTPUT_TEMPLATES) {
        if (!(await pathExists(path.join(qaSkillsDir, 'templates', template)))) {
            missingTemplates.push(template);
        }
    }
    checks.push({
        name: 'Output templates',
        ok: missingTemplates.length === 0,
        ...(missingTemplates.length === 0
            ? {}
            : { detail: `Missing: ${missingTemplates.join(', ')}` }),
    });

    // 6. Installed presets (validate each file is non-empty).
    const installedPresets = await listInstalledPresets(projectRoot);
    const invalidPresets: string[] = [];
    for (const preset of installedPresets) {
        const raw = await readTextFile(path.join(qaSkillsDir, 'presets', `${preset}.md`));
        if (raw.trim().length === 0) {
            invalidPresets.push(preset);
        }
    }
    checks.push({
        name: `${installedPresets.length} presets`,
        ok: invalidPresets.length === 0,
        ...(invalidPresets.length === 0
            ? {}
            : { detail: `Empty preset files: ${invalidPresets.join(', ')}` }),
    });

    // 7. Metadata and version alignment.
    let metadataOk = true;
    let metadataDetail: string | undefined;
    try {
        const metadata = await readMetadata(projectRoot);
        if (!metadata) {
            metadataOk = false;
            metadataDetail = 'Missing .qaskill.json';
        } else {
            const currentVersion = getPackageInfo().version;
            if (metadata.version !== currentVersion) {
                metadataDetail = `Installed v${metadata.version}, package v${currentVersion}. Run "qaskill update".`;
            }
        }
    } catch (error) {
        metadataOk = false;
        metadataDetail = errorMessage(error);
    }
    checks.push({
        name: 'Version metadata',
        ok: metadataOk,
        ...(metadataDetail ? { detail: metadataDetail } : {}),
    });

    return {
        healthy: checks.every((check) => check.ok),
        projectRoot,
        checks,
        counts: { coreSkills: coreSkillCount, presets: installedPresets.length },
    };
}
