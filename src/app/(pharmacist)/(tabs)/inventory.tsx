// src/app/(pharmacist)/(tabs)/inventory.tsx
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  primary: '#0f5238',
  surface: '#f8faf6',
  onSurface: '#191c1a',
};

export default function InventoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.icon}>📦</Text>
        <Text style={styles.title}>إدارة المخزون</Text>
        <Text style={styles.subtitle}>قيد التطوير</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  subtitle: { fontSize: 14, color: Colors.onSurface, marginTop: 8 },
});