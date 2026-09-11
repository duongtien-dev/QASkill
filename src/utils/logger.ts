import chalk, { Chalk } from 'chalk';

/**
 * Minimal logger utility (spec section 113). Intentionally tiny: success,
 * info, warning and error. Tests construct a silent logger so they never
 * pollute the test output.
 */
export interface Logger {
  success(message: string): void;
  info(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  /** Print a line with no decoration (used for tables / instructions). */
  raw(message: string): void;
}

export interface LoggerOptions {
  /** When true every method becomes a no-op. */
  silent?: boolean;
  /** Disable colors (used when the output is not a TTY). */
  noColor?: boolean;
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const silent = options.silent ?? false;
  const chalkInstance = options.noColor ? new Chalk({ level: 0 }) : chalk;

  const write = (text: string): void => {
    if (!silent) {
      process.stdout.write(`${text}\n`);
    }
  };
  const writeError = (text: string): void => {
    if (!silent) {
      process.stderr.write(`${text}\n`);
    }
  };

  return {
    success: (message) => write(`${chalkInstance.green('✓')} ${message}`),
    info: (message) => write(`${chalkInstance.cyan('•')} ${message}`),
    warning: (message) => write(`${chalkInstance.yellow('⚠')} ${message}`),
    error: (message) => writeError(`${chalkInstance.red('Error:')} ${message}`),
    raw: (message) => write(message),
  };
}

/** Shared default logger. */
export const logger: Logger = createLogger();

/** Logger that discards everything, useful for programmatic/test usage. */
export const silentLogger: Logger = createLogger({ silent: true });
