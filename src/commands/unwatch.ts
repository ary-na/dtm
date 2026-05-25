import fs from "fs";
import chalk from "chalk";
import { readConfig, writeConfig } from "../utils/config.js";
import { resolvePath } from "../utils/paths.js";
import { printHeader } from "../utils/header.js";
import { removeStoredFile } from "../utils/git.js";

export async function unwatch(filePath: string): Promise<void> {
  printHeader("Unwatch");
  const config = readConfig();
  const resolved = resolvePath(filePath);

  const file = config.watched.find((f) => f.source === resolved);

  if (!file) {
    console.log(chalk.yellow(`Not currently tracking ${filePath}`));
    return;
  }

  config.watched = config.watched.filter((f) => f.source !== resolved);
  writeConfig(config);

  try {
    await removeStoredFile(file.name);
  } catch {
    // never snapshotted — remove from disk if it exists
    if (fs.existsSync(file.stored)) fs.rmSync(file.stored);
  }

  console.log(chalk.green(`Stopped tracking ${filePath}`));
}
