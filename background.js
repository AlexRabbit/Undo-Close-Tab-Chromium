/*
  Undo Close Tab - Brave/Chrome port
  Based on Firefox addon by M-Reimer (https://github.com/M-Reimer/undoclosetab)
  GPL-3.0
*/
"use strict";

const ACTION_MENU_TOP_LEVEL_LIMIT = 6;

async function ToolbarButtonClicked() {
  const tabs = await TabHandling.GetLastClosedTabs(false, true);
  if (!tabs.length) return;

  await TabHandling.Restore(tabs[0].sessionId);

  const prefs = await Storage.get();
  if (prefs.restoreGroup && tabs[0]._tabCloseTime) {
    for (let ti = 1; ti < tabs.length; ti++) {
      if (!tabs[ti]._tabCloseTime) break;
      if (tabs[ti - 1]._tabCloseTime - tabs[ti]._tabCloseTime < prefs.groupTime) {
        await TabHandling.Restore(tabs[ti].sessionId);
      } else {
        break;
      }
    }
  }
}

function tabMenuProperties(tab, idPrefix) {
  return {
    id: idPrefix + ":" + tab.sessionId,
    title: tab.title ? tab.title.replace(/&/g, "&&") : "(No title)",
    contexts: ["browser_action"]
  };
}

async function rebuildContextMenu() {
  try {
    const prefs = await Storage.get();
    const tabs = await TabHandling.GetLastClosedTabs(prefs.showNumber, prefs.onlyCurrent);
    const maxAllowed = ACTION_MENU_TOP_LEVEL_LIMIT - (prefs.showClearList ? 1 : 0);

    await new Promise((resolve) => chrome.contextMenus.removeAll(resolve));

    // Always create at least one browser_action item so right-click always shows a menu
    if (tabs.length > 0) {
      chrome.contextMenus.create({
        id: "BA:UndoCloseTab",
        title: chrome.i18n.getMessage("extensionName") + " (" + tabs.length + ")",
        contexts: ["browser_action"]
      });
    } else {
      chrome.contextMenus.create({
        id: "BA:UndoCloseTab",
        title: chrome.i18n.getMessage("extensionName") + " - " + chrome.i18n.getMessage("no_recent_tabs"),
        contexts: ["browser_action"]
      });
    }

    if ((prefs.showTabMenu || prefs.showPageMenu) && tabs.length) {
    const contexts = [];
    if (prefs.showTabMenu) contexts.push("tab");
    if (prefs.showPageMenu) contexts.push("page");

    chrome.contextMenus.create({
      id: "RootMenu",
      title: chrome.i18n.getMessage("page_contextmenu_submenu"),
      contexts: contexts
    });

    tabs.forEach((tab) => {
      chrome.contextMenus.create({
        id: "PM:" + tab.sessionId,
        title: tab.title ? tab.title.replace(/&/g, "&&") : "(No title)",
        contexts: contexts,
        parentId: "RootMenu"
      });
    });

    if (prefs.showClearList) {
      chrome.contextMenus.create({
        id: "PM:ClearList",
        title: chrome.i18n.getMessage("clearlist_menuitem"),
        contexts: contexts,
        parentId: "RootMenu"
      });
    }
  }

  if (prefs.showPageMenuitem) {
    chrome.contextMenus.create({
      id: "UndoCloseTab",
      title: chrome.i18n.getMessage("extensionName"),
      contexts: ["page"]
    });
  }

    if (tabs.length <= maxAllowed) {
      tabs.forEach((tab) => {
        chrome.contextMenus.create(tabMenuProperties(tab, "BA"));
      });
    } else {
      tabs.slice(0, maxAllowed - 1).forEach((tab) => {
        chrome.contextMenus.create(tabMenuProperties(tab, "BA"));
      });
      chrome.contextMenus.create({
        id: "MoreClosedTabs",
        title: chrome.i18n.getMessage("more_entries_menu"),
        contexts: ["browser_action"]
      });
      tabs.forEach((tab) => {
        chrome.contextMenus.create({
          id: "BA:" + tab.sessionId,
          title: tab.title ? tab.title.replace(/&/g, "&&") : "(No title)",
          contexts: ["browser_action"],
          parentId: "MoreClosedTabs"
        });
      });
    }

    if (tabs.length && prefs.showClearList) {
      chrome.contextMenus.create({
        id: "BA:ClearList",
        title: chrome.i18n.getMessage("clearlist_menuitem"),
        contexts: ["browser_action"]
      });
    }
  } catch (e) {
    console.error("Undo Close Tab: rebuildContextMenu failed", e);
  }
}

async function contextMenuClicked(info) {
  if (info.menuItemId === "UndoCloseTab" || info.menuItemId === "BA:UndoCloseTab") {
    await ToolbarButtonClicked();
    return;
  }
  if (String(info.menuItemId).endsWith("ClearList")) {
    const prefs = await Storage.get();
    await TabHandling.ClearList(prefs.onlyCurrent);
    rebuildContextMenu();
    return;
  }
  const idx = String(info.menuItemId).indexOf(":");
  if (idx >= 0) {
    const sessionId = String(info.menuItemId).substring(idx + 1);
    if (sessionId !== "ClearList") {
      await TabHandling.Restore(sessionId);
    }
  }
}

TabHandling.Init();

chrome.browserAction.onClicked.addListener(() => {
  ToolbarButtonClicked();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  contextMenuClicked(info);
});

chrome.sessions.onChanged.addListener(() => {
  rebuildContextMenu();
});

// Defer so listeners are registered first; catch errors so script doesn't crash
setTimeout(() => rebuildContextMenu(), 0);
