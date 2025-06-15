import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import PaymentForm from '../components/PaymentForm';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import RouteName from '../navigation/routes';
import { createOrder } from '../api/api';
import { PaymentMethod } from '../types';

// Интерфейс для параметров маршрута
interface PaymentScreenProps {
  route?: {
    params?: {
      amount?: number;
      seatNumber: string;
      items: { item_id: number; quantity: number }[];
    };
  };
}

/**
 * PaymentScreen - отдельный экран для формы оплаты
 * Доступен по прямой ссылке через имя компонента
 */
const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  // Устанавливаем сумму по умолчанию, если она не была передана
  const amount = route?.params?.amount || 1000;
  
  const handlePaymentComplete = async (paymentMethod: PaymentMethod) => {
    const params = route?.params;
    if (!params?.seatNumber || !params?.items) {
      console.error('Missing seat number or items for order creation');
      return;
    }

    try {
      const res = await createOrder({
        seat: params.seatNumber,
        items: params.items,
        payment_method: paymentMethod.type,
      });
      const orderId = res.order_id;
      navigation.navigate(RouteName.ORDER_STATUS as never, { orderId } as never);
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };
  
  const handleCancel = () => {
    // Возвращаемся назад при отмене
    navigation.goBack();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {t('payment.title')}
        </Text>
        
        <PaymentForm
          amount={amount}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleCancel}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default PaymentScreen; 
