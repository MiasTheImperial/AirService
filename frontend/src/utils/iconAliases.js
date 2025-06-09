// This file provides mock implementations for missing icon packages
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Create an alias for the missing module
if (typeof window !== 'undefined') {
  window['@react-native-vector-icons/material-design-icons'] = {
    default: MaterialCommunityIcons
  };
}

export default {}; 