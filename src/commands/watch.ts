import fs from "fs";
import path from "path";
import chalk from "chalk";
import { readConfig, writeConfig } from "../utils/config.js";
import { resolvePath, DTM_DIR } from "../utils/paths.js";

export async function watch(filePath: string): Promise<void> {
  const config = readConfig();
  const resolved = resolvePath(filePath);

  if (!fs.existsSync(resolved)) {
    console.log(chalk.red(`File not found: ${resolved}`));
    return;
  }

  const alreadyWatched = config.watched.find((f) => f.source === resolved);
  if (alreadyWatched) {
    console.log(chalk.yellow(`Already tracking ${filePath}`));
    return;
  }

  const name = path.basename(resolved);
  const stored = path.join(DTM_DIR, name);

  config.watched.push({ name, source: resolved, stored });
  writeConfig(config);

  console.log(chalk.green(`Now tracking ${filePath}`));
}
