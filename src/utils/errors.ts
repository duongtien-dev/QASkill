/**
 * Errors that are safe and useful to show directly to the CLI user.
 *
 * The CLI must never dump raw stack traces by default (spec section 66),
 * so every expected failure is modelled as a `QaskillError` with a readable
 * message. Unexpected errors are reported with a generic message unless the
 * user passes `--debug`.
 */
export class QaskillError extends Error {
  /** Optional extra lines rendered under the main message (e.g. hints). */
  readonly details: string[];

  constructor(message: string, details: string[] = []) {
    super(message);
    this.name = 'QaskillError';
    this.details = details;
  }
}

export class ConfigError extends QaskillError {
  constructor(message: string, details: string[] = []) {
    super(message, details);
    this.name = 'ConfigError';
  }
}

export class PresetError extends QaskillError {
  constructor(message: string, details: string[] = []) {
    super(message, details);
    this.name = 'PresetError';
  }
}

export class InstallationError extends QaskillError {
  constructor(message: string, details: string[] = []) {
    super(message, details);
    this.name = 'InstallationError';
  }
}

export function isQaskillError(error: unknown): error is QaskillError {
  return error instanceof QaskillError;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
