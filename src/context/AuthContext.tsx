// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

interface User {
  id: string;
  phone: string;
  role?: string;
  name?: string;
  pharmacyId?: string;
  warehouseId?: string;
}

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  pharmacy_id?: string;
  warehouse_id?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود مستخدم مخزن محلياً
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        // @ts-ignore
        const sessionUser = data?.session?.user;
        if (sessionUser) {
          const userData: User = {
            id: sessionUser.id,
            phone: sessionUser.phone || '',
            // @ts-ignore
            role: sessionUser.user_metadata?.role || 'patient',
            // @ts-ignore
            name: sessionUser.user_metadata?.name,
          };
          setUser(userData);
          
          // إنشاء ملف شخصي تجريبي للمستخدم
          setProfile({
            id: sessionUser.id,
            full_name: userData.name || 'مستخدم',
            phone: userData.phone,
            role: userData.role || 'patient',
          });
        }
      } catch (error) {
        console.log('No stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const signIn = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ phone, password });
      if (error) throw new Error(error.message);
      if (data?.user) {
        const userData: User = {
          id: data.user.id,
          phone: data.user.phone || phone,
          // @ts-ignore
          role: data.user.user_metadata?.role || 'patient',
          // @ts-ignore
          name: data.user.user_metadata?.name,
        };
        setUser(userData);
        
        setProfile({
          id: data.user.id,
          full_name: userData.name || 'مستخدم',
          phone: userData.phone,
          role: userData.role || 'patient',
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};