import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Switch, Button, List, Divider, useTheme } from 'react-native-paper';
import { useThemeContext } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { listOrders } from '../api/api';
import RouteName from '../navigation/routes';

const ProfileScreen = ({ navigation, route }: any) => {
  const seatNumber = route.params?.seatNumber as string;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDarkTheme, toggleTheme } = useThemeContext();
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
                value={isDarkTheme}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
          />

          <Divider style={{ backgroundColor: theme.colors.outline }} />

          <LanguageSelector />
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
            onPress={() =>
              navigation.navigate(RouteName.ORDER_HISTORY_SCREEN as never, {
                seatNumber,
              } as never)
            }
          />
          
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          
          <List.Item
            title={t('profile.savedPaymentMethods')}
            description={t('profile.paymentMethodsDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="credit-card" color={theme.colors.primary} />}
            onPress={() =>
              navigation.navigate(
                RouteName.PAYMENT_SCREEN as never,
                { seatNumber, items: [] } as never
              )
            }
          />
          
          <Divider style={{ backgroundColor: theme.colors.outline }} />
          
          <List.Item
            title={t('profile.helpSupport')}
            description={t('profile.helpSupportDescription')}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />}
            onPress={() => navigation.navigate(RouteName.SUPPORT_SCREEN as never)}
          />
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
