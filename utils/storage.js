/*
  WebExtension utils - Brave/Chrome port
  Based on Firefox addon utils by Manuel Reimer
  GPL-3.0
*/
"use strict";

const Storage = {
  _defaults: false,

  get: async function() {
    if (!this._defaults) {
      const url = chrome.runtime.getURL("/default-preferences.json");
      const txt = await (await fetch(url)).text();
      const json = txt.replace(/^\s*\/\/.*$/gm, "").replace(
        /__MSG_([A-Za-z0-9_]+?)__/g,
        (match, msgName) => chrome.i18n.getMessage(msgName)
      );
      const defaults = JSON.parse(json);
      await this._apply_managed_defaults(defaults);
      this._defaults = defaults;
    }

    const prefs = await new Promise((resolve) =>
      chrome.storage.local.get(null, resolve)
    );
    for (const name in this._defaults) {
      if (prefs[name] === undefined) prefs[name] = this._defaults[name];
    }
    return prefs;
  },

  set: function(aObject) {
    return new Promise((resolve) => chrome.storage.local.set(aObject, resolve));
  },

  remove: function(keys) {
    return new Promise((resolve) => chrome.storage.local.remove(keys, resolve));
  },

  _apply_managed_defaults: async function(defaults) {
    let mgdefaults = {};
    try {
      mgdefaults = await new Promise((resolve) =>
        chrome.storage.managed.get(null, resolve)
      );
    } catch (e) {
      return;
    }
    for (const [name, mgvalue] of Object.entries(mgdefaults)) {
      if (!Object.prototype.hasOwnProperty.call(defaults, name)) continue;
      const ourvalue = defaults[name];
      const mgtype = Object.prototype.toString.call(mgvalue);
      const ourtype = Object.prototype.toString.call(ourvalue);
      if (mgtype !== ourtype) continue;
      if (Array.isArray(mgvalue) && mgvalue.length === 0) continue;
      if (Array.isArray(ourvalue) && ourvalue.length > 0) {
        const itemtype = Object.prototype.toString.call(ourvalue[0]);
        const invalid = mgvalue.map((x) => Object.prototype.toString.call(x)).filter((x) => x !== itemtype);
        if (invalid.length) continue;
      }
      defaults[name] = mgvalue;
    }
  }
};
