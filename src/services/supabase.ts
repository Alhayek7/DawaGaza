// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

// بيانات تجريبية للمستخدمين - ✅ إضافة جميع الأدوار
const MOCK_USERS: Record<string, any> = {
  // حساب مريض
  '0591234567': {
    id: '1',
    phone: '0591234567',
    password: '123456',
    role: 'patient',
    name: 'أحمد محمد',
  },
  // ✅ حساب صيدلي
  '0597654321': {
    id: '2',
    phone: '0597654321',
    password: '123456',
    role: 'pharmacist',
    name: 'صيدلية السلام',
  },
  // ✅ حساب مستودع
  '0591112222': {
    id: '3',
    phone: '0591112222',
    password: '123456',
    role: 'warehouse',
    name: 'مستودع الشفاء',
  },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 500));

export const supabase = {
  auth: {
    getSession: async () => {
      await delay(300);
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithPassword: async ({ phone, password }: { phone: string; password: string }) => {
      console.log('📱 محاولة تسجيل دخول:', { phone, password });
      await delay(800);
      
      const user = MOCK_USERS[phone];
      
      if (user && user.password === password) {
        console.log('✅ Mock login success:', user);
        return {
          data: {
            user: {
              id: user.id,
              phone: user.phone,
              user_metadata: {
                role: user.role,
                name: user.name,
              }
            }
          },
          error: null
        };
      }
      
      console.log('❌ Mock login failed');
      return {
        data: null,
        error: { message: 'رقم الهاتف أو كلمة المرور غير صحيحة' }
      };
    },
    signOut: async () => {
      await delay(300);
      console.log('🚪 تم تسجيل الخروج');
      return { error: null };
    },
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
      limit: () => ({ data: [], error: null }),
    }),
    insert: (data: any) => ({ data, error: null }),
    update: (data: any) => ({
      eq: () => ({ data, error: null }),
    }),
  }),
};