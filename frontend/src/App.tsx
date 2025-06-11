import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, getStateFromPath as getStateFromPathDefault, useNavigation, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform } from 'react-native';
import { defaultTheme } from './theme';
import { IoniconsIcon } from './components/CustomIcons';
import CustomPaperProvider from './components/CustomPaperProvider';
import { useTranslation } from 'react-i18next';
import './i18n/i18n'; // Import i18n settings
import { initLanguage } from './i18n/i18n';
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

// Определение типов для навигации
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Login: { onLogin: (isAdmin: boolean, seatNumber: string) => void };
      MainApp: undefined;
      AdminRoot: undefined;
      ProductDetails: { id: string };
      OrderStatus: { orderId: string };
      CatalogScreen: undefined;
      CartScreen: undefined;
      ProfileScreen: undefined;
      LoginScreen: { onLogin: (isAdmin: boolean, seatNumber: string) => void };
      AdminPanel: undefined;
      ProductDetailsScreen: { id: string };
      OrderStatusScreen: { id: string };
      PaymentScreen: { amount?: number };
      OrderHistoryScreen: undefined;
      SupportScreen: undefined;
    }
  }
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create a customized navigation theme
const navigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: defaultTheme.colors.primary,
    background: defaultTheme.colors.background,
    card: defaultTheme.colors.surface,
    text: defaultTheme.colors.onSurface,
    border: defaultTheme.colors.outline,
    notification: defaultTheme.colors.secondary,
  },
};

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
      // Добавляем прямые ссылки на экраны для доступа по имени компонента
      CatalogScreen: 'CatalogScreen',
      CartScreen: 'CartScreen',
      ProfileScreen: 'ProfileScreen',
      LoginScreen: 'LoginScreen',
      AdminPanel: 'AdminPanel',
      ProductDetailsScreen: 'ProductDetailsScreen/:id',
      OrderStatusScreen: 'OrderStatusScreen/:id',
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
        if (['ProductDetailsScreen', 'OrderStatusScreen'].includes(componentMatch)) {
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
        tabBarActiveTintColor: defaultTheme.colors.primary,
        tabBarInactiveTintColor: defaultTheme.colors.outline,
        tabBarStyle: { 
          backgroundColor: defaultTheme.colors.surface,
          borderTopColor: defaultTheme.colors.surfaceVariant,
        },
        tabBarLabelStyle: {
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: defaultTheme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: defaultTheme.colors.onSurface,
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
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: defaultTheme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: defaultTheme.colors.onSurface,
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
          backgroundColor: defaultTheme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: defaultTheme.colors.onSurface,
        cardStyle: { backgroundColor: defaultTheme.colors.background }
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
        name={RouteName.PAYMENT_SCREEN}
        component={PaymentScreen}
        options={{ title: t('payment.title') }}
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
const App = () => {
  // Initialize language from storage
  useEffect(() => {
    initLanguage();
  }, []);

  return (
    <CustomPaperProvider theme={defaultTheme}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={defaultTheme.colors.background}
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

export default App; 
