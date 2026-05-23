import fs from "fs";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { DTM_DIR, CONFIG_DIR, PLIST_PATH } from "../utils/paths.js";

export async function reset(): Promise<void> {
  console.log(
    chalk.red("\n⚠️  This will delete your entire snapshot repo and config.\n")
  );

  const confirmed = await confirm({
    message: "Are you sure you want to reset dtm?",
    default: false,
  });

  if (!confirmed) {
    console.log(chalk.yellow("Reset cancelled."));
    return;
  }

  const spinner = ora("Removing dtm data...").start();

  try {
    if (fs.existsSync(DTM_DIR)) {
      fs.rmSync(DTM_DIR, { recursive: true, force: true });
    }

    if (fs.existsSync(CONFIG_DIR)) {
      fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
    }

    if (fs.existsSync(PLIST_PATH)) {
      fs.rmSync(PLIST_PATH);
    }

    spinner.succeed(chalk.green("dtm has been reset."));
    console.log(chalk.gray("\nRun dtm init to set up again."));
    console.log(
      chalk.gray("Run npm uninstall -g dtm to remove the CLI itself.\n")
    );
  } catch (err) {
    spinner.fail(chalk.red("Reset failed."));
    console.error(err);
  }
}
