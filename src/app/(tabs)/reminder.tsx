// src/app/(tabs)/reminder.tsx
import { useState, useEffect } from 'react';
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
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

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
  warning: '#f59e0b',
};

interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  times: string[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

const commonMedicines = [
  'بانادول (Paracetamol)',
  'أموكسيسيلين (Amoxicillin)',
  'فيتامين سي (Vitamin C)',
  'سبازمو (Spasmo)',
  'فولتارين (Voltaren)',
  'بروفين (Brufen)',
];

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicineName: 'بانادول (Panadol)',
      dosage: '500 ملغ • ٣ مرات يومياً',
      times: ['٠٨:٠٠ ص', '٠٢:٠٠ م', '٠٨:٠٠ م'],
      isActive: true,
      startDate: '2024-01-01',
    },
    {
      id: '2',
      medicineName: 'أموكسيسيلين',
      dosage: '250 ملغ • مرتين يومياً',
      times: ['١٠:٠٠ ص', '١٠:٠٠ م'],
      isActive: true,
      startDate: '2024-01-01',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicineName: '',
    dosage: '',
    times: [''],
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    // طلب إذن الإشعارات
    Notifications.requestPermissionsAsync();
  }, []);

  // دالة تحويل الوقت من نص إلى ساعة ودقيقة
const parseTimeToHourMinute = (timeStr: string): { hour: number; minute: number } => {
  const [hour, minute, period] = timeStr.split(/[:\s]/);
  let hourNum = parseInt(hour);
  if (period === 'م' && hourNum !== 12) hourNum += 12;
  if (period === 'ص' && hourNum === 12) hourNum = 0;
  return { hour: hourNum, minute: parseInt(minute) };
};

  // دالة جدولة الإشعار - باستخدام DailyTriggerInput
// دالة جدولة الإشعار - نسخة مبسطة
const scheduleNotification = async (reminder: Reminder) => {
  for (const time of reminder.times) {
    const { hour, minute } = parseTimeToHourMinute(time);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 تذكير دواء',
        body: `حان موعد تناول ${reminder.medicineName}`,
        data: { reminderId: reminder.id },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  }
};

  // دالة إلغاء الإشعارات
const cancelNotifications = async (reminder: Reminder) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.reminderId === reminder.id) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

  const toggleReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      if (!reminder.isActive) {
        await scheduleNotification(reminder);
      } else {
        await cancelNotifications(reminder);
      }
    }
    setReminders(prev =>
      prev.map(r =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  const deleteReminder = (id: string) => {
    Alert.alert('حذف تذكير', 'هل أنت متأكد من حذف هذا التذكير؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          const reminder = reminders.find(r => r.id === id);
          if (reminder) await cancelNotifications(reminder);
          setReminders(prev => prev.filter(r => r.id !== id));
        }
      },
    ]);
  };

  const saveReminder = async () => {
    if (!newReminder.medicineName) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الدواء');
      return;
    }
    if (newReminder.times.filter(t => t.trim()).length === 0) {
      Alert.alert('تنبيه', 'يرجى إدخال موعد واحد على الأقل');
      return;
    }

    const reminder: Reminder = {
      id: editingId || Date.now().toString(),
      medicineName: newReminder.medicineName,
      dosage: newReminder.dosage || 'حسب وصف الطبيب',
      times: newReminder.times.filter(t => t.trim()),
      isActive: true,
      startDate: newReminder.startDate,
      endDate: newReminder.endDate || undefined,
    };

    if (editMode && editingId) {
      setReminders(prev => prev.map(r => r.id === editingId ? reminder : r));
    } else {
      setReminders([...reminders, reminder]);
    }

    await scheduleNotification(reminder);

    setModalVisible(false);
    setEditMode(false);
    setEditingId(null);
    setNewReminder({
      medicineName: '',
      dosage: '',
      times: [''],
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const editReminder = (reminder: Reminder) => {
    setEditMode(true);
    setEditingId(reminder.id);
    setNewReminder({
      medicineName: reminder.medicineName,
      dosage: reminder.dosage,
      times: reminder.times,
      isActive: reminder.isActive,
      startDate: reminder.startDate,
      endDate: reminder.endDate || '',
    });
    setModalVisible(true);
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

  const selectSuggestion = (name: string) => {
    setNewReminder({ ...newReminder, medicineName: name });
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery) return [];
    return commonMedicines.filter(m =>
      m.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => (
    <View style={styles.reminderCard}>
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
        <TouchableOpacity style={styles.editButton} onPress={() => editReminder(reminder)}>
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editText}>تعديل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(reminder.id)}>
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.deleteText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تذكيرات الأدوية</Text>
          <TouchableOpacity onPress={() => {
            setEditMode(false);
            setEditingId(null);
            setNewReminder({
              medicineName: '',
              dosage: '',
              times: [''],
              isActive: true,
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
            });
            setModalVisible(true);
          }}>
            <Text style={styles.addHeaderIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => {
          setEditMode(false);
          setEditingId(null);
          setNewReminder({
            medicineName: '',
            dosage: '',
            times: [''],
            isActive: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
          });
          setModalVisible(true);
        }}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>أضف تذكير جديد</Text>
        </TouchableOpacity>

        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={styles.emptyTitle}>لا توجد تذكيرات</Text>
            <Text style={styles.emptyText}>أضف تذكيراً لمساعدتك على تنظيم مواعيد أدويتك</Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        )}

        {/* Add/Edit Reminder Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editMode ? 'تعديل تذكير' : 'إضافة تذكير جديد'}
              </Text>

              <Text style={styles.modalLabel}>اسم الدواء *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="مثال: بانادول"
                value={newReminder.medicineName}
                onChangeText={(text) => {
                  setNewReminder({ ...newReminder, medicineName: text });
                  setSearchQuery(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && getFilteredSuggestions().length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {getFilteredSuggestions().map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => selectSuggestion(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.modalLabel}>الجرعة (اختياري)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="مثال: 500 ملغ مرتين يومياً"
                value={newReminder.dosage}
                onChangeText={(text) => setNewReminder({ ...newReminder, dosage: text })}
              />

              <Text style={styles.modalLabel}>مواعيد الجرعات *</Text>
              {newReminder.times.map((time, index) => (
                <View key={index} style={styles.timeInputRow}>
                  <View style={styles.timeSelectContainer}>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="مثال: 08:00 ص"
                      value={time}
                      onChangeText={(text) => updateTime(index, text)}
                    />
                  </View>
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
                <TouchableOpacity style={styles.modalSaveButton} onPress={saveReminder}>
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
  addHeaderIcon: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 14,
    borderRadius: 16,
    gap: 8,
  },
  addIcon: {
    fontSize: 20,
    color: Colors.onPrimary,
    fontWeight: 'bold',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
  },
  reminderCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reminderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryContainer + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderIconText: {
    fontSize: 24,
  },
  reminderInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  dosage: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  timeIcon: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  editIcon: {
    fontSize: 14,
  },
  editText: {
    fontSize: 12,
    color: Colors.primary,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.errorContainer,
  },
  deleteIcon: {
    fontSize: 14,
  },
  deleteText: {
    fontSize: 12,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  suggestionsContainer: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.onSurface,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeSelectContainer: {
    flex: 1,
  },
  timeInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  removeTimeButton: {
    padding: 10,
  },
  removeTimeText: {
    fontSize: 14,
    color: Colors.error,
  },
  addTimeButton: {
    marginTop: 8,
    padding: 10,
    alignItems: 'center',
  },
  addTimeText: {
    fontSize: 13,
    color: Colors.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    color: Colors.onPrimary,
    fontWeight: '500',
  },
});