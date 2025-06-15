import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, getStateFromPath as getStateFromPathDefault, useNavigation, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import ThemeProvider, { useThemeContext } from './theme/ThemeProvider';
import { IoniconsIcon } from './components/CustomIcons';
import CustomPaperProvider from './components/CustomPaperProvider';
import { useTranslation } from 'react-i18next';
import i18n, { initLanguage } from './i18n/i18n';
import MobileContainer from './components/MobileContainer';
import DeepLinkHandler from './components/DeepLinkHandler';
import RouteName from './navigation/routes';

// Import screens
import LoginScreen from './screens/LoginScreen';
import CatalogScreen from './screens/CatalogScreen';
import CartScreen from './screens/CartScreen';
import OrderStatusScreen from './screens/OrderStatusScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminPanel from './screens/AdminPanel';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import SupportScreen from './screens/SupportScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';

// Определение типов для навигации
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Login: { onLogin: (isAdmin: boolean, seatNumber: string) => void };
      MainApp: undefined;
      AdminRoot: undefined;
      ProductDetails: { id: string };
      OrderStatus: { orderId: string };
      OrderDetails: { orderId: string };
      CatalogScreen: undefined;
      CartScreen: undefined;
      ProfileScreen: undefined;
      LoginScreen: { onLogin: (isAdmin: boolean, seatNumber: string) => void };
      AdminPanel: undefined;
      ProductDetailsScreen: { id: string };
      OrderStatusScreen: { id: string };
      OrderDetailsScreen: { id: string };
      PaymentScreen: { amount?: number };
      OrderHistoryScreen: undefined;
      SupportScreen: undefined;
    }
  }
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create a customized navigation theme
const createNavigationTheme = (theme: any) => ({
  ...(theme.dark ? NavigationDarkTheme : NavigationDefaultTheme),
  colors: {
    ...(theme.dark ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.onSurface,
    border: theme.colors.outline,
    notification: theme.colors.secondary,
  },
});

// Настройка URL-ссылок для навигации
const linking = {
  prefixes: [
    // Префиксы для разных платформ
    'inflightapp://',
    'https://inflightapp.com',
    // Если мы запускаем локально в web
    'http://localhost:19006'
  ],
  config: {
    // Конфигурация навигации
    screens: {
      Login: 'login',
      MainApp: {
        screens: {
          [RouteName.CATALOG]: 'catalog',
          [RouteName.CART]: 'cart',
          [RouteName.PROFILE]: 'profile',
        }
      },
      AdminRoot: {
        screens: {
          [RouteName.ADMIN_PANEL]: 'admin'
        }
      },
      ProductDetails: 'product/:id',
      OrderStatus: 'order/:id',
      OrderDetails: 'order-details/:id',
      // Добавляем прямые ссылки на экраны для доступа по имени компонента
      CatalogScreen: 'CatalogScreen',
      CartScreen: 'CartScreen',
      ProfileScreen: 'ProfileScreen',
      LoginScreen: 'LoginScreen',
      AdminPanel: 'AdminPanel',
      ProductDetailsScreen: 'ProductDetailsScreen/:id',
      OrderStatusScreen: 'OrderStatusScreen/:id',
      OrderDetailsScreen: 'OrderDetailsScreen/:id',
      PaymentScreen: 'PaymentScreen/:amount?',
      OrderHistoryScreen: 'OrderHistoryScreen',
      SupportScreen: 'SupportScreen',
    }
  },
  // Обработка URL, которые не соответствуют конфигурации
  getStateFromPath: (path: string, options: any) => {
    // Проверяем, соответствует ли путь имени компонента
    const componentNames = [
      RouteName.CATALOG_SCREEN,
      RouteName.CART_SCREEN,
      RouteName.PROFILE_SCREEN,
      RouteName.LOGIN_SCREEN,
      RouteName.ADMIN_PANEL,
      RouteName.PRODUCT_DETAILS_SCREEN,
      RouteName.ORDER_STATUS_SCREEN,
      RouteName.ORDER_DETAILS_SCREEN,
      RouteName.PAYMENT_SCREEN,
      RouteName.ORDER_HISTORY_SCREEN,
      RouteName.SUPPORT_SCREEN
    ];
    
    // Проверка на соответствие имени компонента
    const componentMatch = componentNames.find(name => path.startsWith(name));
    
    if (componentMatch) {
      // Извлекаем параметры из пути, если они есть
      const params: Record<string, string> = {};
      const segments = path.split('/');
      
      if (segments.length > 1) {
        if (['ProductDetailsScreen', 'OrderStatusScreen', 'OrderDetailsScreen'].includes(componentMatch)) {
          params.id = segments[1];
        } else if (componentMatch === 'PaymentScreen') {
          params.amount = segments[1];
        }
      }
      
      // Создаем соответствующее состояние навигации
      return {
        routes: [
          {
            name: componentMatch,
            params
          }
        ]
      };
    }
    
    // Используем стандартную обработку URL
    return getStateFromPathDefault(path, options);
  }
};

// Main tab navigator for authenticated users
const MainTabNavigator = ({ seatNumber }: { seatNumber: string }) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean, color: string, size: number }) => {
          let iconName: any = 'home';

          if (route.name === RouteName.CATALOG) {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === RouteName.CART) {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === RouteName.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <IoniconsIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
        tabBarLabelStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.onSurface,
      })}
    >
      <Tab.Screen
        name={RouteName.CATALOG}
        component={CatalogScreen}
        options={{ title: t('navigation.catalog') }}
      />
      <Tab.Screen
        name={RouteName.CART}
        component={CartScreen}
        initialParams={{ seatNumber }}
        options={{ title: t('navigation.cart') }}
      />
      <Tab.Screen
        name={RouteName.PROFILE}
        component={ProfileScreen}
        initialParams={{ seatNumber }}
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

