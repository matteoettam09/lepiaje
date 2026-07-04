import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "node",
        setupFiles: ["src/__tests__/setup.ts"],
        include: ["src/**/*.test.ts", "src/**/*.integration.test.ts"],
        testTimeout: 30000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
