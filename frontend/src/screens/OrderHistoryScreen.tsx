import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Divider, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { Order, OrderStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { listOrders } from '../api/api';
import RouteName from '../navigation/routes';

const OrderHistoryScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const seatNumber = route.params?.seatNumber as string;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Получение данных о заказах
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await listOrders({ seat: seatNumber, status: selectedFilter || undefined });
        setOrders((Array.isArray(data) ? data : []) as Order[]);
      } catch (err: any) {
        console.error('Ошибка при загрузке заказов:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Фильтрация заказов по статусу
  const filteredOrders = selectedFilter
    ? orders.filter(order => order.status === selectedFilter)
    : orders;

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

  // Получение цвета для статуса заказа
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

  // Получение текста для статуса заказа
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

  // Фильтры для статусов заказов
  const statusFilters = [
    { value: null, label: t('common.all') },
    { value: OrderStatus.PENDING, label: t('orderStatus.pending') },
    { value: OrderStatus.PREPARING, label: t('orderStatus.preparing') },
    { value: OrderStatus.DELIVERING, label: t('orderStatus.delivering') },
    { value: OrderStatus.COMPLETED, label: t('orderStatus.completed') },
    { value: OrderStatus.CANCELLED, label: t('orderStatus.cancelled') },
  ];

  // Рендер элемента заказа
  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card 
      style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
      onPress={() =>
        navigation.navigate(RouteName.ORDER_STATUS as never, {
          orderId: item.id,
        } as never)
      }
    >
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text style={[styles.orderId, { color: theme.colors.onSurface }]}>
            {t('orderStatus.orderNumber')} #{item.id}
          </Text>
          <Chip 
            style={{ backgroundColor: getStatusColor(item.status) + '20' }}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>
        
        <Text style={[styles.orderDate, { color: theme.colors.onSurfaceVariant }]}>
          {formatDate(item.createdAt)}
        </Text>
        
        <View style={styles.orderItems}>
          {item.items.slice(0, 2).map((orderItem, index) => (
            <Text 
              key={`${item.id}-${index}`} 
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.itemText, { color: theme.colors.onSurfaceVariant }]}
            >
              {orderItem.name} × {orderItem.quantity}
            </Text>
          ))}
          
          {item.items.length > 2 && (
            <Text style={[styles.moreItems, { color: theme.colors.onSurfaceVariant }]}>
              ... {t('orderStatus.moreItems', { count: item.items.length - 2 })}
            </Text>
          )}
        </View>
        
        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
        
        <View style={styles.orderFooter}>
          <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
            {t('common.total')}:
          </Text>
          <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
            {item.totalAmount} {t('common.currency')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filtersContainer}>
        <Text style={[styles.filtersTitle, { color: theme.colors.onSurface }]}>
          {t('orderStatus.filterByStatus')}:
        </Text>
        <FlatList
          horizontal
          data={statusFilters}
          keyExtractor={(item) => item.value || 'all'}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item.value}
              onPress={() => setSelectedFilter(item.value)}
              style={[styles.filterChip, { 
                backgroundColor: selectedFilter === item.value 
                  ? theme.colors.primary + '20' 
                  : theme.colors.surfaceVariant 
              }]}
              textStyle={{ 
                color: selectedFilter === item.value 
                  ? theme.colors.primary 
                  : theme.colors.onSurfaceVariant 
              }}
            >
              {item.label}
            </Chip>
          )}
          style={styles.filtersList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.onBackground }}>
            {t('orderStatus.noOrders')}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate(RouteName.CATALOG as never)}
            style={styles.catalogButton}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            {t('catalog.title')}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filtersList: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  ordersList: {
    padding: 16,
    paddingTop: 0,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  catalogButton: {
    marginTop: 16,
  },
});

export default OrderHistoryScreen; 