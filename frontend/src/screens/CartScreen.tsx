import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import { Card, Button, Text, TextInput, Divider, useTheme } from 'react-native-paper';
import { OrderItem, PaymentMethod } from '../types';
import PaymentForm from '../components/PaymentForm';
import { useTranslation } from 'react-i18next';
import DirectLinkButton from '../components/DirectLinkButton';
import { createOrder } from '../api/api';
import RouteName from '../navigation/routes';

const CartScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [seatNumber, setSeatNumber] = useState(route.params?.seatNumber || '');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const newItem: OrderItem | undefined = route.params?.newItem;
    if (newItem) {
      setCartItems(items => [...items, newItem]);
      navigation.setParams({ newItem: undefined });
    }
  }, [route.params?.newItem]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (!seatNumber) {
      // Show error message
      return;
    }

    // Show payment form
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentMethod: PaymentMethod) => {
    setShowPaymentModal(false);
    setLoading(true);

    try {
      const payload = {
        seat: seatNumber,
        items: cartItems.map((i) => ({
          item_id: Number(i.productId),
          quantity: i.quantity,
        })),
        payment_method: paymentMethod.type,
      };
      const res = await createOrder(payload);
      const orderId = res.order_id;
      setCartItems([]);
      navigation.navigate(RouteName.ORDER_STATUS as never, {
        orderId: String(orderId),
      } as never);
    } catch (err) {
      console.error('Failed to create order', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {cartItems.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>{t('cart.empty')}</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate(RouteName.CATALOG as never)}
                style={styles.shopButton}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                {t('cart.continueShopping')}
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            {cartItems.map((item) => (
              <Card key={item.productId} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <View style={styles.itemRow}>
                    <Image
                      style={styles.itemImage}
                      source={
                        item.image
                          ? { uri: item.image }
                          : require('../assets/icon.png')
                      }
                    />
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                      <Text style={[styles.itemPrice, { color: theme.colors.onSurfaceVariant }]}>
                        {item.price * item.quantity} {t('common.currency')}
                      </Text>
                    </View>
                    <View style={styles.quantityControls}>
                      <Button
                        onPress={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        mode="text"
                        textColor={theme.colors.primary}
                      >
                        -
                      </Button>
                      <Text style={{ color: theme.colors.onSurface }}>{item.quantity}</Text>
                      <Button
                        onPress={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        mode="text"
                        textColor={theme.colors.primary}
                      >
                        +
                      </Button>
                    </View>
                  </View>
                  <Button 
                    onPress={() => handleRemoveItem(item.productId)}
                    mode="text"
                    compact
                    style={styles.removeButton}
                    textColor={theme.colors.error}
                  >
                    {t('cart.remove')}
                  </Button>
                </Card.Content>
              </Card>
            ))}

            <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

            <View style={styles.seatNumberContainer}>
              <TextInput
                label={t('auth.seatNumber')}
                value={seatNumber}
                onChangeText={setSeatNumber}
                style={styles.seatNumberInput}
                placeholder="12A"
                mode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />
            </View>

            <View style={styles.totalContainer}>
              <Text style={[styles.totalText, { color: theme.colors.onSurface }]}>{t('common.total')}:</Text>
              <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
                {calculateTotal()} {t('common.currency')}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleCheckout}
              loading={loading}
              disabled={cartItems.length === 0 || !seatNumber}
              style={styles.checkoutButton}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              {t('cart.checkout')}
            </Button>
            
            <View style={styles.directLinkContainer}>
              <Text style={[styles.directLinkText, { color: theme.colors.onSurfaceVariant }]}>
                {t('payment.title')}:
              </Text>
              <DirectLinkButton
                screenName={RouteName.PAYMENT_SCREEN}
                params={{ amount: calculateTotal().toString() }}
                style={styles.directLinkButton}
              >
                {t('payment.payNow')} ({calculateTotal()} {t('common.currency')})
              </DirectLinkButton>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePaymentCancel}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <PaymentForm
              amount={calculateTotal()}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePaymentCancel}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  emptyCard: {
    margin: 10,
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    width: '50%',
    alignSelf: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
  },
  seatNumberContainer: {
    padding: 10,
  },
  seatNumberInput: {
    backgroundColor: 'transparent',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    margin: 20,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  directLinkContainer: {
    margin: 20,
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 15,
    borderRadius: 8,
  },
  directLinkText: {
    fontSize: 16,
    marginBottom: 10,
  },
  directLinkButton: {
    marginTop: 5,
  },
});

export default CartScreen; 