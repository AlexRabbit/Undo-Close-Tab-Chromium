"use strict";

const numberShowNumber = document.getElementById("showNumber_inputbox");
const checkPage = document.getElementById("showPageMenu_checkbox");
const checkPageMenuitem = document.getElementById("showPageMenuitem_checkbox");
const checkTab = document.getElementById("showTabMenu_checkbox");
const checkOnlyCurrent = document.getElementById("onlyCurrent_checkbox");
const checkClearList = document.getElementById("showClearList_checkbox");
const checkRestoreGroup = document.getElementById("restoreGroup_checkbox");
const numberGroupTime = document.getElementById("groupTime_inputbox");

const MAX_SESSION_RESULTS = 25;

async function numberChanged(e) {
  const match = e.target.id.match(/([a-zA-Z_]+)_inputbox/);
  if (!match) return;
  const pref = match[1];

  let value = parseInt(e.target.value, 10);
  if (isNaN(value) || value > e.target.max || value < e.target.min) {
    value = parseInt(e.target.getAttribute("value"), 10);
  }

  const params = {};
  params[pref] = value;
  await Storage.set(params);
  e.target.value = value;
}

async function checkboxChanged(e) {
  const match = e.target.id.match(/([a-zA-Z_]+)_checkbox/);
  if (!match) return;
  const pref = match[1];
  const params = {};
  params[pref] = e.target.checked;

  if (e.target.id === checkPage.id) {
    params.showPageMenuitem = false;
    checkPageMenuitem.checked = false;
  } else if (e.target.id === checkPageMenuitem.id) {
    params.showPageMenu = false;
    checkPage.checked = false;
  } else if (e.target.id === checkRestoreGroup.id) {
    numberGroupTime.disabled = !e.target.checked;
  }

  await Storage.set(params);
}

function init() {
  numberShowNumber.title = chrome.i18n.getMessage("numberText_title", [String(MAX_SESSION_RESULTS)]);
  numberShowNumber.max = MAX_SESSION_RESULTS;
  numberShowNumber.setAttribute("value", MAX_SESSION_RESULTS);
  loadOptions();

  numberShowNumber.addEventListener("change", numberChanged);
  numberGroupTime.addEventListener("change", numberChanged);

  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", checkboxChanged);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const msg = el.getAttribute("data-i18n");
    if (msg) {
      el.textContent = chrome.i18n.getMessage(msg);
    }
  });
}

function loadOptions() {
  Storage.get().then((result) => {
    numberShowNumber.value = result.showNumber;
    checkTab.checked = result.showTabMenu;
    checkPage.checked = result.showPageMenu;
    checkPageMenuitem.checked = result.showPageMenuitem;
    checkOnlyCurrent.checked = result.onlyCurrent;
    checkClearList.checked = result.showClearList;
    checkRestoreGroup.checked = result.restoreGroup;
    numberGroupTime.value = result.groupTime;
    numberGroupTime.disabled = !result.restoreGroup;
  });
}

init();
