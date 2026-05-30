// src/app/(pharmacist)/customers.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,  // ✅ تمت إضافة استيراد Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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

// بيانات تجريبية للعملاء
const initialCustomers = [
  { id: '1', name: 'أحمد محمد', phone: '0591234567', orders: 12, totalSpent: 450, lastOrder: '2026-05-28' },
  { id: '2', name: 'سارة خالد', phone: '0597654321', orders: 8, totalSpent: 320, lastOrder: '2026-05-27' },
  { id: '3', name: 'محمد علي', phone: '0591112222', orders: 5, totalSpent: 180, lastOrder: '2026-05-26' },
  { id: '4', name: 'نورا أحمد', phone: '0593334444', orders: 3, totalSpent: 95, lastOrder: '2026-05-25' },
];

export default function CustomersScreen() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.includes(searchQuery) || c.phone.includes(searchQuery)
  );

  const handleCustomerPress = (customer: any) => {
    // ✅ عرض تنبيه مؤقت حتى إنشاء صفحة تفاصيل العميل
    Alert.alert('تفاصيل العميل', `سيتم فتح تفاصيل العميل ${customer.name} قريباً`);
    // router.push({
    //   pathname: '/(pharmacist)/customer-details',
    //   params: { id: customer.id, ...customer }
    // });
  };

  const renderCustomer = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.customerCard} onPress={() => handleCustomerPress(item)}>
      <View style={styles.customerAvatar}>
        <Text style={styles.customerAvatarText}>👤</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>📞 {item.phone}</Text>
        <Text style={styles.customerStats}>📦 {item.orders} طلب • 💰 {item.totalSpent} شيكل</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>العملاء</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="بحث عن عميل..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
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
  searchContainer: { paddingHorizontal: 20, marginBottom: 12 },
  searchInput: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.outlineVariant },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  customerCard: { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16, marginBottom: 12, gap: 12 },
  customerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primaryContainer + '20', alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { fontSize: 24 },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 2 },
  customerPhone: { fontSize: 12, color: Colors.secondary, marginBottom: 4 },
  customerStats: { fontSize: 11, color: Colors.primary },
});