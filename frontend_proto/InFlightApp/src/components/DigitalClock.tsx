import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface DigitalClockProps {
  style?: any;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ style }) => {
  const [time, setTime] = useState('');
  const theme = useTheme();
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    // Update time immediately
    updateTime();
    
    // Update time every minute
    const intervalId = setInterval(updateTime, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Text style={[styles.timeText, { color: '#FFFFFF' }, style]}>
      {time}
    </Text>
  );
};

const styles = StyleSheet.create({
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DigitalClock; 