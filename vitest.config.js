import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    // Scratch/debugging files are never part of the suite. `.worktrees` holds
    // other branches checked out side-by-side - each has its own
    // node_modules/React copy, so picking up its tests here causes duplicate-
    // React "invalid hook call" failures.
    exclude: ["**/node_modules/**", "**/dist/**", "**/scratch/**", "**/.worktrees/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
