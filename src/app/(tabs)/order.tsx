// src/app/(tabs)/order.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
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
  outline: '#707973',
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
  success: '#10b981',
};

export default function OrderScreen() {
  const params = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const drugName = params.drugName as string || 'بانادول';
  const drugPrice = parseFloat(params.drugPrice as string) || 5.0;
  const pharmacyName = params.pharmacyName as string || 'صيدلية السلام';

  const totalPrice = drugPrice * quantity;
  const deliveryFee = deliveryMethod === 'delivery' ? 5.0 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleOrder = () => {
    if (deliveryMethod === 'delivery' && !address) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان التوصيل');
      return;
    }
    Alert.alert(
      'تأكيد الطلب',
      `هل أنت متأكد من طلب ${quantity} × ${drugName}؟\n\nالإجمالي: ${finalTotal} شيكل`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تأكيد', onPress: () => {
          Alert.alert('تم الطلب', 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريباً');
          router.push('/(tabs)/track-order');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>طلب دواء</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.drugCard}>
          <Text style={styles.drugName}>{drugName}</Text>
          <Text style={styles.drugPrice}>{drugPrice} شيكل / للوحدة</Text>
          <Text style={styles.pharmacyName}>🏥 {pharmacyName}</Text>
        </View>

        <View style={styles.section}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طريقة الاستلام</Text>
          <TouchableOpacity style={[styles.option, deliveryMethod === 'pickup' && styles.optionSelected]} onPress={() => setDeliveryMethod('pickup')}>
            <Text style={styles.optionIcon}>🏪</Text>
            <Text style={styles.optionTitle}>استلام من الصيدلية</Text>
            <View style={[styles.radio, deliveryMethod === 'pickup' && styles.radioSelected]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.option, deliveryMethod === 'delivery' && styles.optionSelected]} onPress={() => setDeliveryMethod('delivery')}>
            <Text style={styles.optionIcon}>🚚</Text>
            <Text style={styles.optionTitle}>توصيل للمنزل (+5 شيكل)</Text>
            <View style={[styles.radio, deliveryMethod === 'delivery' && styles.radioSelected]} />
          </TouchableOpacity>
          {deliveryMethod === 'delivery' && (
            <TextInput style={styles.addressInput} placeholder="أدخل عنوان التوصيل" value={address} onChangeText={setAddress} textAlign="right" />
          )}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>ملخص الطلب</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>سعر الدواء</Text><Text style={styles.summaryValue}>{totalPrice} شيكل</Text></View>
          {deliveryMethod === 'delivery' && (<View style={styles.summaryRow}><Text style={styles.summaryLabel}>رسوم التوصيل</Text><Text style={styles.summaryValue}>{deliveryFee} شيكل</Text></View>)}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}><Text style={styles.summaryTotal}>الإجمالي</Text><Text style={styles.summaryTotalValue}>{finalTotal} شيكل</Text></View>
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
  drugCard: { backgroundColor: Colors.surfaceContainerLowest, margin: 20, padding: 20, borderRadius: 16, alignItems: 'center' },
  drugName: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  drugPrice: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
  pharmacyName: { fontSize: 12, color: Colors.onSurfaceVariant },
  section: { marginHorizontal: 20, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 12 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  quantityButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  quantityButtonText: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  quantityValue: { fontSize: 20, fontWeight: 'bold', color: Colors.onSurface },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16, marginBottom: 12, gap: 12 },
  optionSelected: { borderWidth: 1, borderColor: Colors.primary },
  optionIcon: { fontSize: 24 },
  optionTitle: { flex: 1, fontSize: 14, color: Colors.onSurface },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.outlineVariant },
  radioSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  addressInput: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 12, marginTop: 8, borderWidth: 1, borderColor: Colors.outlineVariant },
  summary: { backgroundColor: Colors.surfaceContainerLowest, margin: 20, padding: 16, borderRadius: 16 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.onSurfaceVariant },
  summaryValue: { fontSize: 14, color: Colors.onSurface },
  summaryDivider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 8 },
  summaryTotal: { fontSize: 16, fontWeight: 'bold', color: Colors.onSurface },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  confirmButton: { backgroundColor: Colors.primary, margin: 20, padding: 16, borderRadius: 16, alignItems: 'center' },
  confirmButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.onPrimary },
});