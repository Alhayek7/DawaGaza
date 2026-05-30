// src/app/(pharmacist)/add-product.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  outlineVariant: '#bfc9c1',
  secondary: '#5a5f62',
};

export default function AddProductScreen() {
  const params = useLocalSearchParams();
  const isEdit = !!params.id;

  // تحويل القيم من params إلى سلاسل نصية (معالجة حالة المصفوفات)
  const getParamString = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  };

  const [form, setForm] = useState({
    name: getParamString(params.name),
    scientificName: getParamString(params.scientificName),
    quantity: getParamString(params.quantity),
    price: getParamString(params.price),
    expiryDate: getParamString(params.expiryDate),
  });

  const handleSave = () => {
    if (!form.name || !form.scientificName || !form.quantity || !form.price) {
      Alert.alert('تنبيه', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    Alert.alert('نجاح', isEdit ? 'تم تعديل المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'تعديل منتج' : 'إضافة منتج'}</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>اسم الدواء *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="مثال: بانادول"
          />

          <Text style={styles.label}>الاسم العلمي *</Text>
          <TextInput
            style={styles.input}
            value={form.scientificName}
            onChangeText={(text) => setForm({ ...form, scientificName: text })}
            placeholder="مثال: Paracetamol"
          />

          <Text style={styles.label}>الكمية *</Text>
          <TextInput
            style={styles.input}
            value={form.quantity}
            onChangeText={(text) => setForm({ ...form, quantity: text })}
            placeholder="الكمية المتوفرة"
            keyboardType="numeric"
          />

          <Text style={styles.label}>السعر (شيكل) *</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(text) => setForm({ ...form, price: text })}
            placeholder="سعر البيع"
            keyboardType="numeric"
          />

          <Text style={styles.label}>تاريخ الصلاحية</Text>
          <TextInput
            style={styles.input}
            value={form.expiryDate}
            onChangeText={(text) => setForm({ ...form, expiryDate: text })}
            placeholder="YYYY-MM-DD"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>حفظ</Text>
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
  form: { paddingHorizontal: 20, paddingVertical: 16, gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.onSurface, marginBottom: 4 },
  input: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.outlineVariant, fontSize: 14 },
  saveButton: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveText: { fontSize: 16, fontWeight: 'bold', color: Colors.onPrimary },
});