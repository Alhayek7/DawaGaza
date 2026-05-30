// src/app/(tabs)/NotificationsScreen.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
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

// أنواع الإشعارات
type NotificationType = 'order' | 'medicine' | 'offer' | 'general';
type NotificationStatus = 'read' | 'unread';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timeValue: number;
  read: boolean;
  icon: string;
  type: NotificationType;
  route?: string;
  routeParams?: any;
}

// بيانات تجريبية للإشعارات
const notificationsData: Notification[] = [
  {
    id: '1',
    title: 'طلبك قيد التحضير',
    message: 'تم استلام طلبك من صيدلية السلام وهو قيد التحضير',
    time: 'منذ 5 دقائق',
    timeValue: Date.now() - 5 * 60 * 1000,
    read: false,
    icon: '📦',
    type: 'order',
    route: '/(tabs)/track-order',
    routeParams: { orderId: 'ORD-12345' },
  },
  {
    id: '2',
    title: 'تذكير دواء',
    message: 'حان موعد تناول دواء بانادول',
    time: 'منذ ساعة',
    timeValue: Date.now() - 60 * 60 * 1000,
    read: false,
    icon: '💊',
    type: 'medicine',
    route: '/(tabs)/reminder',
  },
  {
    id: '3',
    title: 'عرض خاص',
    message: 'خصم 20% على جميع أدوية البرد',
    time: 'أمس',
    timeValue: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    icon: '🎉',
    type: 'offer',
  },
  {
    id: '4',
    title: 'طلب مكتمل',
    message: 'تم تسليم طلبك بنجاح، شكراً لاستخدامك DawaGaza',
    time: 'أمس',
    timeValue: Date.now() - 25 * 60 * 60 * 1000,
    read: true,
    icon: '✅',
    type: 'order',
  },
  {
    id: '5',
    title: 'صيدلية جديدة قريبة منك',
    message: 'صيدلية الشفاء انضمت إلى المنصة',
    time: 'يومين',
    timeValue: Date.now() - 48 * 60 * 60 * 1000,
    read: false,
    icon: '🏥',
    type: 'general',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // تصفية الإشعارات حسب التبويب
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  // ترتيب الإشعارات (الأحدث أولاً)
  const sortedNotifications = [...getFilteredNotifications()].sort((a, b) => b.timeValue - a.timeValue);

  // تحديد إشعار كمقروء والانتقال إلى الصفحة المناسبة
  const handleNotificationPress = (item: Notification) => {
    // تحديث الحالة إلى مقروء
    if (!item.read) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === item.id ? { ...n, read: true } : n
        )
      );
    }

    // الانتقال إلى الصفحة المناسبة إذا وُجدت
    if (item.route) {
      try {
        router.push(item.route as any);
      } catch (error) {
        // إذا فشل الانتقال، نعرض رسالة
        Alert.alert('تنبيه', `تم فتح: ${item.title}`);
      }
    } else {
      // إذا لم يكن هناك مسار محدد، نعرض رسالة
      Alert.alert(item.title, item.message);
    }
  };

  // حذف إشعار فردي
  const handleDeleteSingle = (id: string) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDeleteSingle = () => {
    if (itemToDelete) {
      setNotifications(prev => prev.filter(n => n.id !== itemToDelete));
      setItemToDelete(null);
    }
    setDeleteModalVisible(false);
  };

  // حذف جميع الإشعارات
  const handleDeleteAll = () => {
    Alert.alert(
      'حذف جميع الإشعارات',
      'هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف الكل', 
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  // تحديد الكل
  const handleSelectAll = () => {
    if (selectedItems.length === sortedNotifications.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedNotifications.map(n => n.id));
    }
  };

  // حذف المحددين
  const handleDeleteSelected = () => {
    Alert.alert(
      'حذف الإشعارات المحددة',
      `هل أنت متأكد من حذف ${selectedItems.length} إشعار؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => !selectedItems.includes(n.id)));
            setSelectedItems([]);
            setIsSelectionMode(false);
          }
        },
      ]
    );
  };

  // تحديد الكل كمقروء
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(item => ({ ...item, read: true }))
    );
  };

  // تصدير الإشعارات
  const handleExport = () => {
    Alert.alert('تصدير الإشعارات', 'سيتم تصدير الإشعارات كملف PDF قريباً');
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'order': return Colors.primary;
      case 'medicine': return '#f59e0b';
      case 'offer': return '#ef4444';
      default: return Colors.secondary;
    }
  };

  const getTypeText = (type: NotificationType) => {
    switch (type) {
      case 'order': return 'طلب';
      case 'medicine': return 'دواء';
      case 'offer': return 'عرض';
      default: return 'عام';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isSelected = selectedItems.includes(item.id);
    const isSelectionModeActive = isSelectionMode;

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadItem,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => {
          if (isSelectionModeActive) {
            setSelectedItems(prev =>
              prev.includes(item.id)
                ? prev.filter(id => id !== item.id)
                : [...prev, item.id]
            );
          } else {
            handleNotificationPress(item);
          }
        }}
        onLongPress={() => {
          setIsSelectionMode(true);
          setSelectedItems([item.id]);
        }}
        activeOpacity={0.7}
      >
        {/* أيقونة النوع */}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Text style={styles.typeText}>{getTypeText(item.type)}</Text>
        </View>

        <View style={styles.notificationIcon}>
          <Text style={styles.notificationIconText}>{item.icon}</Text>
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>

        {!isSelectionModeActive && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSingle(item.id)}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}

        {isSelectionModeActive && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Text style={styles.checkIcon}>✓</Text>}
          </View>
        )}

        {!item.read && !isSelectionModeActive && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  // عرض حالة عدم وجود إشعارات
  if (sortedNotifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
          <Text style={styles.emptyText}>ستظهر هنا الإشعارات الجديدة</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal تأكيد الحذف */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>حذف الإشعار</Text>
            <Text style={styles.modalText}>هل أنت متأكد من حذف هذا الإشعار؟</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteButton} onPress={confirmDeleteSingle}>
                <Text style={styles.modalDeleteText}>حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <TouchableOpacity onPress={handleExport}>
          <Text style={styles.exportIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              الكل ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
            onPress={() => setActiveTab('unread')}
          >
            <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
              غير مقروء ({notifications.filter(n => !n.read).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'read' && styles.activeTab]}
            onPress={() => setActiveTab('read')}
          >
            <Text style={[styles.tabText, activeTab === 'read' && styles.activeTabText]}>
              مقروء ({notifications.filter(n => n.read).length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          {isSelectionMode ? (
            <>
              <TouchableOpacity onPress={handleSelectAll} style={styles.actionButton}>
                <Text style={styles.actionText}>
                  {selectedItems.length === sortedNotifications.length ? 'إلغاء الكل' : 'تحديد الكل'}
                </Text>
              </TouchableOpacity>
              {selectedItems.length > 0 && (
                <TouchableOpacity onPress={handleDeleteSelected} style={styles.actionButton}>
                  <Text style={[styles.actionText, styles.deleteActionText]}>
                    حذف ({selectedItems.length})
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => {
                setIsSelectionMode(false);
                setSelectedItems([]);
              }} style={styles.actionButton}>
                <Text style={styles.actionText}>إلغاء</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={markAllAsRead} style={styles.actionButton}>
                <Text style={styles.actionText}>تحديد الكل كمقروء</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAll} style={styles.actionButton}>
                <Text style={[styles.actionText, styles.deleteActionText]}>حذف الكل</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSelectionMode(true)} style={styles.actionButton}>
                <Text style={styles.actionText}>تحديد</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={sortedNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
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
  exportIcon: {
    fontSize: 20,
    color: Colors.primary,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    gap: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 12,
    color: Colors.primary,
  },
  deleteActionText: {
    color: Colors.error,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadItem: {
    backgroundColor: Colors.primaryContainer + '08',
  },
  selectedItem: {
    backgroundColor: Colors.primaryContainer + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: Colors.secondary,
  },
  deleteButton: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 16,
    color: Colors.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkIcon: {
    fontSize: 14,
    color: Colors.onPrimary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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
  modalDeleteButton: {
    flex: 1,
    backgroundColor: Colors.errorContainer,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
});