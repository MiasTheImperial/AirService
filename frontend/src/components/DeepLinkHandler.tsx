import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * DeepLinkHandler - компонент для обработки deeplink и навигации по URL
 * 
 * Позволяет открывать страницы приложения по имени компонента,
 * например, http://localhost:19006/ProfileScreen
 * 
 * @returns React component
 */
const DeepLinkHandler = () => {
  const navigation = useNavigation();

  // Обработка входящих ссылок
  const handleDeepLink = (event: { url: string }) => {
    const { url } = event;
    console.log('Received deep link:', url);
    
    // Получаем путь из URL (часть после доменного имени)
    const path = url.split('//')[1].split('/').slice(1);
    if (path.length === 0) return;
    
    const componentName = path[0];
    const componentParam = path[1];
    
    console.log('Component name:', componentName);
    console.log('Component param:', componentParam);
    
    // Список компонентов, которые могут принимать параметры
    const componentsWithParams = ['ProductDetailsScreen', 'OrderStatusScreen', 'ProductDetails', 'OrderStatus'];
    
    // Выполняем навигацию в соответствии с полученным URL
    if (componentsWithParams.includes(componentName) && componentParam) {
      // Для экранов с параметрами
      navigation.navigate(componentName as never, { id: componentParam } as never);
    } else {
      // Для экранов без параметров
      navigation.navigate(componentName as never);
    }
  };

  useEffect(() => {
    // Обработка deeplink, который уже открыл приложение
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Слушатель для обработки deeplink во время работы приложения
    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    return () => {
      linkingListener.remove();
    };
  }, []);

  // Компонент ничего не рендерит, только обрабатывает deeplink
  return null;
};

export default DeepLinkHandler; 