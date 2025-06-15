export enum RouteName {
  LOGIN = 'Login',
  MAIN_APP = 'MainApp',
  ADMIN_ROOT = 'AdminRoot',
  CATALOG = 'Catalog',
  CART = 'Cart',
  PROFILE = 'Profile',
  ADMIN_PANEL = 'AdminPanel',
  PRODUCT_DETAILS = 'ProductDetails',
  ORDER_STATUS = 'OrderStatus',
  CATALOG_SCREEN = 'CatalogScreen',
  CART_SCREEN = 'CartScreen',
  PROFILE_SCREEN = 'ProfileScreen',
  LOGIN_SCREEN = 'LoginScreen',
  PRODUCT_DETAILS_SCREEN = 'ProductDetailsScreen',
  ORDER_STATUS_SCREEN = 'OrderStatusScreen',
  PAYMENT_SCREEN = 'PaymentScreen',
  ORDER_HISTORY_SCREEN = 'OrderHistoryScreen',
  ORDER_DETAILS = 'OrderDetails',
  ORDER_DETAILS_SCREEN = 'OrderDetailsScreen',
  SUPPORT_SCREEN = 'SupportScreen'
}

// Stable paths for deep links
export const RoutePath: Record<RouteName, string> = {
  [RouteName.LOGIN]: 'login',
  [RouteName.MAIN_APP]: '',
  [RouteName.ADMIN_ROOT]: '',
  [RouteName.CATALOG]: 'catalog',
  [RouteName.CART]: 'cart',
  [RouteName.PROFILE]: 'profile',
  [RouteName.ADMIN_PANEL]: 'admin',
  [RouteName.PRODUCT_DETAILS]: 'product/:id',
  [RouteName.ORDER_STATUS]: 'order/:id',
  [RouteName.CATALOG_SCREEN]: 'CatalogScreen',
  [RouteName.CART_SCREEN]: 'CartScreen',
  [RouteName.PROFILE_SCREEN]: 'ProfileScreen',
  [RouteName.LOGIN_SCREEN]: 'LoginScreen',
  [RouteName.PRODUCT_DETAILS_SCREEN]: 'ProductDetailsScreen/:id',
  [RouteName.ORDER_STATUS_SCREEN]: 'OrderStatusScreen/:id',
  [RouteName.PAYMENT_SCREEN]: 'PaymentScreen/:amount?',
  [RouteName.ORDER_HISTORY_SCREEN]: 'OrderHistoryScreen',
  [RouteName.ORDER_DETAILS]: 'order-details/:id',
  [RouteName.ORDER_DETAILS_SCREEN]: 'OrderDetailsScreen/:id',
  [RouteName.SUPPORT_SCREEN]: 'SupportScreen'
};

export default RouteName;
