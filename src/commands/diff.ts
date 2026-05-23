import chalk from "chalk";
import { getDiff } from "../utils/git.js";

export async function diff(file?: string): Promise<void> {
  try {
    const output = await getDiff(file);

    if (!output) {
      console.log(chalk.green("No changes since last snapshot."));
      return;
    }

    console.log(
      chalk.cyan(
        `\n🔍 Changes${file ? ` in ${file}` : ""} since last snapshot:\n`,
      ),
    );
    console.log(output);
  } catch {
    console.log(
      chalk.yellow(
        "Could not generate diff. Do you have at least 2 snapshots?",
      ),
    );
  }
}
