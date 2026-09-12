import type { Logger } from '../utils/logger.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { getPackageInfo } from '../utils/paths.js';

/** `qaskill version` (spec section 41). */
export function runVersion(logger: Logger = defaultLogger): string {
    const { version } = getPackageInfo();
    logger.raw(`QASkill ${version}`);
    return version;
}
