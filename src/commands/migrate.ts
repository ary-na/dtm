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

    fs.writeFileSync(
      path.join(DTM_DIR, ".gitignore"),
      [
        "# os",
        ".DS_Store",
        "._*",
        ".Spotlight-V100",
        ".Trashes",
        "",
        "# windows",
        "Thumbs.db",
        "ehthumbs.db",
        "Desktop.ini",
        "",
        "# linux",
        "*~",
        ".fuse_hidden*",
        ".nfs*",
      ].join("\n"),
    );

    fs.writeFileSync(
      path.join(DTM_DIR, "README.md"),
      [
        "# 🕰️ dotfiles",
        "",
        "My dotfile snapshots",
        "",
        "## Commands",
        "",
        "```bash",
        "dtm init                        # first time setup wizard",
        "dtm snapshot                    # take a snapshot now",
        "dtm log                         # show full snapshot history",
        "dtm watch <path>                # start tracking a new file",
        "dtm unwatch <path>              # stop tracking a file",
        "dtm diff                        # what changed since last snapshot",
        "dtm diff <file>                 # what changed in one specific file",
        "dtm restore <file>              # restore a file to 1 snapshot ago",
        "dtm restore <file> -n 5         # restore a file to 5 snapshots ago",
        "dtm schedule                    # enable automatic snapshots",
        "dtm schedule --off              # disable automatic snapshots",
        "dtm status                      # show tracked files and last snapshot",
        "dtm migrate                     # migrate file structure to latest format",
        "dtm reset                       # remove all dtm data and config",
        "```",
        "",
        "---",
        "",
        "Made with [dtm](https://www.npmjs.com/package/@ariian/dtm) · [arii.dev](https://arii.dev)",
      ].join("\n"),
    );

    await commitMigration();
    writeConfig(config);

    spinner.succeed(chalk.green("Migration complete. You're on the new file structure.\n"));
  } catch (err) {
    spinner.fail(chalk.red("Migration failed."));
    console.error(err);
  }
}
