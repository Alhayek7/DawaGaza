// src/app/(tabs)/TrackOrderScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e9e5',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  success: '#10b981',
  warning: '#f59e0b',
};

const steps = [
  { id: 1, title: 'تم استلام الطلب', icon: '📋', completed: true, time: '10:30 ص' },
  { id: 2, title: 'جاري التحضير', icon: '⚙️', completed: true, time: '10:45 ص' },
  { id: 3, title: 'جاهز للاستلام', icon: '✅', completed: false, time: 'متوقع 11:30 ص' },
  { id: 4, title: 'تم التسليم', icon: '🏠', completed: false, time: 'متوقع 12:00 م' },
];

export default function TrackOrderScreen({ navigation, route }: any) {
  const { orderId } = route.params || { orderId: 'ORD-12345' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تتبع الطلب</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>رقم الطلب: {orderId}</Text>
          <View style={styles.orderStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>قيد التنفيذ</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineIcon, step.completed && styles.timelineIconCompleted]}>
                  <Text style={styles.timelineIconText}>{step.icon}</Text>
                </View>
                {index < steps.length - 1 && (
                  <View style={[styles.timelineLine, step.completed && styles.timelineLineCompleted]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.timelineTitle, step.completed && styles.timelineTitleCompleted]}>
                  {step.title}
                </Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTitle}>🚚 معلومات التوصيل</Text>
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryName}>صيدلية السلام</Text>
            <Text style={styles.deliveryAddress}>شارع النصر، غزة</Text>
            <Text style={styles.deliveryPhone}>📞 +970 59 123 4567</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>📞 اتصل بالصيدلية</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  orderInfo: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginVertical: 12, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  orderStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning },
  statusText: { fontSize: 12, color: Colors.warning },
  timeline: { marginHorizontal: 20, marginVertical: 12 },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', width: 50 },
  timelineIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  timelineIconCompleted: { backgroundColor: Colors.success },
  timelineIconText: { fontSize: 20 },
  timelineLine: { width: 2, flex: 1, backgroundColor: Colors.outlineVariant, marginVertical: -5 },
  timelineLineCompleted: { backgroundColor: Colors.success },
  timelineRight: { flex: 1, paddingBottom: 24, paddingLeft: 12 },
  timelineTitle: { fontSize: 14, fontWeight: '500', color: Colors.onSurfaceVariant, marginBottom: 4 },
  timelineTitleCompleted: { color: Colors.onSurface, fontWeight: '600' },
  timelineTime: { fontSize: 11, color: Colors.secondary },
  deliveryInfo: { marginHorizontal: 20, marginVertical: 12 },
  deliveryTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 12 },
  deliveryCard: { backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16 },
  deliveryName: { fontSize: 14, fontWeight: '600', color: Colors.onSurface, marginBottom: 4 },
  deliveryAddress: { fontSize: 12, color: Colors.secondary, marginBottom: 4 },
  deliveryPhone: { fontSize: 12, color: Colors.primary },
  contactButton: { backgroundColor: Colors.primary, marginHorizontal: 20, marginVertical: 24, padding: 16, borderRadius: 16, alignItems: 'center' },
  contactButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.onPrimary },
});