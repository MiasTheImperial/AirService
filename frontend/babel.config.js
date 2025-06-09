module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Custom plugin to transform problematic imports
      require('./src/utils/babelTransformPlugin'),
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@theme': './src/theme',
            // Add alias for the problematic module
            '@react-native-vector-icons/material-design-icons': '@expo/vector-icons/MaterialCommunityIcons',
          },
        },
      ],
    ],
  };
}; 