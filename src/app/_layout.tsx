// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/i18n/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
        </Stack>
      </AuthProvider>
    </LanguageProvider>
  );
}