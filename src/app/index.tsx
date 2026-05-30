// src/app/index.tsx
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import LoginScreen from './login';
import TabsLayout from './(tabs)/_layout';
import PharmacistTabsLayout from './(pharmacist)/(tabs)/_layout';

export default function Index() {
  const { user, profile, isLoading } = useAuth();

  // أثناء التحميل، عرض شاشة تحميل
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0f5238" />
      </View>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، عرض شاشة تسجيل الدخول
  if (!user) {
    return <LoginScreen />;
  }

  // التوجيه حسب الدور
  const userRole = profile?.role || user?.role || 'patient';

  switch (userRole) {
    case 'pharmacist':
      // ✅ استخدام تبويبات الصيدلي الكاملة (وليس Dashboard فقط)
      return <PharmacistTabsLayout />;
    case 'warehouse':
      return <TabsLayout />;
    case 'organization':
      return <TabsLayout />;
    case 'admin':
      return <TabsLayout />;
    default:
      return <TabsLayout />;
  }
}