// Admin navigator
const AdminNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen
        name={RouteName.ADMIN_PANEL}
        component={AdminPanel}
        options={{ headerShown: false, title: t('navigation.admin') }}
      />
    </Stack.Navigator>
  );
};

// Root Stack Navigator, который включает все экраны
const RootStackNavigator = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [seatNumber, setSeatNumber] = useState('');

  // Mock authentication check - in a real app, this would check for a valid token
  useEffect(() => {
    // Simulate checking auth status
    const checkAuthStatus = async () => {
      // In a real app, check for a stored token or session
      const mockAuthCheck = async () => {
        return new Promise<{isAuth: boolean, isAdmin: boolean}>(resolve => {
          setTimeout(() => {
            // For demo purposes, we're setting the user as not authenticated
            resolve({ isAuth: false, isAdmin: false });
          }, 1000);
        });
      };

      const { isAuth, isAdmin } = await mockAuthCheck();
      setIsLoggedIn(isAuth);
      setIsAdmin(isAdmin);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.dispatch(StackActions.replace(isAdmin ? 'AdminRoot' : 'MainApp'));
    }
  }, [isLoggedIn, isAdmin, navigation]);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.onSurface,
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      {/* Аутентификация */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
        initialParams={{
          onLogin: (isAdmin: boolean, seat: string) => {
            setIsLoggedIn(true);
            setIsAdmin(isAdmin);
            setSeatNumber(seat);
            navigation.dispatch(StackActions.replace(isAdmin ? 'AdminRoot' : 'MainApp'));
          },
        }}
      />
      
      {/* Основные экраны приложения */}
      <Stack.Screen name={RouteName.MAIN_APP} options={{ headerShown: false }}>
        {() => <MainTabNavigator seatNumber={seatNumber} />}
      </Stack.Screen>
      
      {/* Админ-панель */}
      <Stack.Screen
        name={RouteName.ADMIN_ROOT}
        component={AdminNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Экраны доступные для всех */}
      <Stack.Screen
        name={RouteName.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
        options={{ title: t('productDetails.title') }}
      />
      <Stack.Screen
        name={RouteName.ORDER_STATUS}
        component={OrderStatusScreen}
        options={{ title: t('orderStatus.title') }}
      />
      <Stack.Screen
        name={RouteName.ORDER_DETAILS}
        component={OrderDetailsScreen}
        options={{ title: t('orderDetails.title') }}
      />
      
      {/* Прямой доступ к компонентам по их именам */}
      <Stack.Screen
        name={RouteName.CATALOG_SCREEN}
        component={CatalogScreen}
        options={{ title: t('navigation.catalog') }}
      />
      <Stack.Screen
        name={RouteName.CART_SCREEN}
        component={CartScreen}
        options={{ title: t('navigation.cart') }}
      />
      <Stack.Screen
        name={RouteName.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{ title: t('navigation.profile') }}
        initialParams={{ seatNumber }}
      />
      <Stack.Screen
        name={RouteName.LOGIN_SCREEN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RouteName.ADMIN_PANEL}
        component={AdminPanel}
        options={{ title: t('navigation.admin') }}
      />
      <Stack.Screen
        name={RouteName.PRODUCT_DETAILS_SCREEN}
        component={ProductDetailsScreen}
        options={{ title: t('productDetails.title') }}
      />
      <Stack.Screen
        name={RouteName.ORDER_STATUS_SCREEN}
        component={OrderStatusScreen}
        options={{ title: t('orderStatus.title') }}
      />
      <Stack.Screen
        name={RouteName.ORDER_DETAILS_SCREEN}
        component={OrderDetailsScreen}
        options={{ title: t('orderDetails.title') }}
      />
      <Stack.Screen
        name={RouteName.PAYMENT_SCREEN}
        component={PaymentScreen}
        options={{ title: t('payment.title') }}
        initialParams={seatNumber ? { seatNumber } : undefined}
      />
      <Stack.Screen
        name={RouteName.ORDER_HISTORY_SCREEN}
        component={OrderHistoryScreen}
        options={{ title: t('navigation.orderHistory') }}
        initialParams={{ seatNumber }}
      />
      <Stack.Screen
        name={RouteName.SUPPORT_SCREEN}
        component={SupportScreen}
        options={{ title: t('support.title') }}
      />
    </Stack.Navigator>
  );
};

// Main app component
const AppContent = () => {
  const { theme } = useThemeContext();
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme]);

  return (
    <CustomPaperProvider theme={theme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <MobileContainer>
        <NavigationContainer theme={navigationTheme} linking={linking}>
          <DeepLinkHandler />
          <RootStackNavigator />
        </NavigationContainer>
      </MobileContainer>
    </CustomPaperProvider>
  );
};

const App = () => {
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    initLanguage().finally(() => setLanguageReady(true));
  }, []);

  if (!languageReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
