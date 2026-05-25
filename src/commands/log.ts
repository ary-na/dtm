import chalk from "chalk";
import { getLog } from "../utils/git.js";
import { printHeader } from "../utils/header.js";

export async function log(): Promise<void> {
  printHeader("Log");
  try {
    const entries = await getLog();

    if (entries.length === 0) {
      console.log(
        chalk.yellow("No snapshots yet. Run dtm snapshot to create one."),
      );
      return;
    }

    entries.forEach((entry, i) => {
      console.log(chalk.gray(`  ${i + 1}.`) + "  " + entry);
    });
    console.log();
  } catch {
    console.log(chalk.yellow("No snapshot history found."));
  }
}
