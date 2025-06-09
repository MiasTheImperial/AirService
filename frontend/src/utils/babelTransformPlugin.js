// Custom Babel plugin to transform problematic imports
module.exports = function() {
  return {
    visitor: {
      CallExpression(path) {
        // Find require calls for the problematic module
        if (
          path.node.callee.name === 'require' &&
          path.node.arguments.length > 0 &&
          path.node.arguments[0].value === '@react-native-vector-icons/material-design-icons'
        ) {
          // Replace with the Expo package
          path.node.arguments[0].value = '@expo/vector-icons/MaterialCommunityIcons';
        }
      },
      ImportDeclaration(path) {
        // Find import statements for the problematic module
        if (path.node.source.value === '@react-native-vector-icons/material-design-icons') {
          // Replace with the Expo package
          path.node.source.value = '@expo/vector-icons/MaterialCommunityIcons';
        }
      }
    }
  };
}; 