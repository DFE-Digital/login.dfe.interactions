'use strict';

const fs = require('fs');
const Path = require('path');

const PROJECT_NAME = 'login.dfe.interactions';

const getSettingsObject = (settings) => {
  try {
    return JSON.parse(settings);
  } catch (e) {
    return null;
  }
};

const getSettingsFromFile = (settingsPath) => {
  if (fs.existsSync(settingsPath)) {
    const file = fs.readFileSync(settingsPath, 'utf8');
    try {
      return JSON.parse(file);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const fetchConfig = () => {
  if (process.env.settings) {
    const { settings } = process.env;
    let settingsObject = getSettingsObject(settings);
    if (settingsObject !== null) {
      return settingsObject;
    }
    const settingsPath = Path.resolve(settings);
    if (fs.existsSync(settingsPath)) {
      settingsObject = getSettingsFromFile(settingsPath);
      if (settingsObject !== null) {
        return settingsObject;
      }
    }
  }
  const localConfig = require('login.dfe.config')[PROJECT_NAME];
  process.env.settings = JSON.stringify(localConfig);
  return localConfig;
};

module.exports = fetchConfig;
