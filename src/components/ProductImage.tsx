import { Image, type ImageStyle } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme';

type ProductImageProps = {
  uri?: string;
  style?: StyleProp<ViewStyle | ImageStyle>;
  accessibilityLabel?: string;
};

export function ProductImage({ uri, style, accessibilityLabel }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  const showFallback = !uri || failed;

  if (showFallback) {
    return (
      <View style={[styles.fallback, style]} accessibilityLabel="Image unavailable">
        <Text style={styles.fallbackText}>No image</Text>
      </View>
    );
  }

  return (
    <View style={[styles.frame, style]}>
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        accessibilityLabel={accessibilityLabel}
        onError={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.placeholder,
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
});
