const createExpoWebpackConfig = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfig(env, argv);
  
  // Find and remove any existing CSS rules to avoid conflicts
  config.module.rules = config.module.rules.filter(rule => {
    if (rule.test && rule.test.toString().includes('.css')) {
      return false;
    }
    return true;
  });
  
  // Add a simple CSS rule
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  // Настраиваем HTML шаблон
  config.plugins.forEach(plugin => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.template = path.resolve(__dirname, 'index.html');
    }
  });

  // Добавляем алиасы для импортов
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@screens': path.resolve(__dirname, 'src/screens'),
    '@theme': path.resolve(__dirname, 'src/theme'),
    '@react-native-vector-icons/material-design-icons': '@expo/vector-icons/MaterialCommunityIcons',
  };

  return config;
}; 