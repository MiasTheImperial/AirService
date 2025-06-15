import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button, Text, Card, Snackbar, Divider, List, useTheme } from 'react-native-paper';
import { MaterialCommunityIcon } from '../components/CustomIcons';
import { Product, OrderItem } from '../types';
import RouteName from '../navigation/routes';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState<OrderItem | null>(null);
  const { t } = useTranslation();
  const theme = useTheme();

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart state manager or context
    // For now, we'll just show a snackbar and store the item temporarily
    const item: OrderItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    };

    setPendingItem(item);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Cover
          source={
            product.image
              ? { uri: product.image }
              : require('../assets/icon.png')
          }
          style={styles.image}
        />
        <Card.Content>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>{product.name}</Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>{formatPrice(product.price)}</Text>
          </View>
          
          {product.description ? (
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {product.description}
            </Text>
          ) : null}
          
          {product.inStock === false && (
            <View style={[styles.outOfStockBadge, { backgroundColor: theme.colors.error }]}>
              <Text style={styles.outOfStockText}>{t('catalog.outOfStock')}</Text>
            </View>
          )}

          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          {product.ingredients && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{t('productDetails.ingredients')}</Text>
              <Text style={[styles.sectionText, { color: theme.colors.onSurfaceVariant }]}>{product.ingredients}</Text>
              <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            </View>
          )}
          
          {product.nutritionalInfo && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{t('productDetails.nutritionalInfo')}</Text>
              <List.Item
                title={t('productDetails.calories')}
                titleStyle={{ color: theme.colors.onSurface }}
                right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.nutritionalInfo?.calories} kcal</Text>}
              />
              <List.Item
                title={t('productDetails.proteins')}
                titleStyle={{ color: theme.colors.onSurface }}
                right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.nutritionalInfo?.proteins} g</Text>}
              />
              <List.Item
                title={t('productDetails.fats')}
                titleStyle={{ color: theme.colors.onSurface }}
                right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.nutritionalInfo?.fats} g</Text>}
              />
              <List.Item
                title={t('productDetails.carbs')}
                titleStyle={{ color: theme.colors.onSurface }}
                right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.nutritionalInfo?.carbs} g</Text>}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            </View>
          )}
          
          {product.allergens && product.allergens.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{t('productDetails.allergens')}</Text>
              <Text style={[styles.sectionText, { color: theme.colors.onSurfaceVariant }]}>{product.allergens.join(', ')}</Text>
              <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            </View>
          )}
          
          {(product.weight || product.volume) && (
            <View>
              {product.weight && (
                <List.Item
                  title={t('productDetails.weight')}
                  titleStyle={{ color: theme.colors.onSurface }}
                  right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.weight}</Text>}
                />
              )}
              {product.volume && (
                <List.Item
                  title={t('productDetails.volume')}
                  titleStyle={{ color: theme.colors.onSurface }}
                  right={() => <Text style={{ color: theme.colors.onSurfaceVariant }}>{product.volume}</Text>}
                />
              )}
              <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            </View>
          )}

          <View style={styles.quantityContainer}>
            <Text style={[styles.quantityLabel, { color: theme.colors.onSurface }]}>{t('common.quantity')}:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
                style={[
                  styles.quantityButton, 
                  { backgroundColor: theme.colors.surfaceVariant },
                  quantity <= 1 && styles.quantityButtonDisabled
                ]}
              >
                <MaterialCommunityIcon 
                  name="minus" 
                  size={20} 
                  color={quantity <= 1 ? theme.colors.outline : theme.colors.onSurfaceVariant} 
                />
              </TouchableOpacity>
              <Text style={[styles.quantity, { color: theme.colors.onSurface }]}>{quantity}</Text>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(1)}
                style={[styles.quantityButton, { backgroundColor: theme.colors.surfaceVariant }]}
              >
                <MaterialCommunityIcon name="plus" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>{t('common.total')}:</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
              {formatPrice(product.price * quantity)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleAddToCart}
        style={styles.addButton}
        disabled={product.inStock === false}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        {t('productDetails.addToCart')}
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
        action={{
          label: t('navigation.cart'),
          onPress: () => {
            setSnackbarVisible(false);
            if (pendingItem) {
              navigation.navigate(RouteName.CART as never, { newItem: pendingItem } as never);
              setPendingItem(null);
            }
          },
        }}
        style={{ backgroundColor: theme.colors.surfaceVariant }}
        theme={{
          colors: {
            accent: theme.colors.primary,
            surface: theme.colors.surfaceVariant,
            onSurface: theme.colors.onSurfaceVariant,
          },
        }}
      >
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          {t('cart.added', { count: quantity })}
        </Text>
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  image: {
    height: 250,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 24,
  },
  outOfStockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  outOfStockText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    margin: 10,
    marginBottom: 20,
    paddingVertical: 8,
  },
});

export default ProductDetailsScreen; 