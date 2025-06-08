import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import MainApp from './src/App';
import MobileContainer from './src/components/MobileContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <MobileContainer>
        <MainApp />
      </MobileContainer>
    </SafeAreaProvider>
  );
}
