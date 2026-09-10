import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProductCard } from '../components/ProductCard';
import { StatusView } from '../components/StatusView';
import type { Product } from '../data/types';
import { useProductList } from '../hooks/useProductList';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const {
    products,
    total,
    status,
    error,
    isRefreshing,
    isLoadingMore,
    refresh,
    retry,
    loadMore,
  } = useProductList('');

  function renderItem({ item }: { item: Product }) {
    return (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      />
    );
  }

  if (status === 'loading') {
    return (
      <StatusView
        variant="loading"
        title="Loading products"
        message="Fetching the latest items from the catalog."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusView
        variant="error"
        title="Couldn't load products"
        message={error ?? 'Please try again.'}
        onRetry={retry}
      />
    );
  }

  if (status === 'empty') {
    return (
      <StatusView
        variant="empty"
        title="No products yet"
        message="The catalog is empty right now. Pull to refresh or try again later."
        onRetry={retry}
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={colors.accent}
        />
      }
      ListHeaderComponent={
        <Text style={styles.count}>
          {products.length} of {total} products
        </Text>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <View style={styles.footerSpacer} />
        )
      }
      contentContainerStyle={styles.list}
      testID="product-list"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  count: {
    marginHorizontal: 16,
    marginBottom: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 16,
  },
  footerSpacer: {
    height: 16,
  },
});
