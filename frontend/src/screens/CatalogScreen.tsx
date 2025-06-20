import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Card, Searchbar, Chip, Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { Product, Category } from '../types';
import { useTranslation } from 'react-i18next';
import { getCatalog, getCategories } from '../api/api';
import { formatPrice } from '../utils/currency';
import RouteName from '../navigation/routes';

const CatalogScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([getCatalog(), getCategories()]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [i18n.language]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() =>
        navigation.navigate(RouteName.PRODUCT_DETAILS as never, {
          product: item,
        } as never)
      }
    >
      <View style={styles.imageContainer}>
        <Card.Cover
          source={
            item.image
              ? { uri: item.image }
              : require('../assets/icon.png')
          }
          style={styles.cardImage}
        />
      </View>
      <Card.Content style={styles.cardContent}>
        <Text 
          numberOfLines={1} 
          ellipsizeMode="tail" 
          style={[styles.productName, { color: theme.colors.onSurface }]}
        >
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
          {formatPrice(item.price)}
        </Text>
        {item.description ? (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.productDescription, { color: theme.colors.onSurfaceVariant }]}
          >
            {item.description}
          </Text>
        ) : null}
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() =>
            navigation.navigate(RouteName.PRODUCT_DETAILS as never, {
              product: item,
            } as never)
          }
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          style={styles.viewButton}
          labelStyle={styles.viewButtonLabel}
        >
          {t('catalog.viewDetails')}
        </Button>
      </Card.Actions>
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
      
      <Searchbar
        placeholder={t('common.search')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[
          styles.searchBar,
          { borderColor: theme.colors.primary, borderWidth: 1 },
        ]}
        iconColor={theme.colors.primary}
        inputStyle={{ color: theme.colors.onSurface }}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      
      <View style={styles.categoriesContainer}>
        <Text style={[styles.categoriesTitle, { color: theme.colors.onSurface }]}>
          {t('catalog.categories')}
        </Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(
                selectedCategory === item.id ? null : item.id
              )}
              style={styles.chip}
              selectedColor={theme.colors.primary}
              textStyle={{ color: selectedCategory === item.id ? theme.colors.onPrimary : theme.colors.onSurface }}
              avatar={
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require('../assets/icon.png')
                  }
                  style={styles.categoryImage}
                />
              }
            >
              {item.name}
            </Chip>
          )}
          style={styles.categoriesList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          numColumns={2}
          columnWrapperStyle={styles.productsRow}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.onBackground }}>{t('catalog.noProducts')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  categoriesContainer: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesList: {
    maxHeight: 50,
  },
  categoryImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  productsList: {
    padding: 5,
  },
  productsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  card: {
    width: '48%',
    marginBottom: 10,
    height: 280, // Fixed height for all cards
  },
  imageContainer: {
    height: 120, // Fixed height for image container
    overflow: 'hidden',
  },
  cardImage: {
    height: '100%',
  },
  cardContent: {
    paddingVertical: 8,
    height: 90, // Fixed height for content area
  },
  cardActions: {
    justifyContent: 'center',
    paddingBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 4,
    height: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    width: '100%',
  },
  viewButtonLabel: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default CatalogScreen; 