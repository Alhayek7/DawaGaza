// src/screens/auth/LoginScreen.tsx
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

const Colors = {
  primary: '#0f5238',
  primaryContainer: '#2d6a4f',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#a8e7c5',
  surface: '#f8faf6',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1a',
  onSurfaceVariant: '#404943',
  error: '#ba1a1a',
  secondary: '#5a5f62',
};

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  // حساب تجريبي لمريض
  const demoAccount = {
    phone: '0591234567',
    password: '123456',
    role: 'patient',
    name: 'أحمد محمد',
  };

  // حساب تجريبي لصيدلي
  const demoPharmacist = {
    phone: '0597654321',
    password: '123456',
    role: 'pharmacist',
    name: 'صيدلية السلام',
  };

  // حساب تجريبي لمستودع
  const demoWarehouse = {
    phone: '0591112222',
    password: '123456',
    role: 'warehouse',
    name: 'مستودع الشفاء',
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(phone, password);
    } catch (error: any) {
      Alert.alert('خطأ في تسجيل الدخول', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (account: typeof demoAccount) => {
    setIsLoading(true);
    try {
      await signIn(account.phone, account.password);
    } catch (error: any) {
      Alert.alert('خطأ', 'حدث خطأ في تسجيل الدخول التجريبي');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo & Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>💊</Text>
          <Text style={styles.title}>DawaGaza</Text>
          <Text style={styles.subtitle}>الدواء حيث أنت</Text>
        </View>

        {/* Login Form */}
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

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.onPrimary} />
            ) : (
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Accounts Section */}
        <View style={styles.demoSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>حسابات تجريبية</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={[styles.demoButton, styles.demoPatient]}
              onPress={() => handleDemoLogin(demoAccount)}
            >
              <Text style={styles.demoIcon}>👤</Text>
              <View>
                <Text style={styles.demoTitle}>مريض</Text>
                <Text style={styles.demoPhone}>{demoAccount.phone}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, styles.demoPharmacist]}
              onPress={() => handleDemoLogin(demoPharmacist)}
            >
              <Text style={styles.demoIcon}>🏥</Text>
              <View>
                <Text style={styles.demoTitle}>صيدلي</Text>
                <Text style={styles.demoPhone}>{demoPharmacist.phone}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, styles.demoWarehouse]}
              onPress={() => handleDemoLogin(demoWarehouse)}
            >
              <Text style={styles.demoIcon}>📦</Text>
              <View>
                <Text style={styles.demoTitle}>مستودع</Text>
                <Text style={styles.demoPhone}>{demoWarehouse.phone}</Text>
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
    gap: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoPatient: {
    backgroundColor: Colors.primaryContainer + '20',
    borderColor: Colors.primary,
  },
  demoPharmacist: {
    backgroundColor: '#3b82f620',
    borderColor: '#3b82f6',
  },
  demoWarehouse: {
    backgroundColor: '#f59e0b20',
    borderColor: '#f59e0b',
  },
  demoIcon: {
    fontSize: 28,
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