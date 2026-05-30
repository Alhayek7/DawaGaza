// src/app/(pharmacist)/customer-details.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outlineVariant: '#bfc9c1',  // ✅ تمت إضافة اللون المفقود
  secondary: '#5a5f62',
  success: '#10b981',
};

export default function CustomerDetailsScreen() {
  const params = useLocalSearchParams();

  // تحويل القيم من params إلى سلاسل نصية
  const getParamString = (value: string | string[] | undefined, defaultValue: string): string => {
    if (Array.isArray(value)) return value[0] || defaultValue;
    return value || defaultValue;
  };

  const getParamNumber = (value: string | string[] | undefined, defaultValue: number): number => {
    const str = getParamString(value, String(defaultValue));
    return parseInt(str) || defaultValue;
  };

  const customer = {
    id: getParamString(params.id, '1'),
    name: getParamString(params.name, 'أحمد محمد'),
    phone: getParamString(params.phone, '0591234567'),
    orders: getParamNumber(params.orders, 12),
    totalSpent: getParamNumber(params.totalSpent, 450),
    lastOrder: getParamString(params.lastOrder, '2026-05-28'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل العميل</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.customerCard}>
          <Text style={styles.customerIcon}>👤</Text>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>📞 {customer.phone}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{customer.orders}</Text>
            <Text style={styles.statLabel}>عدد الطلبات</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{customer.totalSpent}₪</Text>
            <Text style={styles.statLabel}>إجمالي المشتريات</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{customer.lastOrder}</Text>
            <Text style={styles.statLabel}>آخر طلب</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  customerCard: { backgroundColor: Colors.surfaceContainerLowest, margin: 20, padding: 24, borderRadius: 20, alignItems: 'center' },
  customerIcon: { fontSize: 64, marginBottom: 12 },
  customerName: { fontSize: 20, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 4 },
  customerPhone: { fontSize: 14, color: Colors.secondary },
  statsCard: { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, padding: 20, borderRadius: 16, justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.secondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: Colors.outlineVariant, marginHorizontal: 8 },
});