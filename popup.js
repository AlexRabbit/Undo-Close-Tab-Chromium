"use strict";

const MAX_LIST_ITEMS = 25; // Chrome sessions API maximum
const NO_FAVICON_URL = chrome.runtime.getURL("icons/no-favicon.svg");

document.getElementById("title").textContent = chrome.i18n.getMessage("extensionName");
document.getElementById("restoreLast").textContent = chrome.i18n.getMessage("extensionName");

chrome.sessions.getRecentlyClosed({ maxResults: MAX_LIST_ITEMS }, (sessions) => {
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
  listEl.style.display = "block";
  tabSessions.forEach((s) => {
    const tab = s.tab;
    const title = tab.title || tab.url || "(No title)";
    const faviconUrl = tab.favIconUrl || NO_FAVICON_URL;

    const li = document.createElement("li");
    const img = document.createElement("img");
    img.className = "favicon";
    img.src = faviconUrl;
    img.alt = "";
    img.onerror = () => { img.src = NO_FAVICON_URL; };

    const span = document.createElement("span");
    span.className = "label";
    span.textContent = title;

    li.appendChild(img);
    li.appendChild(span);
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
