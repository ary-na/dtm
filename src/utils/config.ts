import fs from "fs";
import { CONFIG_PATH, CONFIG_DIR } from "./paths.js";

export interface WatchedFile {
  name: string;
  source: string;
  stored: string;
}

export interface DtmConfig {
  remote: string | null;
  scheduleHours: number;
  autoPush: boolean;
  watched: WatchedFile[];
  lastSnapshot: string | null;
}

const defaults: DtmConfig = {
  remote: null,
  scheduleHours: 24,
  autoPush: true,
  watched: [],
  lastSnapshot: null,
};

export function readConfig(): DtmConfig {
  if (!fs.existsSync(CONFIG_PATH)) return { ...defaults };
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as DtmConfig;
}

export function writeConfig(config: DtmConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
