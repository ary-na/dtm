import chalk from "chalk";
import { readConfig, writeConfig } from "../utils/config.js";
import { resolvePath } from "../utils/paths.js";

export async function unwatch(filePath: string): Promise<void> {
  const config = readConfig();
  const resolved = resolvePath(filePath);

  const index = config.watched.findIndex((f) => f.source === resolved);

  if (index === -1) {
    console.log(chalk.yellow(`Not currently tracking ${filePath}`));
    return;
  }

  config.watched.splice(index, 1);
  writeConfig(config);

  console.log(chalk.green(`Stopped tracking ${filePath}`));
}
