// src/app/(tabs)/drug-details.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

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
  secondary: '#5a5f62',
};

export default function DrugDetailsScreen() {
  const params = useLocalSearchParams();
  
  const drug = {
    id: params.id || '1',
    name: params.name || 'بانادول',
    scientificName: params.scientificName || 'Paracetamol',
    concentration: params.concentration || '500mg',
    price: parseFloat(params.price as string) || 5.0,
    pharmacy: params.pharmacy || 'صيدلية السلام',
    distance: params.distance || '500 متر',
    rating: parseFloat(params.rating as string) || 4.8,
    inStock: params.inStock === 'true',
    image: params.image || '💊',
  };

  const handleOrder = () => {
    router.push({
      pathname: '/(tabs)/order',
      params: {
        drugId: drug.id,
        drugName: drug.name,
        drugPrice: drug.price,
        pharmacyName: drug.pharmacy,
      }
    });
  };

  const handleCall = () => {
    Alert.alert('اتصال', `جاري الاتصال بـ ${drug.pharmacy}`);
  };

  const handleDirections = () => {
    Alert.alert('اتجاهات', `جاري فتح الخريطة للوصول إلى ${drug.pharmacy}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل الدواء</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.drugCard}>
          <Text style={styles.drugIcon}>{drug.image}</Text>
          <Text style={styles.drugName}>{drug.name}</Text>
          <Text style={styles.drugScientific}>{drug.scientificName} {drug.concentration}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>{drug.rating}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💰 السعر</Text>
          <Text style={styles.infoPrice}>{drug.price} شيكل</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🏥 الصيدلية</Text>
          <Text style={styles.infoText}>{drug.pharmacy}</Text>
          <Text style={styles.infoSubtext}>📍 {drug.distance}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 معلومات إضافية</Text>
          <Text style={styles.infoText}>دواء مسكن للآلام وخافض للحرارة</Text>
          <Text style={styles.infoSubtext}>يستخدم لعلاج الصداع وآلام الأسنان والحمى</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionText}>الاتجاهات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>اتصال</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.orderButton]} onPress={handleOrder}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={[styles.actionText, styles.orderButtonText]}>طلب</Text>
          </TouchableOpacity>
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
  drugCard: { backgroundColor: Colors.surfaceContainerLowest, margin: 20, padding: 24, borderRadius: 20, alignItems: 'center' },
  drugIcon: { fontSize: 48, marginBottom: 12 },
  drugName: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  drugScientific: { fontSize: 14, color: Colors.secondary, marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingStar: { fontSize: 14 },
  ratingText: { fontSize: 14, color: Colors.secondary },
  infoCard: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 8 },
  infoPrice: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  infoText: { fontSize: 14, color: Colors.onSurface },
  infoSubtext: { fontSize: 12, color: Colors.secondary, marginTop: 4 },
  actionsContainer: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginVertical: 20 },
  actionButton: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, padding: 14, borderRadius: 12, alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 20 },
  actionText: { fontSize: 12, color: Colors.onSurface },
  orderButton: { backgroundColor: Colors.primary },
  orderButtonText: { color: Colors.onPrimary },
});