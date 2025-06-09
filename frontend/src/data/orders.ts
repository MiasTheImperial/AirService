import { Order, OrderStatus } from '../types';

// Создание даты с указанным смещением в минутах относительно текущего времени
const getDate = (offsetMinutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - offsetMinutes);
  return date;
};

// Список заказов
export const orders: Order[] = [
  // Заказ №1 - Доставлен (завершен)
  {
    id: 'order-20231015-001',
    items: [
      {
        productId: 'food-2',
        name: 'Паста Карбонара',
        quantity: 1,
        price: 680,
      },
      {
        productId: 'drinks-1',
        name: 'Свежевыжатый апельсиновый сок',
        quantity: 1,
        price: 350,
      },
      {
        productId: 'desserts-1',
        name: 'Тирамису',
        quantity: 1,
        price: 420,
      }
    ],
    totalAmount: 1450,
    status: OrderStatus.COMPLETED,
    seatNumber: '12A',
    createdAt: getDate(120), // 2 часа назад
    updatedAt: getDate(90),  // 1.5 часа назад
    paymentMethod: 'card',
  },
  
  // Заказ №2 - В процессе доставки
  {
    id: 'order-20231015-002',
    items: [
      {
        productId: 'drinks-3',
        name: 'Кофе Американо',
        quantity: 2,
        price: 280,
      },
      {
        productId: 'snacks-1',
        name: 'Орешки ассорти',
        quantity: 1,
        price: 320,
      }
    ],
    totalAmount: 880,
    status: OrderStatus.DELIVERING,
    seatNumber: '12A',
    createdAt: getDate(45), // 45 минут назад
    updatedAt: getDate(30), // 30 минут назад
    paymentMethod: 'card',
  },
  
  // Заказ №3 - Готовится
  {
    id: 'order-20231015-003',
    items: [
      {
        productId: 'food-1',
        name: 'Куриное филе с овощами',
        quantity: 1,
        price: 750,
      },
      {
        productId: 'drinks-2',
        name: 'Минеральная вода',
        quantity: 1,
        price: 150,
      }
    ],
    totalAmount: 900,
    status: OrderStatus.PREPARING,
    seatNumber: '12A',
    createdAt: getDate(15), // 15 минут назад
    updatedAt: getDate(10), // 10 минут назад
    paymentMethod: 'card',
  },
  
  // Заказ №4 - Ожидает обработки
  {
    id: 'order-20231015-004',
    items: [
      {
        productId: 'alcohol-1',
        name: 'Вино красное сухое',
        quantity: 1,
        price: 750,
      },
      {
        productId: 'snacks-3',
        name: 'Сырная тарелка',
        quantity: 1,
        price: 680,
      }
    ],
    totalAmount: 1430,
    status: OrderStatus.PENDING,
    seatNumber: '12A',
    createdAt: getDate(5),  // 5 минут назад
    updatedAt: getDate(5),  // 5 минут назад
    paymentMethod: 'card',
  },
  
  // Заказ №5 - Отменен
  {
    id: 'order-20231014-001',
    items: [
      {
        productId: 'food-5',
        name: 'Вегетарианский салат',
        quantity: 1,
        price: 450,
      }
    ],
    totalAmount: 450,
    status: OrderStatus.CANCELLED,
    seatNumber: '12A',
    createdAt: getDate(1440), // 1 день назад
    updatedAt: getDate(1430), // 1 день назад минус 10 минут
    paymentMethod: 'card',
  },
  
  // Заказ №6 - Большой заказ (завершен)
  {
    id: 'order-20231013-001',
    items: [
      {
        productId: 'food-3',
        name: 'Стейк из говядины',
        quantity: 1,
        price: 1200,
      },
      {
        productId: 'alcohol-3',
        name: 'Виски',
        quantity: 1,
        price: 950,
      },
      {
        productId: 'desserts-3',
        name: 'Шоколадный фондан',
        quantity: 1,
        price: 450,
      },
      {
        productId: 'drinks-5',
        name: 'Смузи ягодный',
        quantity: 2,
        price: 380,
      }
    ],
    totalAmount: 3360,
    status: OrderStatus.COMPLETED,
    seatNumber: '12A',
    createdAt: getDate(2880), // 2 дня назад
    updatedAt: getDate(2820), // 2 дня назад минус 60 минут
    paymentMethod: 'card',
  }
];

// Получить заказы по ID пользователя

// Получить заказ по ID
export const getOrderById = (orderId: string): Order | undefined => {
  return orders.find(order => order.id === orderId);
};

// Получить последние заказы (с указанным лимитом)
export const getRecentOrders = (limit: number = 3): Order[] => {
  return [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

// Получить заказы по статусу
export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return orders.filter(order => order.status === status);
}; 