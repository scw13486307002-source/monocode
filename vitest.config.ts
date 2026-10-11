import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["src/shared/i18n/testSetup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
