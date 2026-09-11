import { describe, expect, it } from 'vitest';
import { buildProgram, reportError } from '../src/cli';
import { silentLogger, type Logger } from '../src/utils/logger';
import { PresetError } from '../src/utils/errors';

function captureLogger(): { logger: Logger; lines: string[] } {
  const lines: string[] = [];
  const logger: Logger = {
    success: (message) => lines.push(message),
    info: (message) => lines.push(message),
    warning: (message) => lines.push(message),
    error: (message) => lines.push(message),
    raw: (message) => lines.push(message),
  };
  return { logger, lines };
}

describe('cli program', () => {
  it('exposes every required command', () => {
    const program = buildProgram({ logger: silentLogger });
    const names = program.commands.map((command) => command.name());
    for (const expected of ['init', 'list', 'add', 'remove', 'update', 'doctor', 'version']) {
      expect(names, `missing command ${expected}`).toContain(expected);
    }
  });

  it('reports QASkill errors with details and no stack trace', () => {
    const { logger, lines } = captureLogger();
    reportError(
      new PresetError('Preset "payments" was not found.', ['Available presets:', 'login', 'form']),
      logger,
      false,
    );
    expect(lines[0]).toContain('Preset "payments" was not found.');
    const trimmed = lines.map((line) => line.trim());
    expect(trimmed).toContain('Available presets:');
    expect(trimmed).toContain('login');
    expect(lines.join('\n')).not.toMatch(/\n\s+at /);
  });

  it('gives a readable message for unexpected errors', () => {
    const { logger, lines } = captureLogger();
    reportError(new Error('boom'), logger, false);
    expect(lines[0]).toContain('Unexpected error.');
    expect(lines.join('\n')).toContain('boom');
  });
});
