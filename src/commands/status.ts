import fs from "fs";
import chalk from "chalk";
import { readConfig } from "../utils/config.js";
import { printHeader } from "../utils/header.js";

export async function status(): Promise<void> {
  printHeader("Status");
  const config = readConfig();

  console.log(chalk.bold("Remote:"), config.remote ?? chalk.gray("not set"));

  console.log(
    chalk.bold("Schedule:"),
    config.scheduleHours === 0
      ? chalk.yellow("not enabled — run dtm schedule")
      : `every ${config.scheduleHours} hours`,
  );

  console.log(
    chalk.bold("Auto-push:"),
    config.autoPush ? chalk.green("on") : chalk.red("off"),
  );

  console.log(
    chalk.bold("Last snapshot:"),
    config.lastSnapshot
      ? new Date(config.lastSnapshot).toLocaleString()
      : chalk.gray("never"),
  );

  console.log(chalk.bold("\nTracked files:"));

  if (config.watched.length === 0) {
    console.log(chalk.gray("  No files tracked yet. Run dtm watch <file>"));
  } else {
    config.watched.forEach((f) => {
      const exists = fs.existsSync(f.source);
      const icon = exists ? chalk.green("✔") : chalk.red("✘");
      console.log(`  ${icon}  ${f.name} → ${f.source}`);
    });
  }

  console.log();
}
