// src/app/(pharmacist)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';

const Colors = {
  primary: '#0f5238',
  surface: '#f8faf6',
  onSurfaceVariant: '#404943',
};

export default function PharmacistTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'الرئيسية', 
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🏠</Text>
        }} 
      />
      <Tabs.Screen 
        name="inventory" 
        options={{ 
          title: 'المخزون', 
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>📦</Text>
        }} 
      />
      <Tabs.Screen 
        name="orders" 
        options={{ 
          title: 'الطلبات', 
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>📝</Text>
        }} 
      />
      <Tabs.Screen 
        name="customers" 
        options={{ 
          title: 'العملاء', 
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>👥</Text>
        }} 
      />
      <Tabs.Screen 
        name="reports" 
        options={{ 
          title: 'التقارير', 
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>📊</Text>
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.onSurfaceVariant + '20',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Tajawal',
  },
  icon: {
    fontSize: 22,
  },
});