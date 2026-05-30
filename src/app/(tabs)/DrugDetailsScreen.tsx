// src/screens/patient/DrugDetailsScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  warning: '#f59e0b',
  success: '#10b981',
};

export default function DrugDetailsScreen({ route, navigation }: any) {
  const [activeTab, setActiveTab] = useState('info');
  
  // بيانات تجريبية للدواء
  const drug = {
    id: '1',
    tradeName: 'بانادول',
    scientificName: 'Paracetamol',
    activeIngredient: 'باراسيتامول',
    concentration: '500 مجم',
    form: 'أقراص',
    manufacturer: 'شركة الأدوية العربية',
    price: 5.0,
    description: 'مسكن للآلام وخافض للحرارة، يستخدم لتسكين الآلام الخفيفة إلى المتوسطة مثل الصداع وآلام الأسنان وآلام العضلات.',
    indications: [
      'الصداع والصداع النصفي',
      'آلام الأسنان',
      'آلام العضلات والمفاصل',
      'آلام الدورة الشهرية',
      'خافض للحرارة',
    ],
    sideEffects: [
      'نادراً ما تحدث آثار جانبية',
      'ردود فعل تحسسية نادرة (طفح جلدي)',
      'تلف الكبد عند الجرعات الزائدة',
    ],
    dosage: '500 مجم كل 4-6 ساعات حسب الحاجة، لا تتجاوز 4 جرعات في اليوم',
    precautions: [
      'لا تتجاوز الجرعة الموصى بها',
      'استشر الطبيب إذا استمر الألم لأكثر من 10 أيام',
      'لا تستخدم مع أدوية أخرى تحتوي على باراسيتامول',
    ],
    alternatives: [
      { name: 'أدول', price: 4.5, pharmacy: 'صيدلية الأمل' },
      { name: 'سيتامول', price: 4.0, pharmacy: 'صيدلية الشفاء' },
      { name: 'تايلينول', price: 5.5, pharmacy: 'صيدلية السلام' },
    ],
    pharmacies: [
      { name: 'صيدلية السلام', distance: '500م', price: 5.0, inStock: true },
      { name: 'صيدلية الأمل', distance: '1.2كم', price: 4.5, inStock: true },
      { name: 'صيدلية الشفاء', distance: '800م', price: 5.0, inStock: false },
    ],
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `معلومات دواء ${drug.tradeName}: ${drug.scientificName} ${drug.concentration} - متوفر بسعر ${drug.price} شيكل`,
      });
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء المشاركة');
    }
  };

  const handleOrder = (pharmacy: any) => {
    Alert.alert('طلب دواء', `جاري طلب ${drug.tradeName} من ${pharmacy.name}`);
  };

  const handleCall = (pharmacy: any) => {
    Alert.alert('اتصال', `جاري الاتصال بـ ${pharmacy.name}`);
  };

  const handleDirections = (pharmacy: any) => {
    Alert.alert('اتجاهات', `جاري فتح الخريطة للوصول إلى ${pharmacy.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل الدواء</Text>
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Drug Name Section */}
        <View style={styles.drugHeader}>
          <Text style={styles.drugName}>{drug.tradeName}</Text>
          <Text style={styles.drugScientific}>{drug.scientificName} {drug.concentration}</Text>
          <View style={styles.drugMeta}>
            <Text style={styles.drugForm}>💊 {drug.form}</Text>
            <Text style={styles.drugManufacturer}>🏭 {drug.manufacturer}</Text>
          </View>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>السعر التقريبي</Text>
            <Text style={styles.priceValue}>{drug.price} شيكل</Text>
          </View>
          <TouchableOpacity style={styles.orderNowButton}>
            <Text style={styles.orderNowText}>اطلب الآن</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['info', 'alternatives', 'pharmacies'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'info' ? 'معلومات' : tab === 'alternatives' ? 'بدائل' : 'صيدليات'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <View style={styles.infoTab}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>📝 نبذة عن الدواء</Text>
              <Text style={styles.infoText}>{drug.description}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>✅ دواعي الاستعمال</Text>
              {drug.indications.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>⚠️ الآثار الجانبية</Text>
              {drug.sideEffects.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={[styles.bulletDot, styles.warningDot]}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>💊 الجرعة</Text>
              <Text style={styles.infoText}>{drug.dosage}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>📋 احتياطات</Text>
              {drug.precautions.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'alternatives' && (
          <View style={styles.alternativesTab}>
            {drug.alternatives.map((item, index) => (
              <View key={index} style={styles.alternativeCard}>
                <View>
                  <Text style={styles.alternativeName}>{item.name}</Text>
                  <Text style={styles.alternativePrice}>{item.price} شيكل</Text>
                  <Text style={styles.alternativePharmacy}>{item.pharmacy}</Text>
                </View>
                <TouchableOpacity style={styles.alternativeButton}>
                  <Text style={styles.alternativeButtonText}>اطلب</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'pharmacies' && (
          <View style={styles.pharmaciesTab}>
            {drug.pharmacies.map((item, index) => (
              <View key={index} style={styles.pharmacyResultCard}>
                <View style={styles.pharmacyResultHeader}>
                  <Text style={styles.pharmacyResultName}>{item.name}</Text>
                  {!item.inStock && (
                    <View style={styles.outOfStockTag}>
                      <Text style={styles.outOfStockTagText}>غير متوفر</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.pharmacyResultDistance}>📍 {item.distance}</Text>
                <Text style={styles.pharmacyResultPrice}>💰 {item.price} شيكل</Text>
                <View style={styles.pharmacyResultActions}>
                  <TouchableOpacity style={styles.pharmacyAction} onPress={() => handleDirections(item)}>
                    <Text style={styles.pharmacyActionText}>🗺️ اتجاهات</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pharmacyAction} onPress={() => handleCall(item)}>
                    <Text style={styles.pharmacyActionText}>📞 اتصال</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.pharmacyAction, styles.orderAction, !item.inStock && styles.disabledAction]} 
                    onPress={() => item.inStock && handleOrder(item)}
                    disabled={!item.inStock}
                  >
                    <Text style={styles.pharmacyActionText}>🛒 طلب</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  shareIcon: { fontSize: 22, color: Colors.primary },
  drugHeader: { paddingHorizontal: 20, paddingVertical: 12 },
  drugName: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  drugScientific: { fontSize: 14, color: Colors.secondary, marginBottom: 8 },
  drugMeta: { flexDirection: 'row', gap: 16 },
  drugForm: { fontSize: 12, color: Colors.onSurfaceVariant },
  drugManufacturer: { fontSize: 12, color: Colors.onSurfaceVariant },
  priceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primaryContainer, marginHorizontal: 20, marginVertical: 12, padding: 16, borderRadius: 16 },
  priceLabel: { fontSize: 12, color: Colors.onPrimaryContainer },
  priceValue: { fontSize: 24, fontWeight: 'bold', color: Colors.onPrimaryContainer },
  orderNowButton: { backgroundColor: Colors.onPrimaryContainer, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  orderNowText: { color: Colors.primary, fontWeight: 'bold' },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 12, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.onSurfaceVariant },
  activeTabText: { color: Colors.onPrimary },
  infoTab: { padding: 20 },
  infoSection: { marginBottom: 20 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 8 },
  infoText: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletDot: { fontSize: 14, marginRight: 8, color: Colors.primary },
  warningDot: { color: Colors.warning },
  bulletText: { flex: 1, fontSize: 14, color: Colors.onSurfaceVariant },
  alternativesTab: { padding: 20, gap: 12 },
  alternativeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16 },
  alternativeName: { fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  alternativePrice: { fontSize: 14, color: Colors.primary, marginTop: 4 },
  alternativePharmacy: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  alternativeButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  alternativeButtonText: { color: Colors.onPrimary },
  pharmaciesTab: { padding: 20, gap: 12 },
  pharmacyResultCard: { backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16 },
  pharmacyResultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pharmacyResultName: { fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  outOfStockTag: { backgroundColor: Colors.error + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  outOfStockTagText: { fontSize: 10, color: Colors.error },
  pharmacyResultDistance: { fontSize: 12, color: Colors.secondary, marginBottom: 4 },
  pharmacyResultPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  pharmacyResultActions: { flexDirection: 'row', gap: 12 },
  pharmacyAction: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  orderAction: { backgroundColor: Colors.primary },
  disabledAction: { backgroundColor: Colors.secondary + '40' },
  pharmacyActionText: { fontSize: 12, color: Colors.onSurface },
});