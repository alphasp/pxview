const path = require('path');

const extraNodeModules = {
  'react-native-cs-sdk': path.resolve(__dirname + '../..'),
};
const watchFolders = [
  path.resolve(__dirname + '../..')
];

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
module.exports = {
  resolver: {
    extraNodeModules,
  },
  watchFolders,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
