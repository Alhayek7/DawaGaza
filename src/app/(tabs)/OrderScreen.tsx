// src/screens/patient/OrderScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
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
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  success: '#10b981',
};

export default function OrderScreen({ route, navigation }: any) {
  const { drug, pharmacy } = route.params || {
    drug: { name: 'بانادول', price: 5.0 },
    pharmacy: { name: 'صيدلية السلام' },
  };
  
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const totalPrice = drug.price * quantity;
  const deliveryFee = deliveryMethod === 'delivery' ? 5.0 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleOrder = () => {
    if (deliveryMethod === 'delivery' && !address) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان التوصيل');
      return;
    }
    Alert.alert(
      'تأكيد الطلب',
      `هل أنت متأكد من طلب ${quantity} × ${drug.name}؟
      
      الإجمالي: ${finalTotal} شيكل
      ${deliveryMethod === 'delivery' ? 'توصيل للمنزل' : 'استلام من الصيدلية'}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تأكيد', onPress: () => {
          Alert.alert('تم الطلب', 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريباً');
          navigation.goBack();
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>طلب دواء</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.drugCard}>
          <Text style={styles.drugName}>{drug.name}</Text>
          <Text style={styles.drugPrice}>{drug.price} شيكل / للوحدة</Text>
          <Text style={styles.pharmacyName}>🏥 {pharmacy.name}</Text>
        </View>

        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>الكمية</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>طريقة الاستلام</Text>
          <TouchableOpacity style={[styles.deliveryOption, deliveryMethod === 'pickup' && styles.deliveryOptionSelected]} onPress={() => setDeliveryMethod('pickup')}>
            <Text style={styles.deliveryIcon}>🏪</Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>استلام من الصيدلية</Text>
              <Text style={styles.deliveryDesc}>استلم طلبك بنفسك من الصيدلية</Text>
            </View>
            <View style={[styles.radioCircle, deliveryMethod === 'pickup' && styles.radioSelected]}>
              {deliveryMethod === 'pickup' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.deliveryOption, deliveryMethod === 'delivery' && styles.deliveryOptionSelected]} onPress={() => setDeliveryMethod('delivery')}>
            <Text style={styles.deliveryIcon}>🚚</Text>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>توصيل للمنزل</Text>
              <Text style={styles.deliveryDesc}>نوصل الطلب لباب منزلك +5 شيكل</Text>
            </View>
            <View style={[styles.radioCircle, deliveryMethod === 'delivery' && styles.radioSelected]}>
              {deliveryMethod === 'delivery' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {deliveryMethod === 'delivery' && (
            <TextInput
              style={styles.addressInput}
              placeholder="أدخل عنوان التوصيل بالتفصيل"
              placeholderTextColor={Colors.onSurfaceVariant}
              value={address}
              onChangeText={setAddress}
              textAlign="right"
            />
          )}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionSelected]} onPress={() => setPaymentMethod('cash')}>
            <Text style={styles.paymentIcon}>💵</Text>
            <Text style={styles.paymentTitle}>دفع كاش عند الاستلام</Text>
            <View style={[styles.radioCircle, paymentMethod === 'cash' && styles.radioSelected]}>
              {paymentMethod === 'cash' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]} onPress={() => setPaymentMethod('card')}>
            <Text style={styles.paymentIcon}>💳</Text>
            <Text style={styles.paymentTitle}>بطاقة ائتمان</Text>
            <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioSelected]}>
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>ملخص الطلب</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>سعر الدواء</Text>
            <Text style={styles.summaryValue}>{totalPrice} شيكل</Text>
          </View>
          {deliveryMethod === 'delivery' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>رسوم التوصيل</Text>
              <Text style={styles.summaryValue}>{deliveryFee} شيكل</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>الإجمالي</Text>
            <Text style={styles.summaryTotalValue}>{finalTotal} شيكل</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleOrder}>
          <Text style={styles.confirmButtonText}>تأكيد الطلب</Text>
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
  drugCard: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginVertical: 12, padding: 16, borderRadius: 16, alignItems: 'center' },
  drugName: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  drugPrice: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
  pharmacyName: { fontSize: 12, color: Colors.onSurfaceVariant },
  quantitySection: { marginHorizontal: 20, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 12 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  quantityButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  quantityButtonText: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  quantityValue: { fontSize: 20, fontWeight: 'bold', color: Colors.onSurface },
  deliverySection: { marginHorizontal: 20, marginVertical: 12 },
  deliveryOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16, marginBottom: 12, gap: 12 },
  deliveryOptionSelected: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '10' },
  deliveryIcon: { fontSize: 28 },
  deliveryInfo: { flex: 1 },
  deliveryTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  deliveryDesc: { fontSize: 11, color: Colors.secondary, marginTop: 2 },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  addressInput: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 12, fontSize: 14, marginTop: 8, borderWidth: 1, borderColor: Colors.outlineVariant },
  paymentSection: { marginHorizontal: 20, marginVertical: 12 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16, marginBottom: 12, gap: 12 },
  paymentOptionSelected: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '10' },
  paymentIcon: { fontSize: 24 },
  paymentTitle: { flex: 1, fontSize: 14, color: Colors.onSurface },
  summarySection: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginVertical: 12, padding: 16, borderRadius: 16 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.onSurfaceVariant },
  summaryValue: { fontSize: 14, color: Colors.onSurface },
  summaryDivider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 8 },
  summaryTotal: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  confirmButton: { backgroundColor: Colors.primary, marginHorizontal: 20, marginVertical: 24, padding: 16, borderRadius: 16, alignItems: 'center' },
  confirmButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.onPrimary },
});