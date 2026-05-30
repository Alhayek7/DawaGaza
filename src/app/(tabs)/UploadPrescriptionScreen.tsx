// src/screens/patient/UploadPrescriptionScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

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

const pharmacies = [
  { id: '1', name: 'صيدلية السلام', distance: '500 متر', address: 'شارع النصر، غزة' },
  { id: '2', name: 'صيدلية الأمل', distance: '1.2 كم', address: 'شارع الرشيد، غزة' },
  { id: '3', name: 'صيدلية الشفاء', distance: '800 متر', address: 'شارع جلال، غزة' },
];

export default function UploadPrescriptionScreen({ navigation }: any) {
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('خطأ', 'نحتاج إلى إذن الكاميرا لالتقاط الصورة');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!image) {
      Alert.alert('تنبيه', 'يرجى رفع صورة الوصفة الطبية');
      return;
    }
    if (!selectedPharmacy) {
      Alert.alert('تنبيه', 'يرجى اختيار الصيدلية');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'تم الإرسال بنجاح',
        'تم استلام وصفاتك الطبية، سيتم التواصل معك قريباً',
        [{ text: 'حسناً', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>رفع وصفة طبية</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Image Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>📷 صورة الوصفة الطبية</Text>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                <Text style={styles.removeImageText}>✖️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>التقاط صورة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadIcon}>🖼️</Text>
                <Text style={styles.uploadText}>اختيار من المعرض</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.uploadHint}>يجب أن تكون الصورة واضحة ومقروءة</Text>
        </View>

        {/* Pharmacy Selection */}
        <View style={styles.pharmacySection}>
          <Text style={styles.sectionTitle}>🏥 اختر الصيدلية</Text>
          {pharmacies.map((pharmacy) => (
            <TouchableOpacity
              key={pharmacy.id}
              style={[styles.pharmacyOption, selectedPharmacy === pharmacy.id && styles.pharmacyOptionSelected]}
              onPress={() => setSelectedPharmacy(pharmacy.id)}
            >
              <View style={styles.radioContainer}>
                <View style={[styles.radioCircle, selectedPharmacy === pharmacy.id && styles.radioSelected]}>
                  {selectedPharmacy === pharmacy.id && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.pharmacyDistance}>📍 {pharmacy.distance}</Text>
                <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>📝 ملاحظات إضافية (اختياري)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="اكتب أي ملاحظات أو تعليمات خاصة هنا..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleUpload} disabled={isUploading}>
          <Text style={styles.submitText}>{isUploading ? 'جاري الإرسال...' : 'إرسال الوصفة'}</Text>
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
  uploadSection: { marginHorizontal: 20, marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 12 },
  uploadButtons: { flexDirection: 'row', gap: 16 },
  uploadButton: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, padding: 20, borderRadius: 16, alignItems: 'center', gap: 8 },
  uploadIcon: { fontSize: 28 },
  uploadText: { fontSize: 14, color: Colors.onSurface },
  uploadHint: { fontSize: 11, color: Colors.secondary, marginTop: 8, textAlign: 'center' },
  imagePreviewContainer: { position: 'relative', alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 16, backgroundColor: Colors.surfaceContainerHigh },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  removeImageText: { fontSize: 16 },
  pharmacySection: { marginHorizontal: 20, marginVertical: 12 },
  pharmacyOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerLowest, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  pharmacyOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '10' },
  radioContainer: { marginRight: 12 },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  pharmacyInfo: { flex: 1 },
  pharmacyName: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  pharmacyDistance: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  pharmacyAddress: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2 },
  notesSection: { marginHorizontal: 20, marginVertical: 12 },
  notesInput: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16, fontSize: 14, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.outlineVariant },
  submitButton: { backgroundColor: Colors.primary, marginHorizontal: 20, marginVertical: 24, padding: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: 'bold', color: Colors.onPrimary },
});