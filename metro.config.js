const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
};

// Merge the default and custom configurations
const finalConfig = mergeConfig(defaultConfig, customConfig);

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./src/assets/fonts"],
};

module.exports = finalConfig;
