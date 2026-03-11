<p align="center">
  <img src="icons/undoclosetab-48.png" width="80" alt="Undo Close Tab icon">
</p>

# 🔄 Undo Close Tab for Chromium

> **One-click restore for accidentally closed tabs.**  
> A Chromium port of the beloved Firefox extension — for Brave, Chrome, Opera, Edge, and any Chromium-based browser.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Chromium](https://img.shields.io/badge/Chromium-compatible-green)](https://www.chromium.org/)
[![Brave](https://img.shields.io/badge/Brave-ready-orange)](https://brave.com/)
[![Chrome](https://img.shields.io/badge/Chrome-ready-blue)](https://www.google.com/chrome/)
[![Opera](https://img.shields.io/badge/Opera-ready-red)](https://www.opera.com/)

---

## ✨ What it does

| Feature | Description |
|--------|--------------|
| **🖱️ Left-click** | Opens a popup with **Restore last closed tab** and a list of recently closed tabs. |
| **🖱️ Right-click** | Context menu with the same list — pick any tab to restore. |
| **📋 Up to 25 tabs** | See and restore from the last 25 closed tabs (configurable). |
| **⚙️ Options** | Filter by current window, tab groups, and where the menu appears. |

No account, no sync, no telemetry — just restore your tabs.

---

## 📦 Install (unpacked / developer mode)

Works the same in all Chromium-based browsers. **Developer mode** must be on so you can load an unpacked extension.

### 1. Get the extension

**Option A — From GitHub (recommended)**  
- Click the green **Code** button → **Download ZIP**.  
- Unzip somewhere (e.g. `Downloads/undoclosetab-brave`).

**Option B — Clone**

```bash
git clone https://github.com/YOUR_USERNAME/undoclosetab-brave.git
cd undoclosetab-brave
```

Replace `YOUR_USERNAME` with the repo owner (e.g. your GitHub username).

---

### 2. Load it in your browser

Use the folder that contains `manifest.json` (the repo root).

| Browser | Extensions page | Steps |
|---------|------------------|--------|
| **Brave** | `brave://extensions` | 1. Turn **Developer mode** on (top-right).<br>2. Click **Load unpacked**.<br>3. Select the `undoclosetab-brave` folder. |
| **Chrome** | `chrome://extensions` | Same as above. |
| **Opera** | `opera://extensions` | Same as above. |
| **Edge** | `edge://extensions` | Same as above. |
| **Other Chromium** | Usually `chrome://extensions` or check your browser’s settings | Same as above. |

After loading, the **Undo Close Tab** icon should appear in the toolbar (you may need to pin it from the puzzle-piece menu).

---

### 3. Use it

- **Left-click** the icon → popup with “Restore last closed tab” and the list.  
- **Right-click** the icon → same list in a context menu.  
- **Options**: Right-click the icon → **Options**, or open the extension card and click **Extension options**.

---

## 🛠️ Options

| Option | What it does |
|--------|----------------|
| **Number of items in menu** | How many closed tabs to show (1–25). |
| **Only current window** | Show only tabs closed in the current window. |
| **Restore as group** | If tabs were closed within X ms, restore them together. |
| **Tab / page context menus** | Add “Undo Close Tab” to the tab bar or page right-click menu. |
| **Clear list** | *(Not supported in Chromium — option kept for compatibility.)* |

---

## 🖼️ Supported browsers

| Browser | Status |
|---------|--------|
| **Brave** | ✅ Tested |
| **Google Chrome** | ✅ Tested |
| **Opera** | ✅ Compatible |
| **Microsoft Edge** | ✅ Compatible |
| **Vivaldi, Chromium, etc.** | ✅ Should work on any Chromium-based browser |

---

## 📜 Differences from the Firefox version

- **Popup on click** — Left-click opens a popup (Chromium doesn’t support “no popup + click” the same way).  
- **Clear list** — Chromium’s `sessions` API doesn’t support “forget closed tab,” so “Clear list” has no effect.  
- **Context menu** — Menu is built when sessions change, not when you open it, so it can be a moment out of date.

---

## 🙏 Acknowledgments

This extension is a **Chromium port** of the original Firefox add-on. Full credit to:

- **[@M-Reimer](https://github.com/M-Reimer)** — [Manuel Reimer](https://github.com/M-Reimer) — for the original [**undoclosetab**](https://github.com/M-Reimer/undoclosetab) project and the idea.
- **[Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/undoclosetabbutton/)** — where the Firefox extension is published and maintained.

Original repo: [github.com/M-Reimer/undoclosetab](https://github.com/M-Reimer/undoclosetab) · Firefox add-on: [addons.mozilla.org/.../undoclosetabbutton](https://addons.mozilla.org/en-US/firefox/addon/undoclosetabbutton/)

Licensed under **GPL-3.0** in line with the original project.

---

## 📄 License

[GPL-3.0](LICENSE) — same as the original [undoclosetab](https://github.com/M-Reimer/undoclosetab) repository.

---

## 🚀 Publish this repo to your GitHub

If you cloned or downloaded this and want it under **your** GitHub account:

1. **Create a new repo on GitHub**  
   - Go to [github.com/new](https://github.com/new).  
   - Name it e.g. `undoclosetab-brave`.  
   - Do **not** add a README, .gitignore, or license (this repo already has them).  
   - Create the repository.

2. **In this folder, run:**

```bash
git init
git add .
git commit -m "Initial commit: Undo Close Tab for Chromium (Brave, Chrome, Opera, Edge)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/undoclosetab-brave.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.  
If you use SSH: `git@github.com:YOUR_USERNAME/undoclosetab-brave.git`.

**No Git?** Create the repo on GitHub, then use **Upload files** / **Add file → upload files** and drag this folder’s contents into the repo.
