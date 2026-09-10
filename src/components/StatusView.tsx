import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../theme';

type StatusViewProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  variant: 'loading' | 'error' | 'empty';
};

export function StatusView({ title, message, onRetry, variant }: StatusViewProps) {
  return (
    <View
      style={[
        styles.container,
        variant === 'error' && styles.errorContainer,
        variant === 'empty' && styles.emptyContainer,
      ]}
    >
      {variant === 'loading' ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <View
          style={[
            styles.badge,
            variant === 'error' ? styles.errorBadge : styles.emptyBadge,
          ]}
        >
          <Text style={styles.badgeText}>{variant === 'error' ? '!' : '∅'}</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry"
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorContainer: {
    backgroundColor: colors.errorBg,
  },
  emptyContainer: {
    backgroundColor: colors.background,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorBadge: {
    backgroundColor: '#FECACA',
  },
  emptyBadge: {
    backgroundColor: colors.accentSoft,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
  retry: {
    marginTop: 20,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
