import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

const STORAGE_KEY = 'cartItems';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setItems(JSON.parse(json));
        }
      } catch (e) {
        console.warn('Failed to load cart', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(e => {
      console.warn('Failed to save cart', e);
    });
  }, [items]);

  const addItem = (item: OrderItem) => {
    setItems(curr => {
      const existing = curr.find(i => i.productId === item.productId);
      if (existing) {
        return curr.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...curr, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(curr => curr.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(curr =>
      curr.map(i => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
