const path = require('path');
const {generate} = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts', './assets/images'],
  transformer: {
    unstable_allowRequireContext: true,
  },
};
