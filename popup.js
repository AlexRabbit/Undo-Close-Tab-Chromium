"use strict";

document.getElementById("title").textContent = chrome.i18n.getMessage("extensionName");
document.getElementById("restoreLast").textContent = chrome.i18n.getMessage("extensionName");

chrome.sessions.getRecentlyClosed({}, (sessions) => {
  const tabSessions = sessions.filter((s) => s.tab);
  const listEl = document.getElementById("list");
  const emptyEl = document.getElementById("empty");
  const restoreBtn = document.getElementById("restoreLast");

  if (tabSessions.length === 0) {
    listEl.style.display = "none";
    emptyEl.style.display = "block";
    restoreBtn.disabled = true;
    return;
  }

  emptyEl.style.display = "none";
  tabSessions.forEach((s) => {
    const tab = s.tab;
    const title = tab.title || tab.url || "(No title)";
    const li = document.createElement("li");
    li.textContent = title;
    li.title = tab.url || "";
    li.addEventListener("click", () => {
      chrome.sessions.restore(tab.sessionId, () => window.close());
    });
    listEl.appendChild(li);
  });
});

document.getElementById("restoreLast").addEventListener("click", () => {
  chrome.sessions.getRecentlyClosed({ maxResults: 1 }, (sessions) => {
    if (sessions.length && sessions[0].tab) {
      chrome.sessions.restore(sessions[0].tab.sessionId, () => window.close());
    }
  });
});
