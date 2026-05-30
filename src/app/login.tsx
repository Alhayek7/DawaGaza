// src/app/login.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  secondary: '#5a5f62',
  success: '#10b981',
  warning: '#f59e0b',
};

// حسابات تجريبية لجميع الأدوار
const demoAccounts = {
  patient: {
    phone: '0591234567',
    password: '123456',
    role: 'patient',
    name: 'أحمد محمد',
    icon: '👤',
    title: 'مريض',
    color: Colors.primary,
  },
  pharmacist: {
    phone: '0597654321',
    password: '123456',
    role: 'pharmacist',
    name: 'صيدلية السلام',
    icon: '🏥',
    title: 'صيدلي',
    color: '#3b82f6',
  },
  warehouse: {
    phone: '0591112222',
    password: '123456',
    role: 'warehouse',
    name: 'مستودع الشفاء',
    icon: '📦',
    title: 'مستودع',
    color: '#f59e0b',
  },
};

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(phone, password);
      // سيتم التوجيه حسب الدور من خلال AuthContext والمستخدم
      router.replace('/');
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (account: typeof demoAccounts.patient) => {
    setIsLoading(true);
    try {
      await signIn(account.phone, account.password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>💊</Text>
          <Text style={styles.title}>DawaGaza</Text>
          <Text style={styles.subtitle}>الدواء حيث أنت</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textAlign="right"
          />
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textAlign="right"
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={Colors.onPrimary} /> : <Text style={styles.loginButtonText}>تسجيل الدخول</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>حسابات تجريبية</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.demoButtons}>
            {/* حساب مريض */}
            <TouchableOpacity
              style={[styles.demoButton, { borderColor: demoAccounts.patient.color }]}
              onPress={() => handleDemoLogin(demoAccounts.patient)}
            >
              <Text style={styles.demoIcon}>{demoAccounts.patient.icon}</Text>
              <View style={styles.demoInfo}>
                <Text style={styles.demoTitle}>{demoAccounts.patient.title}</Text>
                <Text style={styles.demoPhone}>{demoAccounts.patient.phone}</Text>
              </View>
            </TouchableOpacity>

            {/* حساب صيدلي */}
            <TouchableOpacity
              style={[styles.demoButton, { borderColor: demoAccounts.pharmacist.color }]}
              onPress={() => handleDemoLogin(demoAccounts.pharmacist)}
            >
              <Text style={styles.demoIcon}>{demoAccounts.pharmacist.icon}</Text>
              <View style={styles.demoInfo}>
                <Text style={styles.demoTitle}>{demoAccounts.pharmacist.title}</Text>
                <Text style={styles.demoPhone}>{demoAccounts.pharmacist.phone}</Text>
              </View>
            </TouchableOpacity>

            {/* حساب مستودع */}
            <TouchableOpacity
              style={[styles.demoButton, { borderColor: demoAccounts.warehouse.color }]}
              onPress={() => handleDemoLogin(demoAccounts.warehouse)}
            >
              <Text style={styles.demoIcon}>{demoAccounts.warehouse.icon}</Text>
              <View style={styles.demoInfo}>
                <Text style={styles.demoTitle}>{demoAccounts.warehouse.title}</Text>
                <Text style={styles.demoPhone}>{demoAccounts.warehouse.phone}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Tajawal',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.onSurfaceVariant + '40',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  demoSection: {
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.onSurfaceVariant + '40',
  },
  dividerText: {
    fontSize: 12,
    color: Colors.secondary,
  },
  demoButtons: {
    gap: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  demoIcon: {
    fontSize: 28,
  },
  demoInfo: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  demoPhone: {
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 2,
  },
});