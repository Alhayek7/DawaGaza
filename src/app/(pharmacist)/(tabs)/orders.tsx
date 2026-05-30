// src/app/(pharmacist)/orders.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// src/app/(pharmacist)/orders.tsx - تحديث Colors
const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e9e5',  // ✅ تمت الإضافة
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ba1a1a',
};


// بيانات تجريبية للطلبات
const initialOrders = [
  { id: '1234', customer: 'أحمد محمد', amount: 45, status: 'pending', date: '2026-05-28', items: ['بانادول x2', 'فيتامين سي x1'] },
  { id: '1233', customer: 'سارة خالد', amount: 32, status: 'processing', date: '2026-05-28', items: ['أدول x3'] },
  { id: '1232', customer: 'محمد علي', amount: 78, status: 'completed', date: '2026-05-27', items: ['أموكسيسيلين x2', 'سبازمو x1'] },
  { id: '1231', customer: 'نورا أحمد', amount: 22, status: 'cancelled', date: '2026-05-27', items: ['فيتامين سي x1'] },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'قيد التحضير';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.primary;
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.secondary;
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const handleOrderPress = (order: any) => {
    router.push({
      pathname: '/(pharmacist)/order-details',
      params: { id: order.id, ...order }
    });
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>طلب #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.orderCustomer}>👤 {item.customer}</Text>
      <Text style={styles.orderDate}>📅 {item.date}</Text>
      <Text style={styles.orderItems}>💊 {item.items.join('، ')}</Text>
      <Text style={styles.orderAmount}>💰 {item.amount} شيكل</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الطلبات</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.tabs}>
        {['all', 'pending', 'processing', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? 'الكل' : getStatusText(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, color: Colors.onSurfaceVariant },
  activeTabText: { color: Colors.onPrimary },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  orderCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16, marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '600' },
  orderCustomer: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 4 },
  orderDate: { fontSize: 12, color: Colors.secondary, marginBottom: 4 },
  orderItems: { fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 8 },
  orderAmount: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
});