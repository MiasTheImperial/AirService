import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, getStateFromPath as getStateFromPathDefault, useNavigation } from '@react-navigation/native';
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
          [encodeURI('Каталог товаров')]: 'catalog',
          [encodeURI('Корзина')]: 'cart',
          [encodeURI('Профиль')]: 'profile',
        }
      },
      AdminRoot: {
        screens: {
          [encodeURI('Админ-панель')]: 'admin'
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
    }
  },
  // Обработка URL, которые не соответствуют конфигурации
  getStateFromPath: (path: string, options: any) => {
    // Проверяем, соответствует ли путь имени компонента
    const componentNames = [
      'CatalogScreen', 'CartScreen', 'ProfileScreen', 'LoginScreen',
      'AdminPanel', 'ProductDetailsScreen', 'OrderStatusScreen', 'PaymentScreen',
      'OrderHistoryScreen'
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

          if (route.name === t('navigation.catalog')) {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === t('navigation.cart')) {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === t('navigation.profile')) {
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
      <Tab.Screen name={t('navigation.catalog')} component={CatalogScreen} />
      <Tab.Screen name={t('navigation.cart')} component={CartScreen} />
      <Tab.Screen
        name={t('navigation.profile')}
        component={ProfileScreen}
        initialParams={{ seatNumber }}
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
        name={t('navigation.admin')} 
        component={AdminPanel} 
        options={{ headerShown: false }} 
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
      navigation.replace(isAdmin ? 'AdminRoot' : 'MainApp');
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
            navigation.replace(isAdmin ? 'AdminRoot' : 'MainApp');
          },
        }}
      />
      
      {/* Основные экраны приложения */}
      <Stack.Screen name="MainApp" options={{ headerShown: false }}>
        {() => <MainTabNavigator seatNumber={seatNumber} />}
      </Stack.Screen>
      
      {/* Админ-панель */}
      <Stack.Screen 
        name="AdminRoot" 
        component={AdminNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Экраны доступные для всех */}
      <Stack.Screen 
        name="ProductDetails"
        component={ProductDetailsScreen} 
        options={{ title: t('productDetails.title') }}
      />
      <Stack.Screen 
        name="OrderStatus"
        component={OrderStatusScreen} 
        options={{ title: t('orderStatus.title') }}
      />
      
      {/* Прямой доступ к компонентам по их именам */}
      <Stack.Screen 
        name="CatalogScreen" 
        component={CatalogScreen} 
        options={{ title: t('navigation.catalog') }}
      />
      <Stack.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ title: t('navigation.cart') }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: t('navigation.profile') }}
        initialParams={{ seatNumber }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AdminPanel" 
        component={AdminPanel} 
        options={{ title: t('navigation.admin') }}
      />
      <Stack.Screen 
        name="ProductDetailsScreen" 
        component={ProductDetailsScreen} 
        options={{ title: t('productDetails.title') }}
      />
      <Stack.Screen 
        name="OrderStatusScreen" 
        component={OrderStatusScreen} 
        options={{ title: t('orderStatus.title') }}
      />
      <Stack.Screen 
        name="PaymentScreen" 
        component={PaymentScreen} 
        options={{ title: t('payment.title') }}
      />
      <Stack.Screen
        name="OrderHistoryScreen"
        component={OrderHistoryScreen}
        options={{ title: t('navigation.orderHistory') }}
        initialParams={{ seatNumber }}
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
