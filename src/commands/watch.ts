import fs from "fs";
import path from "path";
import chalk from "chalk";
import { readConfig, writeConfig } from "../utils/config.js";
import { resolvePath, DTM_DIR, storedRelPath } from "../utils/paths.js";
import { printHeader } from "../utils/header.js";

export async function watch(filePath: string): Promise<void> {
  printHeader("Watch");
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

  const rel = storedRelPath(resolved);
  const name = rel;
  const stored = path.join(DTM_DIR, rel);

  config.watched.push({ name, source: resolved, stored });
  writeConfig(config);

  console.log(chalk.green(`Now tracking ${filePath}`));
}
