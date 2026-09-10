import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { StatusView } from '../components/StatusView';
import type { Product } from '../data/types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useProductList } from '../hooks/useProductList';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const trimmedQuery = debouncedQuery.trim();
  const isSearchPending = query.trim() !== trimmedQuery;

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
  } = useProductList(debouncedQuery);

  function renderItem({ item }: { item: Product }) {
    return (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <SearchBar value={query} onChange={setQuery} />
      {isSearchPending ? (
        <Text style={styles.hint}>Searching…</Text>
      ) : trimmedQuery ? (
        <Text style={styles.hint}>
          {products.length} of {total} results for “{trimmedQuery}”
        </Text>
      ) : status === 'success' ? (
        <Text style={styles.hint}>
          {products.length} of {total} products
        </Text>
      ) : null}

      {status === 'loading' ? (
        <StatusView
          variant="loading"
          title={trimmedQuery ? 'Searching' : 'Loading products'}
          message={
            trimmedQuery
              ? `Looking for products that match “${trimmedQuery}”.`
              : 'Fetching the latest items from the catalog.'
          }
        />
      ) : null}

      {status === 'error' ? (
        <StatusView
          variant="error"
          title="Couldn't load products"
          message={error ?? 'Please try again.'}
          onRetry={retry}
        />
      ) : null}

      {status === 'empty' ? (
        <StatusView
          variant="empty"
          title={trimmedQuery ? 'No matches' : 'No products yet'}
          message={
            trimmedQuery
              ? `No products found for “${trimmedQuery}”. Try a different search.`
              : 'The catalog is empty right now. Pull to refresh or try again later.'
          }
          onRetry={trimmedQuery ? undefined : retry}
        />
      ) : null}

      {status === 'success' ? (
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hint: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  footer: {
    paddingVertical: 16,
  },
  footerSpacer: {
    height: 16,
  },
});
