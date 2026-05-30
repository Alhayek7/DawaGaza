// src/app/(tabs)/upload-prescription.tsx
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
  error: '#ba1a1a',
  warning: '#f59e0b',
};

const pharmacies = [
  { id: '1', name: 'صيدلية السلام', distance: '500 متر', address: 'شارع النصر، غزة', rating: 4.8 },
  { id: '2', name: 'صيدلية الأمل', distance: '1.2 كم', address: 'شارع الرشيد، غزة', rating: 4.6 },
  { id: '3', name: 'صيدلية الشفاء', distance: '800 متر', address: 'شارع جلال، غزة', rating: 4.9 },
];

export default function UploadPrescriptionScreen() {
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('خطأ', 'نحتاج إلى إذن الوصول إلى المعرض');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
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
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('تنبيه', 'يرجى رفع صورة الوصفة الطبية');
      return;
    }
    if (!selectedPharmacy) {
      Alert.alert('تنبيه', 'يرجى اختيار الصيدلية');
      return;
    }

    setIsUploading(true);
    // محاكاة رفع الوصفة
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      Alert.alert(
        '✅ تم الإرسال بنجاح',
        'تم استلام وصفاتك الطبية، سيتم التواصل معك قريباً من قبل الصيدلية',
        [
          {
            text: 'حسناً',
            onPress: () => {
              setImage(null);
              setSelectedPharmacy('');
              setNotes('');
              router.back();
            }
          }
        ]
      );
    }, 1000);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>رفع وصفة طبية</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, image && styles.progressStepCompleted]}>
            <Text style={[styles.progressStepNumber, image && styles.progressStepNumberCompleted]}>1</Text>
            <Text style={styles.progressStepLabel}>رفع الصورة</Text>
          </View>
          <View style={[styles.progressLine, image && styles.progressLineCompleted]} />
          <View style={[styles.progressStep, selectedPharmacy && styles.progressStepCompleted]}>
            <Text style={[styles.progressStepNumber, selectedPharmacy && styles.progressStepNumberCompleted]}>2</Text>
            <Text style={styles.progressStepLabel}>اختيار الصيدلية</Text>
          </View>
          <View style={[styles.progressLine, selectedPharmacy && styles.progressLineCompleted]} />
          <View style={styles.progressStep}>
            <Text style={styles.progressStepNumber}>3</Text>
            <Text style={styles.progressStepLabel}>إرسال</Text>
          </View>
        </View>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 صورة الوصفة الطبية</Text>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Text style={styles.removeImageText}>✖️ إزالة</Text>
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
          <Text style={styles.uploadHint}>✅ يجب أن تكون الصورة واضحة ومقروءة</Text>
          <Text style={styles.uploadHint}>📄 يفضل تصوير الوصفة في إضاءة جيدة</Text>
        </View>

        {/* Pharmacy Selection */}
        <View style={styles.section}>
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
                <View style={styles.pharmacyMeta}>
                  <Text style={styles.pharmacyDistance}>📍 {pharmacy.distance}</Text>
                  <Text style={styles.pharmacyRating}>⭐ {pharmacy.rating}</Text>
                </View>
                <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
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

        {/* Upload Progress */}
        {isUploading && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (!image || !selectedPharmacy) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!image || !selectedPharmacy || isUploading}
        >
          <Text style={styles.submitText}>
            {isUploading ? 'جاري الإرسال...' : 'إرسال الوصفة'}
          </Text>
        </TouchableOpacity>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            سيتم إرسال الوصفة إلى الصيدلية المختارة، وسيتواصل معك الصيدلي لتأكيد الطلب وتحديد موعد الاستلام.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  progressStep: {
    alignItems: 'center',
    gap: 4,
  },
  progressStepCompleted: {
    opacity: 1,
  },
  progressStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    overflow: 'hidden',
  },
  progressStepNumberCompleted: {
    backgroundColor: Colors.success,
    color: Colors.onPrimary,
  },
  progressStepLabel: {
    fontSize: 10,
    color: Colors.secondary,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: Colors.success,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.onSurface,
  },
  uploadHint: {
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 8,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    gap: 12,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  removeImageButton: {
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  removeImageText: {
    fontSize: 12,
    color: Colors.error,
  },
  pharmacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pharmacyOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer + '10',
  },
  radioContainer: {
    marginRight: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  pharmacyMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  pharmacyDistance: {
    fontSize: 12,
    color: Colors.secondary,
  },
  pharmacyRating: {
    fontSize: 12,
    color: Colors.warning,
  },
  pharmacyAddress: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  progressBarContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    height: 8,
    backgroundColor: Colors.outlineVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 10,
    color: Colors.success,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.secondary + '80',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.onPrimary,
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryContainer + '10',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
});