# 🕰️ dtm
> Dotfile Time Machine. Automatically snapshots your config files and pushes them to a private GitHub repo on a schedule.

[![npm version](https://img.shields.io/npm/v/dtm?color=black&style=flat-square)](https://www.npmjs.com/package/dtm)
[![npm downloads](https://img.shields.io/npm/dm/dtm?color=black&style=flat-square)](https://www.npmjs.com/package/dtm)
[![license](https://img.shields.io/npm/l/dtm?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/dtm?color=black&style=flat-square)](https://nodejs.org)

---

I built dtm because I kept tweaking my `.zshrc`, breaking something weeks later, and having no idea what I changed. I wanted something that quietly backs up my dotfiles to GitHub on a schedule, with a simple way to see what changed and roll back any file to any point in time.

---

## Install

```bash
npm install -g dtm
```

---

## Setup

```bash
dtm init
```

You'll be prompted for:

```
? GitHub repo URL (SSH or HTTPS): git@github.com:you/dotfiles-backup.git
? How often should snapshots run? Once a day
? Auto-push to GitHub after every snapshot? Yes
? Select dotfiles to track: ~/.zshrc, ~/.gitconfig
```

Create a **private** GitHub repo before running `dtm init` — your dotfiles may contain API keys, SSH config, and other sensitive data.

---

## GitHub Connection

### SSH (recommended)

Use an SSH URL when prompted:

```
git@github.com:you/dotfiles-backup.git
```

Make sure your SSH key is added to your macOS Keychain so pushes work silently in the background:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Test it:

```bash
ssh -T git@github.com
# Hi you! You've successfully authenticated.
```

### HTTPS

Use an HTTPS URL when prompted:

```
https://github.com/you/dotfiles-backup.git
```

Store your GitHub Personal Access Token in macOS Keychain:

```bash
git config --global credential.helper osxkeychain
```

Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens) with `repo` scope. Git will pick it up automatically on first push.

---

## How it works

```
1. you run       →  dtm snapshot
2. dtm copies    →  your tracked dotfiles into ~/.dtm/
3. dtm commits   →  git commit -m "snapshot 2026-05-23T14:00:00Z"
4. dtm pushes    →  git push origin main
5. done          →  ✔ snapshot saved and pushed to GitHub
```

On a schedule, this runs automatically via macOS launchd — no process running in the background, just a lightweight job that wakes up, runs for a few seconds, and goes back to sleep.

---

## Commands

### Setup

```bash
dtm init                        # first time setup wizard
dtm status                      # show tracked files, last snapshot, schedule
```

### Snapshots

```bash
dtm snapshot                    # take a snapshot now
dtm log                         # show full snapshot history
```

### File Tracking

```bash
dtm watch ~/.npmrc              # start tracking a new file
dtm watch ~/Library/Application\ Support/Code/User/settings.json
dtm unwatch ~/.vimrc            # stop tracking a file
```

### Diffing

```bash
dtm diff                        # what changed since last snapshot
dtm diff .zshrc                 # what changed in one specific file
```

### Restoring

```bash
dtm restore .zshrc              # restore .zshrc to 1 snapshot ago (default)
dtm restore .zshrc -n 5        # restore .zshrc to 5 snapshots ago
```

### Scheduling

```bash
dtm schedule                    # enable automatic snapshots via launchd
dtm schedule --off              # disable automatic snapshots
```

### Reset

```bash
dtm reset                       # remove all dtm data and config
```

---

## Node flags

```bash
dtm --version                   # print version number
dtm --help                      # show all commands
```

---

## File locations

```
~/.dtm/                         # git snapshot repo
~/.config/dtm/config.json       # dtm config file
~/Library/LaunchAgents/
  com.dtm.snapshot.plist        # launchd scheduler (after dtm schedule)
```

---

## Defaults tracked on init

dtm will detect and offer to track any of these that exist on your machine:

- `~/.zshrc`
- `~/.gitconfig`
- `~/.ssh/config`
- `~/.Brewfile`
- `~/.bashrc`

Add anything else with `dtm watch <path>`.

---

## Requirements

- Node.js `>=18`
- macOS (launchd scheduler)
- A private GitHub repo

---

## License

MIT © [arii.dev](https://arii.dev)
