// src/app/(pharmacist)/index.tsx
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#a8e7c5',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e9e5',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  success: '#10b981',
  warning: '#f59e0b',
};

// بيانات تجريبية للإحصائيات
const stats = [
  { id: '1', title: 'مبيعات اليوم', value: '1,250₪', change: '+12%', icon: '💰', color: Colors.success },
  { id: '2', title: 'طلبات جديدة', value: '5', change: '+2', icon: '📦', color: Colors.primary },
  { id: '3', title: 'منتجات منخفضة', value: '8', change: 'تنبيه', icon: '⚠️', color: Colors.warning },
  { id: '4', title: 'عملاء جدد', value: '3', change: '+1', icon: '👥', color: Colors.secondary },
];

// بيانات تجريبية للتنبيهات
const alerts = [
  { id: '1', title: 'بانادول - الكمية منخفضة', message: 'الكمية المتبقية: 3 فقط', type: 'warning', time: 'منذ 5 دقائق' },
  { id: '2', title: 'طلب جديد #1234', message: 'من عميل: أحمد محمد', type: 'info', time: 'منذ 10 دقائق' },
  { id: '3', title: 'أدول - ينتهي الصلاحية', message: 'ينتهي خلال 15 يوماً', type: 'error', time: 'منذ ساعة' },
];

// بيانات تجريبية للطلبات الأخيرة
const recentOrders = [
  { id: '1234', customer: 'أحمد محمد', amount: '45₪', status: 'pending', time: '10:30 ص' },
  { id: '1233', customer: 'سارة خالد', amount: '32₪', status: 'processing', time: '09:45 ص' },
  { id: '1232', customer: 'محمد علي', amount: '78₪', status: 'completed', time: 'أمس' },
];

// بيانات تجريبية للمنتجات الأكثر مبيعاً
const topProducts = [
  { id: '1', name: 'بانادول', sales: 250, revenue: '1,250₪' },
  { id: '2', name: 'فيتامين سي', sales: 180, revenue: '1,440₪' },
  { id: '3', name: 'أموكسيسيلين', sales: 120, revenue: '1,440₪' },
];

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // دوال مؤقتة للتنقل حتى إنشاء الصفحات
  const navigateTo = (screen: string) => {
    Alert.alert('قيد التطوير', `سيتم فتح صفحة ${screen} قريباً`);
  };

  const handleOrderPress = (orderId: string) => {
    Alert.alert('تفاصيل الطلب', `سيتم فتح تفاصيل الطلب رقم ${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.primary;
      case 'completed': return Colors.success;
      default: return Colors.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'قيد التحضير';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🔴';
      default: return 'ℹ️';
    }
  };

  const StatCard = ({ item }: { item: any }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.statIcon}>{item.icon}</Text>
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{item.value}</Text>
        <Text style={styles.statTitle}>{item.title}</Text>
        <Text style={[styles.statChange, { color: item.change.startsWith('+') ? Colors.success : Colors.error }]}>
          {item.change}
        </Text>
      </View>
    </View>
  );

  const AlertItem = ({ item }: { item: any }) => (
    <View style={styles.alertItem}>
      <Text style={styles.alertIcon}>{getAlertIcon(item.type)}</Text>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
    </View>
  );

  const OrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)}>
      <View>
        <Text style={styles.orderId}>طلب #{item.id}</Text>
        <Text style={styles.orderCustomer}>{item.customer}</Text>
        <Text style={styles.orderTime}>{item.time}</Text>
      </View>
      <View style={styles.orderRight}>
        <Text style={styles.orderAmount}>{item.amount}</Text>
        <View style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.orderStatusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ProductItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSales}>{item.sales} مبيعات</Text>
      </View>
      <Text style={styles.productRevenue}>{item.revenue}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>مرحباً 👋</Text>
            <Text style={styles.pharmacyName}>{user?.name || 'صيدلية السلام'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <StatCard key={stat.id} item={stat} />
          ))}
        </View>

        {/* Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚠️ التنبيهات</Text>
            <TouchableOpacity onPress={() => navigateTo('التنبيهات')}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.alertsContainer}>
            {alerts.map((alert) => (
              <AlertItem key={alert.id} item={alert} />
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 آخر الطلبات</Text>
            <TouchableOpacity onPress={() => navigateTo('الطلبات')}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <OrderItem key={order.id} item={order} />
          ))}
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💊 الأكثر مبيعاً</Text>
            <TouchableOpacity onPress={() => navigateTo('التقارير')}>
              <Text style={styles.viewAllText}>تقرير كامل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsContainer}>
            {topProducts.map((product) => (
              <ProductItem key={product.id} item={product} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateTo('المخزون')}>
            <Text style={styles.quickActionIcon}>📦</Text>
            <Text style={styles.quickActionText}>المخزون</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateTo('الطلبات')}>
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionText}>الطلبات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateTo('العملاء')}>
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>العملاء</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigateTo('إضافة منتج')}>
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>إضافة منتج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },
  pharmacyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.onPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 24,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  statChange: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.primary,
  },
  alertsContainer: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    gap: 12,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  alertMessage: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  alertTime: {
    fontSize: 10,
    color: Colors.secondary,
    marginTop: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  orderCustomer: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  orderTime: {
    fontSize: 10,
    color: Colors.secondary,
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  productsContainer: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  productSales: {
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    fontSize: 22,
    color: Colors.onPrimary,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.onPrimary,
    fontWeight: '500',
  },
});