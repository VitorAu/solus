import { defineConfig } from "tsup";

export default defineConfig({
  platform: "node",
  entry: ["src/main.ts"],
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
  clean: true,
  bundle: true,

  external: [
    "@repo/types",
    "@repo/interfaces",
    "@repo/database",
    "@repo/typescript",
  ],
});
