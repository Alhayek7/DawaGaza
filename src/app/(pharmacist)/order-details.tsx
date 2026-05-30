// src/app/(pharmacist)/order-details.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
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
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ba1a1a',
};

const statusOptions = [
  { value: 'pending', label: 'قيد الانتظار', color: Colors.warning },
  { value: 'processing', label: 'قيد التحضير', color: Colors.primary },
  { value: 'completed', label: 'مكتمل', color: Colors.success },
  { value: 'cancelled', label: 'ملغي', color: Colors.error },
];

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  const [status, setStatus] = useState(params.status as string || 'pending');

  const order = {
    id: params.id || '1234',
    customer: params.customer || 'أحمد محمد',
    amount: params.amount || 45,
    date: params.date || '2026-05-28',
    items: params.items ? JSON.parse(params.items as string) : ['بانادول x2', 'فيتامين سي x1'],
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    Alert.alert('تم التحديث', `تم تغيير حالة الطلب إلى ${statusOptions.find(s => s.value === newStatus)?.label}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل الطلب</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>طلب #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusOptions.find(s => s.value === status)?.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusOptions.find(s => s.value === status)?.color }]}>
              {statusOptions.find(s => s.value === status)?.label}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>👤 معلومات العميل</Text>
          <Text style={styles.infoText}>الاسم: {order.customer}</Text>
          <Text style={styles.infoText}>تاريخ الطلب: {order.date}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💊 المنتجات</Text>
          {order.items.map((item: string, index: number) => (
            <Text key={index} style={styles.itemText}>• {item}</Text>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💰 إجمالي الطلب</Text>
          <Text style={styles.totalAmount}>{order.amount} شيكل</Text>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>تحديث حالة الطلب</Text>
          <View style={styles.statusOptions}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.statusOption, status === option.value && { backgroundColor: option.color + '20', borderColor: option.color }]}
                onPress={() => updateStatus(option.value)}
              >
                <Text style={[styles.statusOptionText, status === option.value && { color: option.color }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
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
  orderInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 16 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  infoCard: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  infoText: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 4 },
  itemText: { fontSize: 14, color: Colors.onSurface, marginBottom: 6 },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  statusSection: { marginHorizontal: 20, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 12 },
  statusOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statusOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant },
  statusOptionText: { fontSize: 12, color: Colors.onSurfaceVariant },
});