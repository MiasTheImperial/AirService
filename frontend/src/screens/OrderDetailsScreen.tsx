import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getOrder } from '../api/api';
import { Order, OrderItem, OrderStatus } from '../types';

const OrderDetailsScreen = ({ route }: any) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrder(route.params.orderId);
        setOrder(data);
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [route.params.orderId]);

  const getStatusLabel = (status: OrderStatus) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('orderStatus.orderNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={`${t('orderStatus.orderNumber')}: ${order.id}`} />
        <Card.Content>
          <Text>{t('orderStatus.orderStatus')}: {getStatusLabel(order.status)}</Text>
          <Text>
            {t('orderStatus.orderTotal')}: {order.totalAmount.toFixed(2)} {t('common.currency')}
          </Text>
          <Text>{t('profile.seatNumber')}: {order.seatNumber}</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={t('orderStatus.orderItems')} />
        <Card.Content>
          {order.items.map((item: OrderItem) => (
            <List.Item
              key={item.productId}
              title={`${item.name} x${item.quantity}`}
              description={`${(item.price * item.quantity).toFixed(2)} ${t('common.currency')}`}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 10,
  },
});

export default OrderDetailsScreen;
