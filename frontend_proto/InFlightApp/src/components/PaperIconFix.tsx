import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

/**
 * This component provides a workaround for the "class constructors must be invoked with 'new'" error
 * that occurs with React Native Paper's Icon component on web.
 */
export const PaperIconFix = {
  // Safe icon providers
  MaterialCommunityIcons: (props: any) => <MaterialCommunityIcons {...props} />,
  Ionicons: (props: any) => <Ionicons {...props} />
};

export default PaperIconFix; 