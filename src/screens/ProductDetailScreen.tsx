import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProductImage } from '../components/ProductImage';
import { StatusView } from '../components/StatusView';
import { formatPrice, formatRating } from '../domain/viewState';
import { useProductDetail } from '../hooks/useProductDetail';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const { width: windowWidth } = Dimensions.get('window');

function RatingStars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.stars} accessibilityLabel={`Rating ${formatRating(rating)} out of 5`}>
        {'★'.repeat(filled)}
        {'☆'.repeat(Math.max(0, 5 - filled))}
      </Text>
      <Text style={styles.ratingValue}>{formatRating(rating)}</Text>
    </View>
  );
}

export function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const { product, status, error, retry } = useProductDetail(productId);
  const [imageIndex, setImageIndex] = useState(0);

  useLayoutEffect(() => {
    if (product?.title) {
      navigation.setOptions({ title: product.title });
    }
  }, [navigation, product?.title]);

  if (status === 'loading') {
    return (
      <StatusView
        variant="loading"
        title="Loading product"
        message="Getting the full description, rating, and photos."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusView
        variant="error"
        title="Couldn't load this product"
        message={error ?? 'Please try again.'}
        onRetry={retry}
      />
    );
  }

  if (status === 'empty' || !product) {
    return (
      <StatusView
        variant="empty"
        title="Product not found"
        message="This item is no longer in the catalog."
        onRetry={retry}
      />
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
          setImageIndex(index);
        }}
      >
        {images.map((uri, index) => (
          <ProductImage
            key={`${uri}-${index}`}
            uri={uri}
            style={styles.hero}
            accessibilityLabel={`${product.title} photo ${index + 1}`}
          />
        ))}
      </ScrollView>
      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((uri, index) => (
            <View
              key={`${uri}-dot-${index}`}
              style={[styles.dot, index === imageIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <RatingStars rating={product.rating} />
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    width: windowWidth,
    height: 320,
    backgroundColor: colors.placeholder,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 18,
  },
  card: {
    margin: 16,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: colors.accent,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  stars: {
    fontSize: 18,
    color: '#F59E0B',
    letterSpacing: 2,
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});
