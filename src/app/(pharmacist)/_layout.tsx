// src/app/(pharmacist)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Text, StyleSheet, I18nManager, View, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

const Colors = {
  primary: '#0f5238',
  surface: '#f8faf6',
  onSurfaceVariant: '#404943',
};

// ✅ ترتيب التبويبات من اليمين إلى اليسار (كما في العربية)
const TABS = [
  { name: 'index', title: 'الرئيسية', icon: '🏠' },
  { name: 'inventory', title: 'المخزون', icon: '📦' },
  { name: 'orders', title: 'الطلبات', icon: '📝' },
  { name: 'customers', title: 'العملاء', icon: '👥' },
  { name: 'reports', title: 'التقارير', icon: '📊' },
];

// شريط تبويبات مخصص (Custom Tab Bar)
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? Colors.primary : Colors.onSurfaceVariant;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, { color }]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color }]}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function PharmacistTabsLayout() {
  // تفعيل RTL (النص من اليمين لليسار)
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.onSurfaceVariant + '20',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Tajawal',
  },
  icon: {
    fontSize: 22,
  },
});