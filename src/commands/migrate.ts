import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { readConfig, writeConfig } from "../utils/config.js";
import { DTM_DIR, storedRelPath } from "../utils/paths.js";
import { printHeader } from "../utils/header.js";
import { moveStoredFile, commitMigration } from "../utils/git.js";

export async function migrate(): Promise<void> {
  printHeader("Migrate");

  const config = readConfig();

  const toMove = config.watched.filter((f) => f.name !== storedRelPath(f.source));

  if (toMove.length === 0) {
    console.log(chalk.green("Already on the new file structure. Nothing to migrate.\n"));
    return;
  }

  console.log(chalk.cyan(`Found ${toMove.length} file(s) to migrate:\n`));
  toMove.forEach((f) => {
    const newRel = storedRelPath(f.source);
    console.log(`  ${chalk.gray(f.name)} → ${chalk.cyan(newRel)}`);
  });
  console.log();

  const spinner = ora("Migrating...").start();

  try {
    for (const file of config.watched) {
      const newRel = storedRelPath(file.source);
      if (file.name === newRel) continue;

      const newStored = path.join(DTM_DIR, newRel);
      fs.mkdirSync(path.dirname(newStored), { recursive: true });

      if (fs.existsSync(file.stored)) {
        try {
          await moveStoredFile(file.name, newRel);
        } catch {
          // not yet committed to git — move on disk only
          fs.renameSync(file.stored, newStored);
        }
      }

      file.name = newRel;
      file.stored = newStored;
    }

    await commitMigration();
    writeConfig(config);

    spinner.succeed(chalk.green("Migration complete. You're on the new file structure.\n"));
  } catch (err) {
    spinner.fail(chalk.red("Migration failed."));
    console.error(err);
  }
}
