import fs from "fs";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { readConfig } from "../utils/config.js";
import { getFileAtCommit } from "../utils/git.js";
import { printHeader } from "../utils/header.js";

export async function restore(fileName: string, nStr: string): Promise<void> {
  printHeader("Restore");
  const n = parseInt(nStr, 10);

  if (isNaN(n) || n < 1) {
    console.log(
      chalk.red(
        "Please provide a valid snapshot number. e.g. dtm restore .zshrc -n 2",
      ),
    );
    return;
  }

  const config = readConfig();
  const file = config.watched.find((f) => f.name === fileName);

  if (!file) {
    console.log(chalk.red(`Not tracking a file named ${fileName}`));
    return;
  }

  try {
    const content = await getFileAtCommit(file.name, n);

    console.log(chalk.gray(`  ${fileName} from ${n} snapshot(s) ago\n`));
    console.log(chalk.gray("─".repeat(50)));
    console.log(content);
    console.log(chalk.gray("─".repeat(50)));

    const confirmed = await confirm({
      message: `Restore ${fileName} to this version?`,
      default: false,
    });

    if (!confirmed) {
      console.log(chalk.yellow("Restore cancelled."));
      return;
    }

    const spinner = ora(`Restoring ${fileName}...`).start();
    fs.writeFileSync(file.source, content);
    spinner.succeed(chalk.green(`${fileName} restored successfully.`));
  } catch {
    console.log(chalk.red(`Could not find ${fileName} at snapshot ${n}.`));
  }
}
