import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import PaperIconFix from './PaperIconFix';

// Create custom Paper Provider with our icon providers
const CustomPaperProvider = ({ theme, children }: { theme: any, children: React.ReactNode }) => {
  // Create custom icons configuration
  const icons = {
    // These names match the expected icon providers in react-native-paper
    'material-community': PaperIconFix.MaterialCommunityIcons,
    'ionicons': PaperIconFix.Ionicons,
  };

  return (
    <PaperProvider theme={{ ...theme, icons }}>
      {children}
    </PaperProvider>
  );
};

export default CustomPaperProvider; 