import { defineConfig } from "tsup";

export default defineConfig({
  platform: "node",
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  bundle: false,
  dts: true,

  external: ["@repo/types"],
});
