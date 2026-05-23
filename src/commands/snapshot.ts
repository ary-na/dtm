import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import { readConfig, writeConfig } from "../utils/config.js";
import { commitSnapshot, pushToRemote } from "../utils/git.js";

export async function snapshot(): Promise<void> {
  const config = readConfig();

  if (config.watched.length === 0) {
    console.log(
      chalk.yellow(
        "No files being tracked. Run dtm --watch <file> to add one.",
      ),
    );
    return;
  }

  const spinner = ora("Taking snapshot...").start();

  try {
    for (const file of config.watched) {
      if (fs.existsSync(file.source)) {
        fs.copyFileSync(file.source, file.stored);
      } else {
        console.warn(
          chalk.yellow(`\nSkipping ${file.name} — not found at ${file.source}`),
        );
      }
    }

    const committed = await commitSnapshot();

    if (!committed) {
      spinner.info(chalk.blue("No changes since last snapshot."));
      return;
    }

    if (config.autoPush) {
      spinner.text = "Pushing to GitHub...";
      await pushToRemote();
    }

    config.lastSnapshot = new Date().toISOString();
    writeConfig(config);

    spinner.succeed(
      chalk.green(
        `Snapshot saved${config.autoPush ? " and pushed to GitHub" : ""}`,
      ),
    );
  } catch (err) {
    spinner.fail(chalk.red("Snapshot failed"));
    console.error(err);
  }
}
