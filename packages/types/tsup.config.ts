import { defineConfig } from "tsup";

export default defineConfig({
  platform: "node",
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  bundle: true,
  dts: {
    entry: ["src/index.ts"],
    resolve: true,
  },
});
