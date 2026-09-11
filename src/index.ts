#!/usr/bin/env node
import { runCli, reportError } from './cli.js';
import { createLogger } from './utils/logger.js';

async function main(): Promise<void> {
  try {
    await runCli(process.argv);
  } catch (error) {
    const logger = createLogger();
    reportError(error, logger, process.argv.includes('--debug'));
    process.exitCode = 1;
  }
}

void main();
