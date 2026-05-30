// src/app/(pharmacist)/reports.tsx
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
import { router } from 'expo-router';

// src/app/(pharmacist)/reports.tsx - تحديث Colors
const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#a8e7c5',  // ✅ تمت الإضافة
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e9e5',  // ✅ تمت الإضافة
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outlineVariant: '#bfc9c1',  // ✅ تمت الإضافة
  secondary: '#5a5f62',
  success: '#10b981',
};

// بيانات تجريبية للتقارير
const salesData = {
  today: 1250,
  week: 8750,
  month: 34200,
  year: 156800,
};

const topProducts = [
  { name: 'بانادول', sales: 250, revenue: 1250 },
  { name: 'فيتامين سي', sales: 180, revenue: 1440 },
  { name: 'أموكسيسيلين', sales: 120, revenue: 1440 },
];

export default function ReportsScreen() {
  const [period, setPeriod] = useState('week');

  const getSalesValue = () => {
    switch (period) {
      case 'today': return salesData.today;
      case 'week': return salesData.week;
      case 'month': return salesData.month;
      case 'year': return salesData.year;
      default: return salesData.week;
    }
  };

  const handleExport = () => {
    Alert.alert('تصدير التقرير', 'سيتم تصدير التقرير كملف PDF قريباً');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>التقارير</Text>
          <TouchableOpacity onPress={handleExport}>
            <Text style={styles.exportIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodSelector}>
          {['today', 'week', 'month', 'year'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === 'today' ? 'اليوم' : p === 'week' ? 'أسبوع' : p === 'month' ? 'شهر' : 'سنة'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.salesCard}>
          <Text style={styles.salesTitle}>إجمالي المبيعات</Text>
          <Text style={styles.salesValue}>{getSalesValue()}₪</Text>
          <Text style={styles.salesChange}>▲ +15% عن الفترة السابقة</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>عدد الطلبات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>منتج مباع</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>عميل جديد</Text>
          </View>
        </View>

        <View style={styles.topProductsCard}>
          <Text style={styles.cardTitle}>💊 أكثر المنتجات مبيعاً</Text>
          {topProducts.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productRank}>{index + 1}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSales}>{product.sales} مبيعات</Text>
              </View>
              <Text style={styles.productRevenue}>{product.revenue}₪</Text>
            </View>
          ))}
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
  exportIcon: { fontSize: 20, color: Colors.primary },
  periodSelector: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, gap: 8 },
  periodButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh },
  periodButtonActive: { backgroundColor: Colors.primary },
  periodText: { fontSize: 12, color: Colors.onSurfaceVariant },
  periodTextActive: { color: Colors.onPrimary },
  salesCard: { backgroundColor: Colors.primary, marginHorizontal: 20, padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  salesTitle: { fontSize: 14, color: Colors.onPrimaryContainer, marginBottom: 8 },
  salesValue: { fontSize: 36, fontWeight: 'bold', color: Colors.onPrimary, marginBottom: 8 },
  salesChange: { fontSize: 12, color: Colors.success },
  statsRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.secondary, marginTop: 4 },
  topProductsCard: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, padding: 16, borderRadius: 16, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 12 },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant },
  productRank: { width: 30, fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, color: Colors.onSurface },
  productSales: { fontSize: 11, color: Colors.secondary },
  productRevenue: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
});
