import { StyleSheet, Text, View } from 'react-native';

export function ProductDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product detail</Text>
      <Text style={styles.subtitle}>Description, price, rating, and images will load here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
