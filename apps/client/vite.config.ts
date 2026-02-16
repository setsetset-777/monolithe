import type { UserConfig } from "vite";
import path from "path";
import fs from "fs";

const configPath = "../../config";
const clientConfig = JSON.parse(
  fs.readFileSync(path.resolve(configPath, "client.json"), "utf8"),
);

export default {
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, clientConfig.mainFile),
        reset: path.resolve(__dirname, clientConfig.resetFile),
      },
    },
  },
} satisfies UserConfig;
