// src/app/(tabs)/favorites.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  success: '#10b981',
  warning: '#f59e0b',
};

interface FavoriteDrug {
  id: string;
  name: string;
  scientificName: string;
  concentration: string;
  price: number;
  image: string;
  addedAt: number;
}

// بيانات تجريبية للأدوية المفضلة
const initialFavorites: FavoriteDrug[] = [
  {
    id: '1',
    name: 'بانادول',
    scientificName: 'Paracetamol',
    concentration: '500mg',
    price: 5.0,
    image: '💊',
    addedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: '2',
    name: 'أموكسيسيلين',
    scientificName: 'Amoxicillin',
    concentration: '500mg',
    price: 12.0,
    image: '💊',
    addedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: '3',
    name: 'فيتامين سي',
    scientificName: 'Vitamin C',
    concentration: '1000mg',
    price: 8.0,
    image: '💊',
    addedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteDrug[]>(initialFavorites);

  // إزالة من المفضلة
  const removeFromFavorites = (id: string) => {
    Alert.alert(
      'إزالة من المفضلة',
      'هل أنت متأكد من إزالة هذا الدواء من المفضلة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إزالة',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== id));
          }
        },
      ]
    );
  };

  // البحث عن الدواء
  const handleSearchDrug = (drug: FavoriteDrug) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { query: drug.name }
    });
  };

  // عرض تفاصيل الدواء
  const handleViewDetails = (drug: FavoriteDrug) => {
    router.push({
      pathname: '/(tabs)/drug-details',
      params: {
        id: drug.id,
        name: drug.name,
        scientificName: drug.scientificName,
        concentration: drug.concentration,
        price: drug.price,
      }
    });
  };

  // طلب الدواء مباشرة
  const handleOrderDrug = (drug: FavoriteDrug) => {
    router.push({
      pathname: '/(tabs)/order',
      params: {
        drugId: drug.id,
        drugName: drug.name,
        drugPrice: drug.price,
        pharmacyName: 'صيدلية السلام',
      }
    });
  };

  // مسح جميع المفضلة
  const handleClearAll = () => {
    if (favorites.length === 0) return;
    
    Alert.alert(
      'مسح جميع المفضلة',
      'هل أنت متأكد من مسح جميع الأدوية من المفضلة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح الكل',
          style: 'destructive',
          onPress: () => setFavorites([])
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'اليوم';
    if (days === 1) return 'أمس';
    return `منذ ${days} يوم`;
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteDrug }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity
        style={styles.favoriteContent}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.drugIconContainer}>
          <Text style={styles.drugIcon}>{item.image}</Text>
        </View>
        <View style={styles.drugInfo}>
          <Text style={styles.drugName}>{item.name}</Text>
          <Text style={styles.drugScientific}>{item.scientificName} {item.concentration}</Text>
          <View style={styles.drugMeta}>
            <Text style={styles.drugPrice}>💰 {item.price} شيكل</Text>
            <Text style={styles.drugAdded}>🕐 {formatDate(item.addedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSearchDrug(item)}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>بحث</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.orderButton]}
          onPress={() => handleOrderDrug(item)}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={[styles.actionText, styles.orderButtonText]}>طلب</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={[styles.actionText, styles.removeButtonText]}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الأدوية المفضلة</Text>
        <TouchableOpacity onPress={handleClearAll} disabled={favorites.length === 0}>
          <Text style={[styles.clearIcon, favorites.length === 0 && styles.clearIconDisabled]}>
            🗑️
          </Text>
        </TouchableOpacity>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>لا توجد أدوية مفضلة</Text>
          <Text style={styles.emptyText}>
            أضف الأدوية التي تبحث عنها كثيراً إلى المفضلة للوصول إليها بسرعة
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.searchButtonText}>🔍 ابحث عن دواء</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>📦 {favorites.length} دواء في المفضلة</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.addMoreText}>+ إضافة المزيد</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  clearIcon: { fontSize: 20, color: Colors.error },
  clearIconDisabled: { opacity: 0.3 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.secondary, textAlign: 'center', marginBottom: 24 },
  searchButton: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  searchButtonText: { fontSize: 14, fontWeight: '600', color: Colors.onPrimary },
  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant },
  statsText: { fontSize: 13, color: Colors.secondary },
  addMoreText: { fontSize: 13, color: Colors.primary },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  favoriteCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, marginTop: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  favoriteContent: { flexDirection: 'row', padding: 16, gap: 12 },
  drugIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primaryContainer + '20', alignItems: 'center', justifyContent: 'center' },
  drugIcon: { fontSize: 28 },
  drugInfo: { flex: 1 },
  drugName: { fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  drugScientific: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  drugMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  drugPrice: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  drugAdded: { fontSize: 10, color: Colors.secondary },
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  actionIcon: { fontSize: 14 },
  actionText: { fontSize: 12, color: Colors.onSurface },
  orderButton: { backgroundColor: Colors.primary },
  orderButtonText: { color: Colors.onPrimary },
  removeButton: { backgroundColor: Colors.errorContainer },
  removeButtonText: { color: Colors.error },
});