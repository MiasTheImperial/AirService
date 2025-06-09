import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Text, Switch, Button, List, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DirectLinkButton from '../components/DirectLinkButton';
import { listOrders } from '../api/api';

const ProfileScreen = ({ navigation, route }: any) => {
  const seatNumber = route.params?.seatNumber as string;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); // По умолчанию включен темный режим
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Mock user data
  const user = {
    email: 'user@example.com',
    name: 'Тестовый Пользователь'
  };

  // Получаем количество заказов для отображения
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await listOrders({ seat: seatNumber });
        setOrdersCount(data.length);
      } catch (err) {
        console.error('Ошибка при получении заказов:', err);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      // In a real app, this would call auth().signOut()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{t('profile.title')}</Text>
          <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>{user.email}</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{t('profile.preferences')}</Text>
          
          <List.Item
            title={t('profile.notifications')}
            description={t('profile.notificationsDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          
          <List.Item
            title={t('profile.darkMode')}
            description={t('profile.darkModeDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{t('profile.personalInfo')}</Text>
          
          <List.Item
            title={t('profile.orderHistory')}
            description={t('profile.orderHistoryDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="history" color={theme.colors.primary} />}
            right={props => <View style={styles.badgeContainer}>
              <Text style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                {ordersCount}
              </Text>
            </View>}
            onPress={() => navigation.navigate('OrderHistoryScreen', { seatNumber })}
          />
          
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          
          <List.Item
            title={t('profile.savedPaymentMethods')}
            description={t('profile.paymentMethodsDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="credit-card" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('PaymentScreen')}
          />
          
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          
          <List.Item
            title={t('profile.helpSupport')}
            description={t('profile.helpSupportDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('Support')}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Прямые ссылки на страницы
          </Text>
          
          <View style={styles.linksContainer}>
            <DirectLinkButton
              screenName="CatalogScreen"
              style={styles.linkButton}
            >
              {t('navigation.catalog')}
            </DirectLinkButton>
            
            <DirectLinkButton
              screenName="CartScreen"
              style={styles.linkButton}
            >
              {t('navigation.cart')}
            </DirectLinkButton>
            
            <DirectLinkButton
              screenName="OrderHistoryScreen"
              style={styles.linkButton}
              params={{ seatNumber }}
            >
              {t('navigation.orderHistory')}
            </DirectLinkButton>
            
            <DirectLinkButton
              screenName="PaymentScreen"
              style={styles.linkButton}
            >
              {t('payment.title')}
            </DirectLinkButton>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={theme.colors.primary}
      >
        {t('profile.logout')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoutButton: {
    margin: 16,
    marginTop: 0,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkButton: {
    width: '48%',
    marginBottom: 10,
  },
  badgeContainer: {
    justifyContent: 'center',
  },
  badge: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: 'center',
  }
});

export default ProfileScreen; 