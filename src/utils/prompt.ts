import readline from 'node:readline/promises';

/**
 * Interactive confirmation helper (spec section 114).
 *
 * - Uses interactive confirmation only when a TTY is available.
 * - Non-interactive callers should pass `--yes` / `--force`; otherwise the
 *   caller must treat `undefined` as "cannot prompt" and abort safely so CI
 *   never hangs waiting for input.
 */
export interface ConfirmOptions {
    /** Assume yes/true without prompting (CI / `--yes`). */
    assumeYes?: boolean;
    /** Assume no/false without prompting. */
    assumeNo?: boolean;
}

export async function confirm(
    question: string,
    options: ConfirmOptions = {},
): Promise<boolean | undefined> {
    if (options.assumeYes) {
        return true;
    }
    if (options.assumeNo) {
        return false;
    }
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        return undefined;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
        const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
        return answer === 'y' || answer === 'yes';
    } finally {
        rl.close();
    }
}
