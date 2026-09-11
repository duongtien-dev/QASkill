import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/** Create a throwaway project (with a package.json) in the OS temp directory. */
export async function createTempProject(prefix = 'qaskill-test-'): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  await fs.writeFile(
    path.join(dir, 'package.json'),
    `${JSON.stringify({ name: 'sample-app', version: '1.0.0', private: true }, null, 2)}\n`,
    'utf8',
  );
  return dir;
}

export async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

export async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readJson<T = unknown>(target: string): Promise<T> {
  return JSON.parse(await fs.readFile(target, 'utf8')) as T;
}

export async function readText(target: string): Promise<string> {
  return fs.readFile(target, 'utf8');
}

/** Sorted, slash-normalized list of files relative to a root directory. */
export async function listFilesRelative(root: string): Promise<string[]> {
  const results: string[] = [];
  const walk = async (current: string): Promise<void> => {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.isFile()) {
        results.push(path.relative(root, absolute).split(path.sep).join('/'));
      }
    }
  };
  await walk(root);
  return results.sort((a, b) => a.localeCompare(b));
}
