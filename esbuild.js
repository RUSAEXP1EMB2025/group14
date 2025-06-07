import esbuild from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";

const entryPoint = "./src/main.ts";
const outfile = "./dist/main.js";

esbuild
  .build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    outfile: outfile,
    plugins: [GasPlugin],
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
