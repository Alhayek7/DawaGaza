// src/app/(tabs)/ReminderScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  TextInput,
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
  errorContainer: '#ffdad6',
  success: '#10b981',
};

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  times: string[];
  isActive: boolean;
}

export default function ReminderScreen({ navigation }: any) {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'بانادول (Panadol)',
      dosage: '500 ملغ • ٣ مرات يومياً',
      times: ['٠٨:٠٠ ص', '٠٢:٠٠ م', '٠٨:٠٠ م'],
      isActive: true,
    },
    {
      id: '2',
      medicineName: 'أموكسيسيلين',
      dosage: '250 ملغ • مرتين يومياً',
      times: ['١٠:٠٠ ص', '١٠:٠٠ م'],
      isActive: true,
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicineName: '',
    dosage: '',
    times: [''],
    isActive: true,
  });

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    Alert.alert('حذف تذكير', 'هل أنت متأكد من حذف هذا التذكير؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setReminders(prev => prev.filter(r => r.id !== id)) },
    ]);
  };

  const addReminder = () => {
    if (!newReminder.medicineName) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الدواء');
      return;
    }
    const reminder: Reminder = {
      id: Date.now().toString(),
      medicineName: newReminder.medicineName,
      dosage: newReminder.dosage || 'حسب وصف الطبيب',
      times: newReminder.times.filter(t => t.trim()),
      isActive: true,
    };
    setReminders([...reminders, reminder]);
    setModalVisible(false);
    setNewReminder({ medicineName: '', dosage: '', times: [''], isActive: true });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...newReminder.times];
    newTimes[index] = value;
    setNewReminder({ ...newReminder, times: newTimes });
  };

  const addTimeField = () => {
    setNewReminder({ ...newReminder, times: [...newReminder.times, ''] });
  };

  const removeTimeField = (index: number) => {
    if (newReminder.times.length > 1) {
      const newTimes = newReminder.times.filter((_, i) => i !== index);
      setNewReminder({ ...newReminder, times: newTimes });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تذكيرات الأدوية</Text>
          <View style={{ width: 30 }} />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>أضف تذكير جديد</Text>
        </TouchableOpacity>

        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderIcon}>
                <Text style={styles.reminderIconText}>💊</Text>
              </View>
              <View style={styles.reminderInfo}>
                <Text style={styles.medicineName}>{reminder.medicineName}</Text>
                <Text style={styles.dosage}>{reminder.dosage}</Text>
              </View>
              <Switch
                value={reminder.isActive}
                onValueChange={() => toggleReminder(reminder.id)}
                trackColor={{ false: Colors.outlineVariant, true: Colors.primary }}
                thumbColor={Colors.onPrimary}
              />
            </View>

            <View style={styles.timesContainer}>
              {reminder.times.map((time, index) => (
                <View key={index} style={styles.timeBadge}>
                  <Text style={styles.timeIcon}>⏰</Text>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reminderActions}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editIcon}>✏️</Text>
                <Text style={styles.editText}>تعديل</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(reminder.id)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
                <Text style={styles.deleteText}>حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add Reminder Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>إضافة تذكير جديد</Text>

              <Text style={styles.modalLabel}>اسم الدواء</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="مثال: بانادول"
                value={newReminder.medicineName}
                onChangeText={(text) => setNewReminder({ ...newReminder, medicineName: text })}
              />

              <Text style={styles.modalLabel}>الجرعة (اختياري)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="مثال: 500 ملغ مرتين يومياً"
                value={newReminder.dosage}
                onChangeText={(text) => setNewReminder({ ...newReminder, dosage: text })}
              />

              <Text style={styles.modalLabel}>مواعيد الجرعات</Text>
              {newReminder.times.map((time, index) => (
                <View key={index} style={styles.timeInputRow}>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="مثال: 08:00 ص"
                    value={time}
                    onChangeText={(text) => updateTime(index, text)}
                  />
                  <TouchableOpacity onPress={() => removeTimeField(index)} style={styles.removeTimeButton}>
                    <Text style={styles.removeTimeText}>✖️</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addTimeButton} onPress={addTimeField}>
                <Text style={styles.addTimeText}>+ إضافة وقت آخر</Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelText}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={addReminder}>
                  <Text style={styles.modalSaveText}>حفظ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.onSurface },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginHorizontal: 20, marginVertical: 12, padding: 14, borderRadius: 16, gap: 8 },
  addIcon: { fontSize: 20, color: Colors.onPrimary, fontWeight: 'bold' },
  addText: { fontSize: 16, fontWeight: '600', color: Colors.onPrimary },
  reminderCard: { backgroundColor: Colors.surfaceContainerLowest, marginHorizontal: 20, marginVertical: 8, padding: 16, borderRadius: 20 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reminderIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primaryContainer + '20', alignItems: 'center', justifyContent: 'center' },
  reminderIconText: { fontSize: 24 },
  reminderInfo: { flex: 1 },
  medicineName: { fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  dosage: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  timesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 },
  timeIcon: { fontSize: 12 },
  timeText: { fontSize: 12, color: Colors.onSurfaceVariant },
  reminderActions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingTop: 12 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh },
  editIcon: { fontSize: 14 },
  editText: { fontSize: 12, color: Colors.primary },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.errorContainer },
  deleteIcon: { fontSize: 14 },
  deleteText: { fontSize: 12, color: Colors.error },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 24, padding: 24, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 20 },
  modalLabel: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 6, marginTop: 12 },
  modalInput: { backgroundColor: Colors.surface, borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: Colors.outlineVariant },
  timeInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  timeInput: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: Colors.outlineVariant },
  removeTimeButton: { padding: 10 },
  removeTimeText: { fontSize: 14, color: Colors.error },
  addTimeButton: { marginTop: 8, padding: 10, alignItems: 'center' },
  addTimeText: { fontSize: 13, color: Colors.primary },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancelButton: { flex: 1, backgroundColor: Colors.surfaceContainerHigh, padding: 12, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 14, color: Colors.onSurfaceVariant },
  modalSaveButton: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 12, alignItems: 'center' },
  modalSaveText: { fontSize: 14, color: Colors.onPrimary, fontWeight: '500' },
});