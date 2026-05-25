import chalk from "chalk";
import { getDiff } from "../utils/git.js";
import { printHeader } from "../utils/header.js";

export async function diff(file?: string): Promise<void> {
  printHeader("Diff");
  try {
    const output = await getDiff(file);

    if (!output) {
      console.log(chalk.green("No changes since last snapshot."));
      return;
    }

    if (file) console.log(chalk.gray(`  in ${file}\n`));
    console.log(output);
  } catch {
    console.log(
      chalk.yellow(
        "Could not generate diff. Do you have at least 2 snapshots?",
      ),
    );
  }
}
