import React, { ReactNode } from 'react';
import { Platform } from 'react-native';
import DeviceFrame from './DeviceFrame';

interface MobileContainerProps {
  children: ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  // If not web platform, just return children without wrapper
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Use our new DeviceFrame for web platform
  return <DeviceFrame>{children}</DeviceFrame>;
};

export default MobileContainer; 