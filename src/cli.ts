import { Command } from 'commander';
import { createLogger, logger as defaultLogger, type Logger } from './utils/logger.js';
import { isQaskillError, errorMessage } from './utils/errors.js';
import { getPackageInfo } from './utils/paths.js';
import { runInit } from './commands/init.js';
import { runList } from './commands/list.js';
import { runAdd } from './commands/add.js';
import { runRemove } from './commands/remove.js';
import { runUpdate } from './commands/update.js';
import { runDoctor } from './commands/doctor.js';
import { runVersion } from './commands/version.js';

export interface CliDependencies {
    logger?: Logger;
    debug?: boolean;
}

/** Report an error the way the spec requires (readable, no stack by default). */
export function reportError(error: unknown, logger: Logger, debug: boolean): void {
    if (isQaskillError(error)) {
        logger.error(error.message);
        for (const detail of error.details) {
            logger.raw(`  ${detail}`);
        }
        if (debug) {
            logger.raw(`  ${error.stack ?? ''}`);
        }
        return;
    }
    logger.error('Unexpected error.');
    if (debug && error instanceof Error) {
        logger.raw(`  ${error.stack ?? error.message}`);
    } else if (error instanceof Error) {
        logger.raw(`  ${errorMessage(error)}`);
    }
    logger.raw('  Re-run with --debug for more details.');
}

async function guard(action: () => Promise<void>, logger: Logger, debug: boolean): Promise<void> {
    try {
        await action();
    } catch (error) {
        reportError(error, logger, debug);
        process.exitCode = 1;
    }
}

export function buildProgram(deps: CliDependencies = {}): Command {
    const logger = deps.logger ?? defaultLogger;
    const { version } = getPackageInfo();

    const program = new Command();
    program
        .name('qaskill')
        .description('Install and manage AI Manual QA skills for developers.')
        .usage('[command]')
        .version(version, '-v, --version', 'Show QASkill version')
        .showSuggestionAfterError()
        .showHelpAfterError();

    program
        .command('init')
        .description('Install QASkill into the current project')
        .option('-f, --force', 'Reinstall even if .qa-skills already exists')
        .option('-l, --language <lang>', 'Output language for generated test cases (en|vi)', 'en')
        .option('-m, --minimal', 'Install core skills without domain presets')
        .option('-y, --yes', 'Answer prompts with yes (non-interactive)')
        .option('--dry-run', 'Show the files that would be created without writing them')
        .option('--debug', 'Show detailed errors')
        .action(async (options: Record<string, unknown>) => {
            await guard(
                async () => {
                    await runInit({
                        force: Boolean(options.force),
                        yes: Boolean(options.yes),
                        minimal: Boolean(options.minimal),
                        dryRun: Boolean(options.dryRun),
                        language: typeof options.language === 'string' ? options.language : 'en',
                        logger,
                    });
                },
                logger,
                Boolean(options.debug),
            );
        });

    program
        .command('list')
        .description('Show installed skills and presets')
        .option('--debug', 'Show detailed errors')
        .action(async (options: Record<string, unknown>) => {
            await guard(async () => void (await runList({ logger })), logger, Boolean(options.debug));
        });

    program
        .command('add')
        .argument('<preset>', 'Preset to add (e.g. login, table, pagination)')
        .description('Add a QA preset')
        .option('--debug', 'Show detailed errors')
        .action(async (preset: string, options: Record<string, unknown>) => {
            await guard(
                async () => void (await runAdd(preset, { logger })),
                logger,
                Boolean(options.debug),
            );
        });

    program
        .command('remove')
        .argument('<preset>', 'Preset to remove')
        .description('Remove a QA preset')
        .option('-y, --yes', 'Confirm removal without prompting')
        .option('--debug', 'Show detailed errors')
        .action(async (preset: string, options: Record<string, unknown>) => {
            await guard(
                async () =>
                    void (await runRemove(preset, { yes: Boolean(options.yes), logger })),
                logger,
                Boolean(options.debug),
            );
        });

    program
        .command('update')
        .description('Update managed QA skill files to the current version')
        .option('-f, --force', 'Update without prompting (still creates a backup)')
        .option('-y, --yes', 'Answer prompts with yes (non-interactive)')
        .option('--dry-run', 'Show the files that would be refreshed')
        .option('--debug', 'Show detailed errors')
        .action(async (options: Record<string, unknown>) => {
            await guard(
                async () => {
                    await runUpdate({
                        force: Boolean(options.force),
                        yes: Boolean(options.yes),
                        dryRun: Boolean(options.dryRun),
                        logger,
                    });
                },
                logger,
                Boolean(options.debug),
            );
        });

    program
        .command('doctor')
        .description('Validate the installation')
        .option('--debug', 'Show detailed errors')
        .action(async (options: Record<string, unknown>) => {
            await guard(async () => void (await runDoctor({ logger })), logger, Boolean(options.debug));
        });

    program
        .command('version')
        .description('Show QASkill version')
        .action(async () => {
            await guard(async () => void runVersion(logger), logger, deps.debug ?? false);
        });

    return program;
}

/** Parse and execute CLI arguments. */
export async function runCli(argv: string[] = process.argv): Promise<void> {
    const debug = argv.includes('--debug');
    const logger = createLogger();
    const program = buildProgram({ logger, debug });

    // `qaskill` with no command: print help instead of doing nothing.
    if (argv.length <= 2) {
        program.outputHelp();
        return;
    }

    // Unknown commands are rejected by commander with exit code 1 (spec section 115).
    await program.parseAsync(argv);
}
