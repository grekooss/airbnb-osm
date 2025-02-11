const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Dodaj folder shared do watchFolders
config.watchFolders = [path.resolve(__dirname, '../shared')];

module.exports = withNativeWind(config, { input: './global.css' });
