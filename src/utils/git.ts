import { simpleGit, type SimpleGit } from "simple-git";
import { execa } from "execa";
import { DTM_DIR } from "./paths.js";

function getGit(): SimpleGit {
  return simpleGit(DTM_DIR, {
    timeout: {
      block: 30000,
    },
  });
}

export async function initRepo(): Promise<void> {
  const git = simpleGit(DTM_DIR, {
    timeout: {
      block: 30000,
    },
  });
  await git.init();
  await git.raw(["checkout", "-b", "main"]);
}

export async function setRemote(url: string): Promise<void> {
  const git = getGit();
  const remotes = await git.getRemotes();
  if (remotes.find((r) => r.name === "origin")) {
    await git.removeRemote("origin");
  }
  await git.addRemote("origin", url);
}

export async function commitSnapshot(): Promise<boolean> {
  const git = getGit();
  const status = await git.status();
  if (status.files.length === 0) return false;
  const date = new Date().toLocaleString("sv").slice(0, 19);
  await git.add(".");
  await git.commit(`snapshot ${date}`);
  return true;
}

export async function pushToRemote(): Promise<void> {
  try {
    await execa("git", ["push", "-u", "origin", "main"], {
      cwd: DTM_DIR,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getLog(): Promise<string[]> {
  const log = await getGit().log();
  return log.all.map((c) => c.message);
}

export async function getDiff(file?: string): Promise<string> {
  if (file) return await getGit().diff(["HEAD~1", "HEAD", "--", file]);
  return await getGit().diff(["HEAD~1", "HEAD"]);
}

export async function getFileAtCommit(
  file: string,
  n: number,
): Promise<string> {
  return await getGit().show([`HEAD~${n}:${file}`]);
}

export async function removeStoredFile(fileName: string): Promise<void> {
  const git = getGit();
  await git.rm([fileName]);
  await git.commit(`unwatch ${fileName}`);
}

export async function moveStoredFile(oldName: string, newName: string): Promise<void> {
  const git = getGit();
  await git.raw(["mv", oldName, newName]);
}

export async function commitMigration(): Promise<void> {
  const git = getGit();
  await git.add(".");
  const status = await git.status();
  if (status.files.length === 0) return;
  await git.commit("migrate to mirrored path structure");
}
