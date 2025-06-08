import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';

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
  
  const handlePress = () => {
    // Формируем URL на основе имени экрана и параметров
    let url = '';
    
    if (Platform.OS === 'web') {
      // Для веб используем относительный URL
      url = `/${screenName}`;
      if (params) {
        // Добавляем параметры в URL для экранов с параметрами
        const paramKeys = Object.keys(params);
        if (paramKeys.length > 0) {
          url += `/${params[paramKeys[0]]}`;
        }
      }
      
      // Для веб-версии изменяем URL без перезагрузки страницы
      window.history.pushState({}, '', url);
      
      // Также можно добавить перенаправление или навигацию
      // с помощью react-navigation
    } else {
      // Для мобильной версии используем схему deeplink
      url = `inflightapp://${screenName}`;
      if (params) {
        // Добавляем параметры в URL для экранов с параметрами
        const paramKeys = Object.keys(params);
        if (paramKeys.length > 0) {
          url += `/${params[paramKeys[0]]}`;
        }
      }
      
      // Открываем ссылку через Linking API
      Linking.openURL(url);
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