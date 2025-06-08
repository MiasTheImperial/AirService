import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import { MaterialIconsProvider, MaterialCommunityIconsProvider } from '../components/CustomIcons';

// Define colors for our dark theme
const darkThemeColors = {
  primary: '#3D7DFF',     // Bright blue
  onPrimary: '#FFFFFF',
  primaryContainer: '#051D38',
  onPrimaryContainer: '#D6E3FF',
  secondary: '#00C2FF',   // Cyan accent
  onSecondary: '#000000',
  secondaryContainer: '#073042',
  onSecondaryContainer: '#C2F8FF',
  tertiary: '#AD8FFF',    // Purple accent
  onTertiary: '#000000',
  tertiaryContainer: '#1F1452',
  onTertiaryContainer: '#E8DDFF',
  error: '#FF5757',       // Red for errors
  onError: '#FFFFFF',
  errorContainer: '#410001',
  onErrorContainer: '#FFCFCF',
  background: '#121212',  // Dark background
  onBackground: '#E5E5E5',
  surface: '#1E1E1E',     // Slightly lighter than background
  onSurface: '#E1E1E1',
  surfaceVariant: '#252525',
  onSurfaceVariant: '#CCCCCC',
  outline: '#7A7A7A',
  outlineVariant: '#444444',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E5E5E5',
  inverseOnSurface: '#1E1E1E',
  inversePrimary: '#2662D9',
  elevation: {
    level0: 'transparent',
    level1: '#1F1F1F',
    level2: '#232323',
    level3: '#282828',
    level4: '#2C2C2C',
    level5: '#303030'
  }
};

// Configure font styles
const fontConfig = {
  fontFamily: 'System',
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700'
  }
};

// Configure the icon providers
const customIconProviders = {
  materialCommunityIcon: MaterialCommunityIconsProvider,
  materialIcon: MaterialIconsProvider,
};

// Create our dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkThemeColors,
  fonts: configureFonts({ config: fontConfig }),
  // Add the custom icon providers
  icons: customIconProviders,
  // Custom properties
  roundness: 12,
  animation: {
    scale: 1.0,
  },
  dark: true, // Force dark mode
};

// Use dark theme as default theme
export const defaultTheme = darkTheme;

// For backward compatibility, but we'll only use dark theme
export const lightTheme = darkTheme; 