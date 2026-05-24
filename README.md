# 🕰️ dtm

> Dotfile Time Machine. Automatically snapshots your config files and pushes them to a private GitHub repo on a schedule.

[![npm version](https://img.shields.io/npm/v/%40ariian%2Fdtm?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/dtm)
[![npm downloads](https://img.shields.io/npm/dm/%40ariian%2Fdtm?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/dtm)
[![license](https://img.shields.io/npm/l/%40ariian%2Fdtm?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/%40ariian%2Fdtm?color=black&style=flat-square)](https://nodejs.org)

---

DTM came from the frustration of tweaking dotfiles or config files, accidentally breaking things weeks later, and having no idea what changed. The goal was to create something simple that quietly backs up your files to GitHub on a schedule, makes it easy to track changes over time, and lets you roll back any file to a previous version whenever needed.

---

## Install

```bash
npm install -g @ariian/dtm
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

Create a **private** GitHub repo before running `dtm init`.

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

---

## How it works

```
1. you run       →  dtm snapshot
2. dtm copies    →  your tracked dotfiles into ~/.dtm/
3. dtm commits   →  git commit -m "snapshot 2026-05-23 22:00:00"
4. dtm pushes    →  git push origin main
5. done          →  ✔ snapshot saved and pushed to GitHub
```

On a schedule, this runs automatically via macOS launchd.

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

Add any file to your snapshot with `dtm watch <path>`.

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

Scheduling is enabled automatically during `dtm init`. You can disable or re-enable it anytime with the commands above.

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

## License

MIT © Arian Najafi Yamchelo — [arii.dev](https://arii.dev)
