import fs from 'node:fs/promises';
import path from 'node:path';

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function readTextFile(target: string): Promise<string> {
  return fs.readFile(target, 'utf8');
}

export async function writeTextFile(target: string, content: string): Promise<void> {
  await ensureDir(path.dirname(target));
  await fs.writeFile(target, content, 'utf8');
}

export async function removePath(target: string): Promise<void> {
  await fs.rm(target, { recursive: true, force: true });
}

/** Copy a single file, creating the destination directory when required. */
export async function copyFile(source: string, destination: string): Promise<void> {
  await ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
}

/** Move a path (file or directory), creating parent directories as needed. */
export async function movePath(source: string, destination: string): Promise<void> {
  await ensureDir(path.dirname(destination));
  await fs.rename(source, destination);
}

export interface CopyFilterInfo {
  /** Absolute source path being considered. */
  source: string;
  /** Path relative to the copy root, using the current OS separator. */
  relative: string;
  isDirectory: boolean;
  isFile: boolean;
}

export type CopyFilter = (info: CopyFilterInfo) => boolean;

export interface CopyDirOptions {
  /** Return false to skip a file or directory. */
  filter?: CopyFilter;
}

/**
 * Recursively copy a directory. Cross-platform (uses path.join only) and
 * never follows symlinks into directories to avoid surprise traversals.
 */
export async function copyDir(
  source: string,
  destination: string,
  options: CopyDirOptions = {},
): Promise<void> {
  const sourceRoot = path.resolve(source);
  await ensureDir(destination);
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    const relative = path.relative(sourceRoot, sourcePath);
    const isDirectory = entry.isDirectory();
    const isFile = entry.isFile();

    if (options.filter && !options.filter({ source: sourcePath, relative, isDirectory, isFile })) {
      continue;
    }
    if (isDirectory) {
      await copyDir(sourcePath, destinationPath, options);
    } else if (isFile) {
      await ensureDir(path.dirname(destinationPath));
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

/** List regular files (optionally recursive) as absolute paths. */
export async function listFiles(dir: string, recursive = false): Promise<string[]> {
  const result: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) {
        result.push(...(await listFiles(full, true)));
      }
    } else if (entry.isFile()) {
      result.push(full);
    }
  }
  return result;
}

export interface DirEntry {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
}

/** List direct children of a directory, or an empty array if it is missing. */
export async function listEntries(dir: string): Promise<DirEntry[]> {
  if (!(await pathExists(dir))) {
    return [];
  }
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
  }));
}

/** Return base file names (without extension) of `*.md` files in a directory. */
export async function listMarkdownNames(dir: string): Promise<string[]> {
  const entries = await listEntries(dir);
  return entries
    .filter((entry) => entry.isFile && entry.name.endsWith('.md'))
    .map((entry) => entry.name.slice(0, -'.md'.length))
    .sort((a, b) => a.localeCompare(b));
}
