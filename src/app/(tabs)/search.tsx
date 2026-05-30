// src/app/(tabs)/search.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';


const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  primaryLight: '#4a9e7a',
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
  success: '#10b981',
  warning: '#f59e0b',
};

// بيانات تجريبية للبحث الحديث
const recentSearches = [
  { id: '1', query: 'بانادول (Paracetamol)' },
  { id: '2', query: 'أموكسيسيلين (Amoxicillin)' },
  { id: '3', query: 'فيتامين سي (Vitamin C)' },
];

// بيانات تجريبية للبحث الشائع
const popularSearches = [
  { id: '1', name: 'سبازمو (Spasmo)', count: '1.2k بحث', icon: '🔥' },
  { id: '2', name: 'فولتارين (Voltaren)', count: '980 بحث', icon: '⭐' },
  { id: '3', name: 'بروفين (Brufen)', count: '750 بحث', icon: '💊' },
  { id: '4', name: 'زانتا (Zanta)', count: '620 بحث', icon: '🔍' },
];

// بيانات تجريبية للفلاتر
const filters = [
  { id: 'all', name: 'الكل' },
  { id: 'available', name: 'متوفر الآن' },
  { id: 'nearby', name: 'الأقرب' },
  { id: 'cheapest', name: 'أقل سعر' },
  { id: 'alternative', name: 'بدائل' },
];

// بيانات تجريبية للنتائج
const searchResults = [
  {
    id: '1',
    name: 'بانادول',
    scientificName: 'Paracetamol',
    concentration: '500mg',
    form: 'أقراص',
    price: 5.0,
    originalPrice: 7.0,
    pharmacy: 'صيدلية السلام',
    distance: '500 متر',
    rating: 4.8,
    quantity: 50,
    inStock: true,
    image: '💊',
    isAlternative: false,
  },
  {
    id: '2',
    name: 'أدول',
    scientificName: 'Paracetamol',
    concentration: '500mg',
    form: 'أقراص',
    price: 4.5,
    originalPrice: 6.0,
    pharmacy: 'صيدلية الأمل',
    distance: '1.2 كم',
    rating: 4.6,
    quantity: 30,
    inStock: true,
    image: '💊',
    isAlternative: true,
  },
  {
    id: '3',
    name: 'سيتامول',
    scientificName: 'Paracetamol',
    concentration: '500mg',
    form: 'أقراص',
    price: 4.0,
    originalPrice: 5.5,
    pharmacy: 'صيدلية الشفاء',
    distance: '800 متر',
    rating: 4.9,
    quantity: 0,
    inStock: false,
    image: '💊',
    isAlternative: true,
  },
];

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(searchResults);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recent, setRecent] = useState(recentSearches);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الدواء');
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    setTimeout(() => {
      setIsSearching(false);
      if (!recent.some(r => r.query === searchQuery)) {
        setRecent([{ id: Date.now().toString(), query: searchQuery }, ...recent.slice(0, 4)]);
      }
    }, 1000);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    setTimeout(() => handleSearch(), 100);
  };

  const handleDeleteRecent = (id: string) => {
    setRecent(recent.filter(item => item.id !== id));
  };

  const handleClearAllRecent = () => {
    setRecent([]);
  };

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(filterId);
    let filtered = [...searchResults];
    if (filterId === 'available') {
      filtered = filtered.filter(item => item.inStock);
    } else if (filterId === 'cheapest') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filterId === 'nearby') {
      // محاكاة ترتيب حسب الأقرب
      filtered.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
    }
    setResults(filtered);
  };

const handleResultPress = (item: any) => {
  router.push({
    pathname: '/(tabs)/drug-details',
    params: {
      id: item.id,
      name: item.name,
      scientificName: item.scientificName,
      concentration: item.concentration,
      price: item.price,
      pharmacy: item.pharmacy,
      distance: item.distance,
      rating: item.rating,
      inStock: item.inStock,
      image: item.image,
    }
  });
};

