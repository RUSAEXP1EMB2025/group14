import esbuild from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";

const entryPoint = "./src/main.ts";
const outfile = "./dist/main.js";

esbuild
  .build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: outfile,
    format: "iife",
    globalName: "gasGlobal",
    plugins: [GasPlugin],
    minify: true,
    platform: "browser",
  })
  .then(() => console.log("✨ esbuild: Build successful!"))
  .catch((e) => {
    console.error("❌ esbuild: Build failed:", e);
    process.exit(1);
  });
