import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, DataTable, Button, ActivityIndicator, Appbar } from 'react-native-paper';
import { AnalyticsData, Order, OrderStatus } from '../types';
import RouteName from '../navigation/routes';

const AdminPanel = ({ navigation }: any) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, this would fetch data from your backend
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        totalSales: 1250.75,
        popularProducts: [
          { productId: '1', name: 'Coffee', count: 42 },
          { productId: '2', name: 'Sandwich', count: 36 },
          { productId: '3', name: 'Headphones', count: 28 },
          { productId: '4', name: 'Magazine', count: 21 },
          { productId: '5', name: 'Chocolate', count: 19 },
        ],
        salesByCategory: [
          { category: 'Food', amount: 450.25 },
          { category: 'Drinks', amount: 325.50 },
          { category: 'Entertainment', amount: 275.00 },
          { category: 'Duty Free', amount: 200.00 },
        ],
        recentOrders: [
          {
            id: 'order1',
            items: [{ productId: '1', quantity: 2, price: 3.99 }],
            totalAmount: 7.98,
            status: OrderStatus.COMPLETED,
            seatNumber: '12A',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'order2',
            items: [{ productId: '3', quantity: 1, price: 25.99 }],
            totalAmount: 25.99,
            status: OrderStatus.DELIVERING,
            seatNumber: '14B',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'order3',
            items: [
              { productId: '2', quantity: 1, price: 5.99 },
              { productId: '4', quantity: 1, price: 9.99 },
            ],
            totalAmount: 15.98,
            status: OrderStatus.PREPARING,
            seatNumber: '8C',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      setAnalyticsData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (!analyticsData) return null;

    return (
      <View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sales Overview</Text>
            <Text style={styles.salesAmount}>${analyticsData.totalSales.toFixed(2)}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Popular Products</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title numeric>Orders</DataTable.Title>
              </DataTable.Header>

              {analyticsData.popularProducts.map((product) => (
                <DataTable.Row key={product.productId}>
                  <DataTable.Cell>{product.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{product.count}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sales by Category</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>

              {analyticsData.salesByCategory.map((category, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{category.category}</DataTable.Cell>
                  <DataTable.Cell numeric>${category.amount.toFixed(2)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderOrders = () => {
    if (!analyticsData) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Recent Orders</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Seat</DataTable.Title>
              <DataTable.Title>Amount</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>

            {analyticsData.recentOrders.map((order) => (
              <DataTable.Row
                key={order.id}
                onPress={() =>
                  navigation.navigate(RouteName.ORDER_DETAILS as never, {
                    orderId: order.id,
                  } as never)
                }
              >
                <DataTable.Cell>{order.id.substring(0, 8)}</DataTable.Cell>
                <DataTable.Cell>{order.seatNumber}</DataTable.Cell>
                <DataTable.Cell>${order.totalAmount.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell>{order.status}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    );
  };

  const renderInventory = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Inventory Management</Text>
          <Text>Inventory management functionality would be implemented here.</Text>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => console.log('Add product')}
          >
            Add New Product
          </Button>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Admin Panel" />
      </Appbar.Header>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'overview' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('overview')}
          style={styles.tabButton}
        >
          Overview
        </Button>
        <Button
          mode={activeTab === 'orders' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('orders')}
          style={styles.tabButton}
        >
          Orders
        </Button>
        <Button
          mode={activeTab === 'inventory' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('inventory')}
          style={styles.tabButton}
        >
          Inventory
        </Button>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'inventory' && renderInventory()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salesAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginVertical: 10,
  },
  actionButton: {
    marginTop: 20,
  },
});

export default AdminPanel; 