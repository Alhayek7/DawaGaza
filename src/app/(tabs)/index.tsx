// src/app/(tabs)/index.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/i18n/LanguageContext';

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
};

// بيانات تجريبية للصيدليات القريبة
const nearbyPharmacies = [
  {
    id: '1',
    name: 'صيدلية السلام',
    distance: 500,
    unit: 'm',
    rating: 4.8,
    status: 'open',
    address: 'شارع النصر، غزة',
    phone: '+970 59 123 4567',
    image: '🏥',
  },
  {
    id: '2',
    name: 'صيدلية الأمل',
    distance: 1.2,
    unit: 'km',
    rating: 4.6,
    status: 'open',
    address: 'شارع الرشيد، غزة',
    phone: '+970 59 765 4321',
    image: '🏥',
  },
  {
    id: '3',
    name: 'صيدلية الشفاء',
    distance: 800,
    unit: 'm',
    rating: 4.9,
    status: 'open',
    address: 'شارع جلال، غزة',
    phone: '+970 59 111 2222',
    image: '🏥',
  },
];

// بيانات الإجراءات السريعة
const quickActions = [
  { id: '1', title: 'رفع وصفة طبية', icon: '📷', color: Colors.primary, bgColor: Colors.primaryContainer + '20', route: '/(tabs)/upload-prescription' },
  { id: '2', title: 'اسأل صيدلي', icon: '💬', color: '#3b82f6', bgColor: '#3b82f620', route: '/(tabs)/chat' },
  { id: '3', title: 'تذكير دواء', icon: '⏰', color: '#f59e0b', bgColor: '#f59e0b20', route: '/(tabs)/reminder' },
  { id: '4', title: 'الأدوية المفضلة', icon: '⭐', color: '#ef4444', bgColor: '#ef444420', route: '/(tabs)/favorites' },
];

// اقتراحات البحث الشائعة
const suggestions = [
  'بانادول (Paracetamol)',
  'أموكسيسيلين (Amoxicillin)',
  'فيتامين سي (Vitamin C)',
  'سبازمو (Spasmo)',
];

export default function HomeTab() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // دالة البحث - تنتقل إلى صفحة البحث مع النص
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الدواء');
      return;
    }
    router.push({
      pathname: '/(tabs)/search',
      params: { query: searchQuery }
    });
  };

  // الضغط على اقتراح
  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push({
      pathname: '/(tabs)/search',
      params: { query: suggestion }
    });
  };

  // الإجراءات السريعة

const handleQuickAction = (action: any) => {
  switch (action.id) {
    case '1':
      router.push('/(tabs)/upload-prescription');
      break;
    case '2':
      router.push('/(tabs)/chat');
      break;
    case '3':
      router.push('/(tabs)/reminder');
      break;
    case '4':
      router.push('/(tabs)/favorites');
      break;
    default:
      Alert.alert(action.title, `سيتم فتح ${action.title}`);
  }
};

  // الضغط على إشعارات
const handleNotifications = () => {
  router.push('/(tabs)/NotificationsScreen');
};
  // الضغط على صيدلية
  const handlePharmacyPress = (pharmacy: any) => {
    Alert.alert(pharmacy.name, `${pharmacy.address}\n📞 ${pharmacy.phone}\n⭐ التقييم: ${pharmacy.rating}`);
  };

  // عرض الكل في الصيدليات
  const handleViewAllPharmacies = () => {
    Alert.alert('أقرب الصيدليات', 'سيتم عرض جميع الصيدليات قريباً');
  };

  const getStatusText = (status: string) => {
    return status === 'open' ? 'مفتوحة الآن' : 'مغلقة';
  };

  const getStatusColor = (status: string) => {
    return status === 'open' ? Colors.success : Colors.error;
  };

  const formatDistance = (distance: number, unit: string) => {
    return `${distance} ${unit === 'm' ? 'متر' : 'كم'}`;
  };

  const renderPharmacyCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.pharmacyCard} onPress={() => handlePharmacyPress(item)} activeOpacity={0.7}>
      <View style={styles.pharmacyHeader}>
        <View style={styles.pharmacyIconContainer}>
          <Text style={styles.pharmacyIcon}>{item.image}</Text>
        </View>
        <View style={styles.pharmacyInfo}>
          <Text style={styles.pharmacyName}>{item.name}</Text>
          <View style={styles.pharmacyDetails}>
            <Text style={styles.pharmacyDistance}>📍 {formatDistance(item.distance, item.unit)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.pharmacyAddress}>{item.address}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
      <Text style={styles.suggestionIcon}>🔍</Text>
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>مرحباً 👋</Text>
            <Text style={styles.userName}>{user?.name || 'زائر'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{t('connected')}</Text>
            </View>
          </View>
        </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>💊 DawaGaza</Text>
            <Text style={styles.bannerSubtitle}>الدواء حيث أنت</Text>
            <Text style={styles.bannerText}>ابحث عن دوائك بسهولة وسرعة</Text>
          </View>
          <View style={styles.bannerDecoration}>
            <Text style={styles.bannerIcon}>💊</Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>🔍 ابحث عن دوائك</Text>
          <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>بحث</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="اكتب اسم الدواء (تجاري، علمي، مادة فعالة)"
              placeholderTextColor={Colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(text.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              textAlign="right"
            />
          </View>
          
          {/* Search Suggestions */}
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions.filter(s => s.includes(searchQuery) || searchQuery.length === 0)}
                renderItem={renderSuggestion}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ الإجراءات السريعة</Text>
            <TouchableOpacity onPress={() => Alert.alert('جميع الإجراءات', 'سيتم عرضها قريباً')}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: action.bgColor }]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Pharmacies Section */}
        <View style={styles.nearbySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 أقرب الصيدليات</Text>
            <TouchableOpacity onPress={handleViewAllPharmacies}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyPharmacies}
            renderItem={renderPharmacyCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Health Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 نصائح صحية</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll}>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💊</Text>
              <Text style={styles.tipTitle}>لا تتوقف عن الدواء</Text>
              <Text style={styles.tipText}>استشر طبيبك قبل التوقف عن أي دواء</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💧</Text>
              <Text style={styles.tipTitle}>اشرب الماء بكثرة</Text>
              <Text style={styles.tipText}>8 أكواب يومياً للحفاظ على صحتك</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>😴</Text>
              <Text style={styles.tipTitle}>النوم الكافي</Text>
              <Text style={styles.tipText}>7-8 ساعات يومياً تقوي المناعة</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// src/app/(tabs)/index.tsx - الجزء المحدث من styles فقط

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingBottom: 20,
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
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 12,
    color: Colors.secondary,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.onPrimary,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.onPrimaryContainer,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 12,
    color: Colors.onPrimaryContainer,
  },
  bannerDecoration: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.onPrimaryContainer + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIcon: {
    fontSize: 32,
  },
  searchSection: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    textAlign: 'right',
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  suggestionsContainer: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  suggestionIcon: {
    fontSize: 14,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '22%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  nearbySection: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  pharmacyCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pharmacyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryContainer + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyIcon: {
    fontSize: 28,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  pharmacyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  pharmacyDistance: {
    fontSize: 12,
    color: Colors.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    fontSize: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  pharmacyAddress: {
    fontSize: 11,
    color: Colors.secondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  // ✅ تم دمج الخاصيتين المكررتين في خاصية واحدة
  pharmacyStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tipsSection: {
    marginHorizontal: 20,
    marginVertical: 12,
    marginBottom: 30,
  },
  tipsScroll: {
    flexDirection: 'row',
  },
  tipCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 11,
    color: Colors.secondary,
    lineHeight: 16,
  },
});