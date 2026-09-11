import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { runDoctor as runDoctorService, type DoctorResult } from '../services/health-check.js';
import { findProjectRoot } from '../services/project-root.js';

export interface DoctorCommandOptions {
  cwd?: string;
  logger?: Logger;
}

/** `qaskill doctor` (spec section 47). */
export async function runDoctor(options: DoctorCommandOptions = {}): Promise<DoctorResult> {
  const logger = options.logger ?? defaultLogger;
  const cwd = options.cwd ?? process.cwd();
  const { root: projectRoot } = findProjectRoot(cwd);

  const result = await runDoctorService(projectRoot);

  logger.raw('QASkill Doctor');
  logger.raw('');
  for (const check of result.checks) {
    if (check.ok) {
      logger.success(check.detail ? `${check.name} — ${check.detail}` : check.name);
    } else {
      const suffix = check.detail ? ` — ${check.detail}` : '';
      logger.raw(`  ✗ ${check.name}${suffix}`);
    }
  }
  logger.raw('');

  if (result.healthy) {
    logger.raw('Installation looks healthy.');
  } else {
    logger.error('Installation has problems. See the failing checks above.');
  }

  return result;
}
