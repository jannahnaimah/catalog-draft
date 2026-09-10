import { StyleSheet, Text, View } from 'react-native';

export function ProductListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product catalog</Text>
      <Text style={styles.subtitle}>List, search, and pagination will load here.</Text>
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
