import React from 'react';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MaterialIcons as MaterialIconsType } from '@expo/vector-icons/build/Icons';
import { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons/build/Icons';
import { Ionicons as IoniconsType } from '@expo/vector-icons/build/Icons';

interface IconProps {
  name: string;
  color: string;
  size: number;
}

export const MaterialCommunityIconsProvider = ({ name, color, size, ...rest }: {
  name: keyof typeof MaterialCommunityIconsType.glyphMap,
  color: string,
  size: number,
  [key: string]: any
}) => {
  return <MaterialCommunityIcons name={name} color={color} size={size} {...rest} />;
};

export const MaterialCommunityIcon = ({ name, color, size, ...rest }: {
  name: keyof typeof MaterialCommunityIconsType.glyphMap,
  color: string,
  size: number,
  [key: string]: any
}) => {
  return <MaterialCommunityIcons name={name} color={color} size={size} {...rest} />;
};

export const MaterialIconsProvider = ({ name, color, size, ...rest }: {
  name: keyof typeof MaterialIconsType.glyphMap,
  color: string,
  size: number,
  [key: string]: any
}) => {
  return <MaterialIcons name={name} color={color} size={size} {...rest} />;
};

export const IoniconsIcon = ({ name, color, size, ...rest }: {
  name: keyof typeof IoniconsType.glyphMap,
  color: string,
  size: number,
  [key: string]: any
}) => {
  return <Ionicons name={name} color={color} size={size} {...rest} />;
}; 