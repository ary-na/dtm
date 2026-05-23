import os from "os";
import path from "path";

export const HOME: string = os.homedir();
export const DTM_DIR: string = path.join(HOME, ".dtm");
export const CONFIG_DIR: string = path.join(HOME, ".config", "dtm");
export const CONFIG_PATH: string = path.join(CONFIG_DIR, "config.json");
export const PLIST_PATH: string = path.join(
  HOME,
  "Library/LaunchAgents/com.dtm.snapshot.plist",
);

export function resolvePath(filePath: string): string {
  return filePath.startsWith("~")
    ? path.join(HOME, filePath.slice(1))
    : path.resolve(filePath);
}
