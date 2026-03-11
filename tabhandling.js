/*
  Undo Close Tab - Brave/Chrome port
  Based on Firefox addon by M-Reimer (https://github.com/M-Reimer/undoclosetab)
  Copyright (C) 2020 Manuel Reimer, (C) 2017 YFdyh000
  GPL-3.0
*/
"use strict";

const TabHandling = {
  GetLastClosedTabs: async function(aMaxResults, aOnlyCurrent) {
    let tabs = await this._SessionsGetLastClosedTabs();

    if (aOnlyCurrent && chrome.windows) {
      const currentWindow = await new Promise((resolve) =>
        chrome.windows.getCurrent(null, resolve)
      );
      tabs = tabs.filter((tab) => tab.windowId === undefined || tab.windowId === currentWindow.id);
    }

    tabs = tabs.filter((tab) => tab.title !== undefined);

    if (aMaxResults && tabs.length > aMaxResults) {
      tabs = tabs.slice(0, aMaxResults);
    }

    return tabs;
  },

  _SessionsGetLastClosedTabs: async function() {
    const sessions = await new Promise((resolve) =>
      chrome.sessions.getRecentlyClosed({}, resolve)
    );
    const tabSessions = sessions.filter((s) => s.tab);

    return tabSessions.map((s) => {
      const tab = Object.assign({}, s.tab);
      tab._tabCloseTime = s.lastModified;
      tab.sessionId = s.tab.sessionId;
      return tab;
    });
  },

  ClearList: async function(aOnlyCurrent) {
    if (!chrome.sessions.forgetClosedTab) return;
    let tabs = await this._SessionsGetLastClosedTabs();
    if (aOnlyCurrent && chrome.windows) {
      const currentWindow = await new Promise((resolve) =>
        chrome.windows.getCurrent(null, resolve)
      );
      tabs = tabs.filter((t) => t.windowId === currentWindow.id);
    }
    for (const tab of tabs) {
      try {
        await new Promise((resolve, reject) =>
          chrome.sessions.forgetClosedTab(tab.windowId, tab.sessionId, () =>
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve()
          )
        );
      } catch (e) {
        // Chrome doesn't support forgetClosedTab; ignore
      }
    }
  },

  Restore: async function(aSessionId) {
    const session = await new Promise((resolve) =>
      chrome.sessions.restore(aSessionId, resolve)
    );
    if (session && session.tab && chrome.windows) {
      const currentWindow = await new Promise((resolve) =>
        chrome.windows.getCurrent(null, resolve)
      );
      if (session.tab.windowId !== currentWindow.id) {
        chrome.windows.update(session.tab.windowId, { focused: true });
      }
    }
  },

  Init: function() {}
};