// تحديث دالة زر الطلب
const handleOrderPress = (item: any) => {
  router.push({
    pathname: '/(tabs)/order',
    params: {
      drugId: item.id,
      drugName: item.name,
      drugPrice: item.price,
      pharmacyName: item.pharmacy,
      pharmacyId: item.pharmacyId || '1',
    }
  });
};
  const renderResultCard = ({ item }: { item: any }) => (
    <TouchableOpacity key={item.id} style={styles.resultCard} onPress={() => handleResultPress(item)} activeOpacity={0.8}>
      {item.isAlternative && (
        <View style={styles.alternativeBadge}>
          <Text style={styles.alternativeBadgeText}>بديل موفر</Text>
        </View>
      )}
      {!item.inStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockBadgeText}>غير متوفر</Text>
        </View>
      )}
      
      <View style={styles.resultHeader}>
        <View style={styles.resultImageContainer}>
          <Text style={styles.resultImage}>{item.image}</Text>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultScientific}>{item.scientificName} {item.concentration}</Text>
          <View style={styles.resultDetails}>
            <Text style={styles.resultForm}>📦 {item.form}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.pharmacyInfo}>
        <View>
          <Text style={styles.pharmacyName}>🏥 {item.pharmacy}</Text>
          <Text style={styles.pharmacyDistance}>📍 {item.distance}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price} شيكل</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice} شيكل</Text>
          )}
        </View>
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>الاتجاهات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>اتصال</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.orderButton]}>
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={[styles.actionText, styles.orderButtonText]}>طلب</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: any }) => (
    <TouchableOpacity key={item.id} style={styles.recentItem} onPress={() => handleRecentSearch(item.query)}>
      <Text style={styles.recentIcon}>🕐</Text>
      <Text style={styles.recentText}>{item.query}</Text>
      <TouchableOpacity onPress={() => handleDeleteRecent(item.id)}>
        <Text style={styles.deleteIcon}>✖️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }: { item: any }) => (
    <TouchableOpacity key={item.id} style={styles.popularCard} onPress={() => handleRecentSearch(item.name)}>
      <Text style={styles.popularCardIcon}>{item.icon}</Text>
      <Text style={styles.popularCardName}>{item.name}</Text>
      <Text style={styles.popularCardCount}>{item.count}</Text>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item }: { item: any }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.filterChip, activeFilter === item.id && styles.filterChipActive]}
      onPress={() => handleFilterPress(item.id)}
    >
      <Text style={[styles.filterText, activeFilter === item.id && styles.filterTextActive]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const AISuggestion = () => (
    <View style={styles.aiSuggestionCard}>
      <View style={styles.aiHeader}>
        <Text style={styles.aiIcon}>🤖</Text>
        <Text style={styles.aiTitle}>اقتراح الذكاء الاصطناعي</Text>
      </View>
      <Text style={styles.aiText}>بناءً على بحثك السابق، قد تحتاج إلى:</Text>
      <TouchableOpacity style={styles.aiButton} onPress={() => handleRecentSearch('تايلينول (Tylenol)')}>
        <Text style={styles.aiButtonText}>💊 تايلينول (Tylenol) - بديل البانادول</Text>
        <Text style={styles.aiButtonArrow}>←</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Input Section */}
        <View style={styles.searchInputSection}>
          <Text style={styles.pageTitle}>🔍 البحث عن دواء</Text>
          <View style={styles.searchWrapper}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>بحث</Text>
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="اكتب اسم الدواء..."
                placeholderTextColor={Colors.onSurfaceVariant}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                textAlign="right"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearInput}>
                  <Text style={styles.clearInputText}>✖️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>جاري البحث...</Text>
          </View>
        ) : showResults ? (
          <>
            <View style={styles.filtersSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filters.map((filter) => renderFilterChip({ item: filter }))}
              </ScrollView>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>نتائج البحث: {results.length}</Text>
              <TouchableOpacity>
                <Text style={styles.sortText}>ترتيب ▼</Text>
              </TouchableOpacity>
            </View>

            {results.map((item) => renderResultCard({ item }))}
          </>
        ) : (
          <>
            <AISuggestion />

            {recent.length > 0 && (
              <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>🕐 بحث حديث</Text>
                  <TouchableOpacity onPress={handleClearAllRecent}>
                    <Text style={styles.clearAllText}>مسح الكل</Text>
                  </TouchableOpacity>
                </View>
                {recent.map((item) => renderRecentItem({ item }))}
              </View>
            )}

            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>📊 الأكثر بحثاً اليوم</Text>
              <View style={styles.popularGrid}>
                {popularSearches.map((item) => renderPopularItem({ item }))}
              </View>
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 نصائح للبحث</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>🔍</Text>
                <Text style={styles.tipTitle}>ابحث بالاسم التجاري أو العلمي</Text>
                <Text style={styles.tipText}>مثال: بانادول أو باراسيتامول</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>📷</Text>
                <Text style={styles.tipTitle}>استخدم الكاميرا لمسح الباركود</Text>
                <Text style={styles.tipText}>امسح باركود الدواء مباشرة</Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>🎤</Text>
                <Text style={styles.tipTitle}>جرب البحث الصوتي</Text>
                <Text style={styles.tipText}>تكلم باسم الدواء بدلاً من الكتابة</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingBottom: 30 },
  searchInputSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 16, fontFamily: 'Tajawal' },
  searchWrapper: { flexDirection: 'row', gap: 12 },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 12 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 14, color: Colors.onSurface },
  clearInput: { padding: 6 },
  clearInputText: { fontSize: 12 },
  searchButton: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, justifyContent: 'center' },
  searchButtonText: { color: Colors.onPrimary, fontWeight: '600', fontSize: 14 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, color: Colors.secondary },
  filtersSection: { paddingHorizontal: 20, paddingVertical: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, marginRight: 8 },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.onSurfaceVariant },
  filterTextActive: { color: Colors.onPrimary },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  resultsCount: { fontSize: 13, color: Colors.secondary },
  sortText: { fontSize: 13, color: Colors.primary },
  resultCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 16, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  alternativeBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.warning + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  alternativeBadgeText: { fontSize: 10, color: Colors.warning, fontWeight: '600' },
  outOfStockBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.error + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  outOfStockBadgeText: { fontSize: 10, color: Colors.error, fontWeight: '600' },
  resultHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  resultImageContainer: { width: 60, height: 60, borderRadius: 12, backgroundColor: Colors.primaryContainer + '10', alignItems: 'center', justifyContent: 'center' },
  resultImage: { fontSize: 32 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface },
  resultScientific: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  resultDetails: { flexDirection: 'row', gap: 12, marginTop: 4 },
  resultForm: { fontSize: 11, color: Colors.secondary },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingStar: { fontSize: 10 },
  ratingText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  pharmacyInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, marginTop: 8 },
  pharmacyName: { fontSize: 13, fontWeight: '500', color: Colors.onSurface },
  pharmacyDistance: { fontSize: 11, color: Colors.secondary, marginTop: 2 },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  originalPrice: { fontSize: 11, color: Colors.secondary, textDecorationLine: 'line-through' },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh },
  actionIcon: { fontSize: 14 },
  actionText: { fontSize: 12, color: Colors.onSurface },
  orderButton: { backgroundColor: Colors.primary },
  orderButtonText: { color: Colors.onPrimary },
  aiSuggestionCard: { backgroundColor: Colors.primaryContainer + '10', marginHorizontal: 20, marginVertical: 12, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.primary + '30' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  aiIcon: { fontSize: 20 },
  aiTitle: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  aiText: { fontSize: 13, color: Colors.onSurfaceVariant, marginBottom: 12 },
  aiButton: { backgroundColor: Colors.primaryContainer, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiButtonText: { fontSize: 13, color: Colors.onPrimaryContainer, fontWeight: '500' },
  aiButtonArrow: { fontSize: 16, color: Colors.onPrimaryContainer },
  recentSection: { marginHorizontal: 20, marginVertical: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  clearAllText: { fontSize: 12, color: Colors.primary },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 12, padding: 12, marginBottom: 8, gap: 10 },
  recentIcon: { fontSize: 14 },
  recentText: { flex: 1, fontSize: 13, color: Colors.onSurface },
  deleteIcon: { fontSize: 12, color: Colors.secondary },
  popularSection: { marginHorizontal: 20, marginVertical: 12 },
  popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  popularCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16, alignItems: 'center', width: '30%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  popularCardIcon: { fontSize: 28, marginBottom: 8 },
  popularCardName: { fontSize: 12, fontWeight: '500', color: Colors.onSurface, textAlign: 'center' },
  popularCardCount: { fontSize: 10, color: Colors.secondary, marginTop: 4 },
  tipsSection: { marginHorizontal: 20, marginVertical: 12, marginBottom: 30 },
  tipCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  tipIcon: { fontSize: 24 },
  tipTitle: { flex: 1, fontSize: 13, fontWeight: '500', color: Colors.onSurface },
  tipText: { fontSize: 11, color: Colors.secondary },
});