import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RouteName, { RoutePath } from '../navigation/routes';

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

    const segments = url.split('//')[1].split('/').slice(1);
    if (segments.length === 0) return;

    const pathSegment = segments[0];
    const param = segments[1];

    // Находим имя маршрута по базовому пути
    const routeEntry = Object.entries(RoutePath).find(([, value]) => value.split('/')[0] === pathSegment);
    if (!routeEntry) return;

    const routeName = routeEntry[0] as RouteName;

    // Список экранов, принимающих параметры
    const componentsWithParams = [
      RouteName.PRODUCT_DETAILS_SCREEN,
      RouteName.ORDER_STATUS_SCREEN,
      RouteName.PRODUCT_DETAILS,
      RouteName.ORDER_STATUS,
      RouteName.ORDER_DETAILS,
      RouteName.ORDER_DETAILS_SCREEN,
      RouteName.PAYMENT_SCREEN
    ];

    if (componentsWithParams.includes(routeName) && param) {
      const params: Record<string, string> = {};
      if (routeName === RouteName.PAYMENT_SCREEN) {
        params.amount = param;
      } else {
        params.id = param;
      }
      navigation.navigate(routeName as never, params as never);
    } else {
      navigation.navigate(routeName as never);
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
