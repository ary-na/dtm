import chalk from "chalk";
import { getLog } from "../utils/git.js";

export async function log(): Promise<void> {
  try {
    const entries = await getLog();

    if (entries.length === 0) {
      console.log(
        chalk.yellow("No snapshots yet. Run dtm --snapshot to create one."),
      );
      return;
    }

    console.log(chalk.cyan("\n🕰  Snapshot History\n"));
    entries.forEach((entry, i) => {
      console.log(chalk.gray(`  ${i + 1}.`) + "  " + entry);
    });
    console.log();
  } catch {
    console.log(chalk.yellow("No snapshot history found."));
  }
}
