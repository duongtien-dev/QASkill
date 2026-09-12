import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Managed directory created inside the user's project. */
export const QA_SKILLS_DIR = '.qa-skills';
/** Installation metadata file inside the managed directory. */
export const METADATA_FILENAME = '.qaskill.json';
/** File name of the master skill. */
export const MASTER_SKILL_FILENAME = 'SKILL.md';
/** Config file name inside the managed directory. */
export const CONFIG_FILENAME = 'config.yml';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the package root safely (spec section 112).
 *
 * Runtime never assumes the current working directory is the package
 * directory. `import.meta.url` points at either:
 *   - `dist/utils/paths.js` after `tsc` build, or
 *   - `src/utils/paths.ts` when run through `tsx`.
 * Both are two levels below the package root.
 */
export function getPackageRoot(): string {
    return path.resolve(currentDir, '..', '..');
}

/** Absolute path of the bundled `templates/.qa-skills` directory. */
export function getTemplatesDir(): string {
    return path.join(getPackageRoot(), 'templates', QA_SKILLS_DIR);
}

/** Absolute path of the managed directory for a given project root. */
export function getQaSkillsDir(projectRoot: string): string {
    return path.join(projectRoot, QA_SKILLS_DIR);
}

export interface PackageInfo {
    name: string;
    version: string;
}

/** Read name/version from the adjacent package.json at runtime. */
export function getPackageInfo(): PackageInfo {
    const packageJsonPath = path.join(getPackageRoot(), 'package.json');
    try {
        const raw = fs.readFileSync(packageJsonPath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<PackageInfo>;
        return {
            name: parsed.name ?? 'qaskill',
            version: parsed.version ?? '0.0.0',
        };
    } catch {
        return { name: 'qaskill', version: '0.0.0' };
    }
}
