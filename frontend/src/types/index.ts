export interface User {
  id: string;
  email: string;
  name: string;
  seatNumber?: string;
  role?: 'user' | 'admin';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  darkMode: boolean;
  notifications: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  inStock?: boolean;
  ingredients?: string | null;
  nutritionalInfo?: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
  } | null;
  allergens?: string[];
  weight?: string;
  volume?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  seatNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface AnalyticsData {
  totalSales: number;
  popularProducts: {
    productId: string;
    name: string;
    count: number;
  }[];
  salesByCategory: {
    category: string;
    amount: number;
  }[];
  recentOrders: Order[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'other';
  cardNumber?: string;
  expiryDate?: string;
  cardholderName?: string;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  read: boolean;
  createdAt: Date;
} 