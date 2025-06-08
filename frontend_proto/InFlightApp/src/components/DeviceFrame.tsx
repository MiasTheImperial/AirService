import React, { ReactNode, useState } from 'react';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import PaperIconFix from './PaperIconFix';

interface DeviceFrameProps {
  children: ReactNode;
}

const DeviceFrame = ({ children }: DeviceFrameProps) => {
  const theme = useTheme();
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Only show frame on web platform
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const toggleOrientation = () => {
    setIsLandscape(!isLandscape);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* <View style={styles.controls}>
        <View 
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            width: 48,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Pressable onPress={toggleOrientation}>
            <PaperIconFix.Ionicons 
              name={isLandscape ? "phone-portrait" : "phone-landscape"} 
              size={24} 
              color="#fff" 
            />
          </Pressable>
        </View>
      </View> */}

      <View 
        style={[
          styles.deviceFrame, 
          { 
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)',
            borderColor: '#000000',
            backgroundColor: theme.colors.background
          },
          isLandscape && styles.deviceFrameLandscape
        ]}
        // @ts-ignore: Web specific prop
        className="device-frame"
      >
        {/* Power button */}
        <View style={[styles.powerButton, isLandscape && styles.powerButtonLandscape]} />
        
        {/* Volume buttons */}
        <View style={[styles.volumeButtonsContainer, isLandscape && styles.volumeButtonsContainerLandscape]}>
          <View style={styles.volumeButton} />
          <View style={styles.volumeButton} />
        </View>

        {/* Notch */}
        <View style={[styles.notch, isLandscape && styles.notchLandscape]}>
          <View style={styles.camera} />
          <View style={styles.speaker} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Home indicator */}
        <View style={[styles.homeButton, isLandscape && styles.homeButtonLandscape]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Web-specific styles using platform check
    ...(Platform.OS === 'web' ? {
      height: '100vh' as any,
    } : {}),
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  deviceFrame: {
    width: 375,
    height: 812,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 12,
  },
  deviceFrameLandscape: {
    width: 812,
    height: 375,
  },
  notch: {
    width: 180,
    height: 30,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 0,
  },
  notchLandscape: {
    width: 30,
    height: 180,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    top: 'auto',
    left: 0,
    bottom: 'auto',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  camera: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444',
    marginHorizontal: 10,
  },
  speaker: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
  },
  content: {
    flex: 1,
  },
  homeButton: {
    width: 40,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
  },
  homeButtonLandscape: {
    width: 6,
    height: 40,
    bottom: 'auto',
    right: 8,
    alignSelf: 'flex-end',
    top: '50%',
    marginTop: -20,
  },
  powerButton: {
    width: 5,
    height: 40,
    backgroundColor: '#000000',
    position: 'absolute',
    right: -13,
    top: 120,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  powerButtonLandscape: {
    width: 40,
    height: 5,
    right: 120,
    top: -13,
    borderRadius: 3,
  },
  volumeButtonsContainer: {
    position: 'absolute',
    left: -13,
    top: 100,
    height: 100,
    width: 5,
    justifyContent: 'space-between',
  },
  volumeButtonsContainerLandscape: {
    height: 5,
    width: 100,
    left: 100,
    top: -13,
    flexDirection: 'row',
  },
  volumeButton: {
    width: 5,
    height: 40,
    backgroundColor: '#000000',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
});

export default DeviceFrame; 