import * as React from 'react';
import { Animated, StyleSheet, Text, Platform } from 'react-native';

let MaterialCommunityIcon;

// Directly use @expo/vector-icons instead of the missing module
try {
  // Try to load from expo directly
  MaterialCommunityIcon = require('@expo/vector-icons/MaterialCommunityIcons').default;
} catch (e) {
  // Fallback to handling nothing (will use the compat component below)
  MaterialCommunityIcon = undefined;
}

const CompatMaterialCommunityIcon = ({
  name,
  color,
  size,
  style,
  ...rest
}) => {
  return (
    <Text style={[{
      color,
      fontSize: size
    }, styles.icon, style]} {...rest}>
      {name}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'Material Design Icons',
    fontWeight: 'normal',
    fontStyle: 'normal'
  }
});

export default MaterialCommunityIcon || CompatMaterialCommunityIcon; 