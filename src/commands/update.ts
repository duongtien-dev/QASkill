import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { getTemplatesDir } from '../utils/paths.js';
import { updateInstallation, type UpdateResult } from '../services/updater.js';

export interface UpdateCommandOptions {
  cwd?: string;
  force?: boolean;
  yes?: boolean;
  dryRun?: boolean;
  templatesDir?: string;
  logger?: Logger;
}

/** `qaskill update` (spec section 46). */
export async function runUpdate(options: UpdateCommandOptions = {}): Promise<UpdateResult> {
  const logger = options.logger ?? defaultLogger;

  const result = await updateInstallation({
    ...(options.cwd !== undefined ? { cwd: options.cwd } : {}),
    force: options.force ?? false,
    yes: options.yes ?? false,
    dryRun: options.dryRun ?? false,
    templatesDir: options.templatesDir ?? getTemplatesDir(),
    logger,
  });

  if (result.dryRun) {
    logger.info(`Dry run — ${result.updatedFiles.length} managed files would be refreshed.`);
    for (const file of result.updatedFiles) {
      logger.raw(`  ${file}`);
    }
    return result;
  }

  logger.success(`Managed files updated to v${result.version}`);
  logger.raw('  config.yml and custom/ were preserved.');
  if (result.backupDir) {
    logger.raw(`  Backup: ${result.backupDir}`);
  }
  return result;
}
