#!/usr/bin/env node
import { program } from "commander";
import { init } from "./commands/init.js";
import { snapshot } from "./commands/snapshot.js";
import { watch } from "./commands/watch.js";
import { unwatch } from "./commands/unwatch.js";
import { log } from "./commands/log.js";
import { diff } from "./commands/diff.js";
import { restore } from "./commands/restore.js";
import { schedule } from "./commands/schedule.js";
import { status } from "./commands/status.js";
import { reset } from "./commands/reset.js";
import { migrate } from "./commands/migrate.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

program
  .name("dtm")
  .description(
    "🕰  Dotfile Time Machine — automated dotfile snapshots with GitHub backup",
  )
  .version(version);

program.command("init").description("First time setup wizard").action(init);

program.command("snapshot").description("Take a snapshot now").action(snapshot);

program
  .command("watch <path>")
  .description("Start tracking a file")
  .action(watch);

program
  .command("unwatch <path>")
  .description("Stop tracking a file")
  .action(unwatch);

program.command("log").description("Show snapshot history").action(log);

program
  .command("diff [file]")
  .description("Show what changed since last snapshot")
  .action(diff);

program
  .command("restore <file>")
  .description("Restore a file to N snapshots ago")
  .option("-n, --steps <n>", "Number of snapshots to go back", "1")
  .action((file: string, options: { steps: string }) =>
    restore(file, options.steps),
  );

program
  .command("schedule")
  .description("Enable scheduled snapshots")
  .option("--off", "Disable scheduled snapshots")
  .action((options: { off?: boolean }) => schedule(options));

program
  .command("status")
  .description("Show tracked files and last snapshot")
  .action(status);

program
  .command("reset")
  .description("Remove all dtm data and config")
  .action(reset);

program
  .command("migrate")
  .description("Migrate stored files to the mirrored path structure (v1.2.0+)")
  .action(migrate);

program.parse();
