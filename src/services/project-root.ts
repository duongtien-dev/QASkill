import fs from 'node:fs';
import path from 'node:path';

/**
 * Project root detection (spec section 51).
 *
 * Walk upward from the start directory until one of the known indicators is
 * found. A `package.json` is preferred over every other indicator, so we keep
 * that as an immediate win and continue walking for the other markers only
 * until we find one (used as a fallback).
 */
export const ROOT_INDICATORS = [
    'package.json',
    '.git',
    'pnpm-workspace.yaml',
    'yarn.lock',
    'package-lock.json',
] as const;

const PRIMARY_INDICATOR = 'package.json';

export interface ProjectRootResult {
    /** Directory treated as the project root. */
    root: string;
    /** Whether a real indicator was found (false means fallback to cwd). */
    found: boolean;
    /** The file/directory that identified the root, when found. */
    indicator?: string;
}

export function findProjectRoot(startDir: string): ProjectRootResult {
    const origin = path.resolve(startDir);
    let current = origin;
    let fallback: ProjectRootResult | undefined;

    // Walk upward until a project indicator is found (or the filesystem root).
    while (true) {
        if (fs.existsSync(path.join(current, PRIMARY_INDICATOR))) {
            return { root: current, found: true, indicator: PRIMARY_INDICATOR };
        }

        if (!fallback) {
            const indicator = ROOT_INDICATORS.find(
                (candidate) =>
                    candidate !== PRIMARY_INDICATOR && fs.existsSync(path.join(current, candidate)),
            );
            if (indicator) {
                fallback = { root: current, found: true, indicator };
            }
        }

        const parent = path.dirname(current);
        if (parent === current) {
            break;
        }
        current = parent;
    }

    if (fallback) {
        return fallback;
    }
    return { root: origin, found: false };
}
