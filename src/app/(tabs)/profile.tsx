// src/app/(tabs)/profile.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

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
  errorContainer: '#ffdad6',
  success: '#10b981',
};

// بيانات تجريبية للطلبات السابقة
const recentOrders = [
  {
    id: '1',
    pharmacy: 'صيدلية السلام',
    date: '15 مايو 2024',
    total: '45.00 شيكل',
    status: 'completed',
    items: ['بانادول', 'فيتامين سي'],
  },
  {
    id: '2',
    pharmacy: 'صيدلية الأمل',
    date: '10 مايو 2024',
    total: '32.00 شيكل',
    status: 'completed',
    items: ['أدول'],
  },
  {
    id: '3',
    pharmacy: 'صيدلية الشفاء',
    date: '05 مايو 2024',
    total: '78.00 شيكل',
    status: 'pending',
    items: ['أموكسيسيلين', 'سبازمو'],
  },
];

export default function ProfileTab() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('ar');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل خروج', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // هنا سيتم حفظ البيانات في Supabase لاحقاً
    Alert.alert('نجاح', 'تم تحديث الملف الشخصي بنجاح');
    setIsEditing(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'pending': return '#f59e0b';
      case 'cancelled': return Colors.error;
      default: return Colors.secondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success + '20';
      case 'pending': return '#f59e0b20';
      case 'cancelled': return Colors.error + '20';
      default: return Colors.secondary + '20';
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const SettingItem = ({ icon, title, onPress, children }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {children}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Edit Profile Modal */}
        <Modal
          visible={isEditing}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>تعديل الملف الشخصي</Text>
              
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>الاسم الكامل</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="أدخل اسمك"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>رقم الهاتف</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="أدخل رقم هاتفك"
                  keyboardType="phone-pad"
                  textAlign="right"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.modalCancelText}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveProfile}>
                  <Text style={styles.modalSaveText}>حفظ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
              <Text style={styles.editAvatarIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'أحمد محمد'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '0591234567'}</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>مريض</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Text style={styles.editProfileText}>تعديل</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatCard title="الطلبات" value="12" icon="📦" color={Colors.primary} />
          <StatCard title="الصيدليات" value="4" icon="🏥" color={Colors.primaryLight} />
          <StatCard title="التوفير" value="₪85" icon="💰" color={Colors.success} />
        </View>

        {/* Orders Section */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 الطلبات السابقة</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderPharmacy}>🏥 {order.pharmacy}</Text>
                <View style={[styles.orderStatus, { backgroundColor: getStatusBgColor(order.status) }]}>
                  <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>📅 {order.date}</Text>
              <Text style={styles.orderItems}>💊 {order.items.join('، ')}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>💰 {order.total}</Text>
                <TouchableOpacity style={styles.orderRepeatButton}>
                  <Text style={styles.orderRepeatText}>طلب مرة أخرى</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>⚙️ الإعدادات</Text>

          <SettingItem icon="🔔" title="الإشعارات">
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.outlineVariant, true: Colors.primary }}
              thumbColor={Colors.onPrimary}
            />
          </SettingItem>

          <SettingItem icon="🌐" title="اللغة" onPress={() => Alert.alert('قريباً', 'سيتم إضافة اللغة الإنجليزية قريباً')}>
            <View style={styles.languageSelector}>
              <Text style={styles.languageText}>العربية</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </View>
          </SettingItem>

          <SettingItem icon="🔒" title="الخصوصية والأمان" onPress={() => Alert.alert('قريباً', 'سيتم إضافة صفحة الخصوصية')}>
            <Text style={styles.arrowIcon}>←</Text>
          </SettingItem>

          <SettingItem icon="❓" title="مساعدة والدعم" onPress={() => Alert.alert('الدعم', 'contact@dawagaza.ps')}>
            <Text style={styles.arrowIcon}>←</Text>
          </SettingItem>

          <SettingItem icon="ℹ️" title="عن التطبيق" onPress={() => Alert.alert('عن التطبيق', 'DawaGaza - المنظومة الطبية الذكية لغزة\nالإصدار 1.0.0')}>
            <Text style={styles.arrowIcon}>←</Text>
          </SettingItem>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>DawaGaza v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Profile Header
  profileHeader: {
    backgroundColor: Colors.surfaceContainerLowest,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryContainer + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 48,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceContainerLowest,
  },
  editAvatarIcon: {
    fontSize: 16,
    color: Colors.onPrimary,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  userBadge: {
    backgroundColor: Colors.primaryContainer + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  editProfileButton: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 12,
    color: Colors.primary,
  },
  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  statTitle: {
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 2,
  },
  // Orders Section
  ordersSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.primary,
  },
  orderCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderPharmacy: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 6,
  },
  orderItems: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  orderRepeatButton: {
    backgroundColor: Colors.primaryContainer + '20',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderRepeatText: {
    fontSize: 11,
    color: Colors.primary,
  },
  // Settings Section
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTitle: {
    fontSize: 14,
    color: Colors.onSurface,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    color: Colors.onSurface,
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.secondary,
  },
  arrowIcon: {
    fontSize: 16,
    color: Colors.secondary,
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    backgroundColor: Colors.errorContainer,
    borderRadius: 16,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 8,
  },
  // Modal Styles
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
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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