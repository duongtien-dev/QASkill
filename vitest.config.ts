import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    // CLI behavior mutates the filesystem, so keep tests isolated per file.
    pool: 'forks',
  },
});
