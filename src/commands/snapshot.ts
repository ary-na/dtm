import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { readConfig, writeConfig } from "../utils/config.js";
import { commitSnapshot, pushToRemote } from "../utils/git.js";
import { printHeader } from "../utils/header.js";

export async function snapshot(): Promise<void> {
  printHeader("Snapshot");
  const config = readConfig();

  if (config.watched.length === 0) {
    console.log(
      chalk.yellow("No files being tracked. Run dtm watch <file> to add one."),
    );
    return;
  }

  const spinner = ora("Taking snapshot...").start();

  try {
    const skipped: string[] = [];
    for (const file of config.watched) {
      if (fs.existsSync(file.source)) {
        fs.mkdirSync(path.dirname(file.stored), { recursive: true });
        fs.copyFileSync(file.source, file.stored);
      } else {
        skipped.push(file.name);
      }
    }

    const committed = await commitSnapshot();

    if (!committed) {
      spinner.info(chalk.blue("No changes since last snapshot."));
      if (skipped.length > 0)
        console.log(chalk.yellow(`Skipped (not found): ${skipped.join(", ")}`));
      return;
    }

    config.lastSnapshot = new Date().toISOString();
    writeConfig(config);

    if (config.autoPush) {
      spinner.succeed(chalk.green("Snapshot saved locally."));
      if (skipped.length > 0)
        console.log(chalk.yellow(`Skipped (not found): ${skipped.join(", ")}`));
      const pushSpinner = ora("Pushing to GitHub...").start();
      await pushToRemote();
      pushSpinner.succeed(chalk.green("Pushed to GitHub."));
    } else {
      spinner.succeed(chalk.green("Snapshot saved."));
      if (skipped.length > 0)
        console.log(chalk.yellow(`Skipped (not found): ${skipped.join(", ")}`));
    }
  } catch (err) {
    spinner.fail(chalk.red("Snapshot failed"));
    console.error(err);
  }
}
