import fs from "fs";
import path from "path";

const configPath = process.env.CONFIG_PATH || "../../config";

export default {
  client: JSON.parse(
    fs.readFileSync(path.resolve(configPath, "client.json"), "utf8"),
  ),
};
