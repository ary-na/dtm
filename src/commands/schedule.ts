import fs from "fs";
import { execa } from "execa";
import chalk from "chalk";
import { PLIST_PATH } from "../utils/paths.js";
import { readConfig } from "../utils/config.js";
import { fileURLToPath } from "url";
import path from "path";

export async function schedule(options: { off?: boolean } = {}): Promise<void> {
  if (options.off) {
    try {
      await execa("launchctl", ["unload", PLIST_PATH]);
      fs.unlinkSync(PLIST_PATH);
      console.log(chalk.yellow("Scheduler disabled."));
    } catch {
      console.log(chalk.red("Could not disable scheduler. Is it running?"));
    }
    return;
  }

  const config = readConfig();
  const intervalSeconds = config.scheduleHours * 60 * 60;
  const nodePath = process.execPath;
  const scriptPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../index.js",
  );

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.dtm.snapshot</string>
  <key>ProgramArguments</key>
  <array>
    <string>${nodePath}</string>
    <string>${scriptPath}</string>
    <string>--snapshot</string>
  </array>
  <key>StartInterval</key>
  <integer>${intervalSeconds}</integer>
  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>`;

  try {
    fs.writeFileSync(PLIST_PATH, plist);
    await execa("launchctl", ["load", PLIST_PATH]);
    console.log(
      chalk.green(
        `Scheduler enabled — running every ${config.scheduleHours} hours.`,
      ),
    );
  } catch {
    console.log(chalk.red("Could not enable scheduler."));
  }
}
