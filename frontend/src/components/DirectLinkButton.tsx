import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface DirectLinkButtonProps {
  screenName: string;
  params?: Record<string, string>;
  children: React.ReactNode;
  style?: any;
}

/**
 * DirectLinkButton - компонент для создания кнопок с прямыми ссылками на экраны
 * по имени компонента. Для веб-версии создает ссылку с новым URL,
 * для мобильной версии использует deeplink.
 */
const DirectLinkButton: React.FC<DirectLinkButtonProps> = ({
  screenName,
  params,
  children,
  style
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    try {
      navigation.navigate(screenName as never, params as never);
    } catch {
      // В редких случаях навигация может быть недоступна
      if (Platform.OS !== 'web') {
        let url = `inflightapp://${screenName}`;
        if (params) {
          const paramKeys = Object.keys(params);
          if (paramKeys.length > 0) {
            url += `/${params[paramKeys[0]]}`;
          }
        }

        Linking.openURL(url);
      }
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[styles.button, { backgroundColor: theme.colors.primary }, style]}
    >
      <Text style={[styles.text, { color: theme.colors.onPrimary }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DirectLinkButton; 