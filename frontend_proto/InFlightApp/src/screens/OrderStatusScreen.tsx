import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { Order, OrderStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { getOrderById } from '../data/orders';

const OrderStatusScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Эмуляция загрузки данных с сервера
    const loadOrder = async () => {
      try {
        setLoading(true);
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Получаем заказ из данных
        const foundOrder = getOrderById(route.params.orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Если заказ не найден в данных, создаем mock-заказ с ID из параметров
          // Это для случая, когда мы приходим на экран после оплаты
          const mockOrder: Order = {
            id: route.params.orderId,
            userId: 'user123',
            items: [
              {
                productId: 'drinks-3',
                name: 'Кофе Американо',
                quantity: 2,
                price: 280,
              },
              {
                productId: 'food-1',
                name: 'Куриное филе с овощами',
                quantity: 1,
                price: 750,
              },
            ],
            totalAmount: 1310,
            status: OrderStatus.PREPARING,
            seatNumber: '12A',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOrder(mockOrder);
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [route.params.orderId]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return theme.colors.tertiary;
      case OrderStatus.PREPARING:
        return theme.colors.primary;
      case OrderStatus.DELIVERING:
        return theme.colors.secondary;
      case OrderStatus.COMPLETED:
        return theme.colors.secondary;
      case OrderStatus.CANCELLED:
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return t('orderStatus.pending');
      case OrderStatus.PREPARING:
        return t('orderStatus.preparing');
      case OrderStatus.DELIVERING:
        return t('orderStatus.delivering');
      case OrderStatus.COMPLETED:
        return t('orderStatus.completed');
      case OrderStatus.CANCELLED:
        return t('orderStatus.cancelled');
      default:
        return status;
    }
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>{t('orderStatus.orderNotFound')}</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Catalog')}
          style={styles.button}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          {t('common.back')}
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.orderId, { color: theme.colors.onSurface }]}>
            {t('orderStatus.orderNumber')} #{order.id}
          </Text>
          <Text style={[styles.orderDate, { color: theme.colors.onSurfaceVariant }]}>
            {t('orderStatus.orderDate')}: {formatDate(order.createdAt)}
          </Text>
          <Text style={[styles.seatNumber, { color: theme.colors.onSurface }]}>
            {t('orderStatus.deliveryTo')}: {order.seatNumber}
          </Text>
          
          <View style={styles.statusContainer}>
            <Text style={[styles.statusLabel, { color: theme.colors.onSurface }]}>
              {t('orderStatus.orderStatus')}:
            </Text>
            <Text
              style={[
                styles.status,
                { color: getStatusColor(order.status) },
              ]}
            >
              {getStatusText(order.status)}
            </Text>
          </View>

          <View style={styles.itemsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {t('orderStatus.orderItems')}:
            </Text>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.itemRow}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>{item.name}</Text>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>x{item.quantity}</Text>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  {item.price * item.quantity} {t('common.currency')}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.totalContainer, { borderTopColor: theme.colors.outline }]}>
            <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
              {t('common.total')}:
            </Text>
            <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
              {order.totalAmount} {t('common.currency')}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Catalog')}
          style={[styles.button, { flex: 1, marginRight: 8 }]}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          {t('catalog.title')}
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('OrderHistoryScreen')}
          style={[styles.button, { flex: 1, marginLeft: 8 }]}
          textColor={theme.colors.primary}
        >
          {t('navigation.orderHistory')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  seatNumber: {
    fontSize: 16,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default OrderStatusScreen; 