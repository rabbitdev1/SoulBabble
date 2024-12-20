module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ['nativewind/babel', {allowModuleTransform: ['moti']}],
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        "envName": 'APP_ENV',
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": true,
        "allowUndefined": true
      },
    ],
  ],
};
