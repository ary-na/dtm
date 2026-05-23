import fs from "fs";
import path from "path";
import { input, select, confirm, checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { DTM_DIR, HOME } from "../utils/paths.js";
import { writeConfig, type WatchedFile } from "../utils/config.js";
import { initRepo, setRemote } from "../utils/git.js";

interface DefaultDotfile {
  name: string;
  path: string;
}

const DEFAULT_DOTFILES: DefaultDotfile[] = [
  { name: "~/.zshrc", path: path.join(HOME, ".zshrc") },
  { name: "~/.gitconfig", path: path.join(HOME, ".gitconfig") },
  { name: "~/.ssh/config", path: path.join(HOME, ".ssh/config") },
  { name: "~/.Brewfile", path: path.join(HOME, ".Brewfile") },
  { name: "~/.bashrc", path: path.join(HOME, ".bashrc") },
];

export async function init(): Promise<void> {
  console.log(chalk.cyan("\n🕰  Dotfile Time Machine — Setup\n"));

  const remote = await input({
    message: "GitHub repo URL (SSH or HTTPS):",
    validate: (value) =>
      value.length > 0 ? true : "Please enter a valid URL",
  });

  const scheduleHours = await select({
    message: "How often should snapshots run?",
    choices: [
      { name: "Every 6 hours", value: 6 },
      { name: "Every 12 hours", value: 12 },
      { name: "Once a day", value: 24 },
      { name: "Once a week", value: 168 },
    ],
    default: 24,
  });

  const autoPush = await confirm({
    message: "Auto-push to GitHub after every snapshot?",
    default: true,
  });

  const availableDotfiles = DEFAULT_DOTFILES.filter((f) =>
    fs.existsSync(f.path)
  );

  const watched = await checkbox({
    message: "Select dotfiles to track:",
    choices: availableDotfiles.map((f) => ({
      name: f.name,
      value: f,
      checked: true,
    })),
  });

  const spinner = ora("Setting up ~/.dtm/").start();

  try {
    fs.mkdirSync(DTM_DIR, { recursive: true });
    await initRepo();
    await setRemote(remote);

    const watchedFiles: WatchedFile[] = (watched as DefaultDotfile[]).map(
      (f) => ({
        name: path.basename(f.path),
        source: f.path,
        stored: path.join(DTM_DIR, path.basename(f.path)),
      })
    );

    writeConfig({
      remote,
      scheduleHours,
      autoPush,
      watched: watchedFiles,
      lastSnapshot: null,
    });

    spinner.succeed(
      chalk.green("Done! Run dtm snapshot to take your first snapshot.")
    );
  } catch (err) {
    spinner.fail(chalk.red("Setup failed"));
    console.error(err);
  }
}
