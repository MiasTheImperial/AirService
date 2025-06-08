// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Добавляем поддержку для svg файлов (используется в иконках)
config.resolver.assetExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Добавляем поддержку для vector-icons
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Add resolver for the missing module
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@react-native-vector-icons/material-design-icons': require.resolve('@expo/vector-icons/MaterialCommunityIcons'),
  },
};

module.exports = config; 