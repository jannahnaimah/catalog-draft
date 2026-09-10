import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from '../data/types';
import { formatPrice } from '../domain/viewState';
import { colors } from '../theme';
import { ProductImage } from './ProductImage';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ProductImage
        uri={product.thumbnail}
        style={styles.thumbnail}
        accessibilityLabel={`${product.title} thumbnail`}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.86,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  body: {
    flex: 1,
    minHeight: 76,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
});
