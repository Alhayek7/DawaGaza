// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// مفاتيح التخزين
const STORAGE_KEYS = {
  FAVORITES: '@DawaGaza:favorites',
  USER: '@DawaGaza:user',
  SETTINGS: '@DawaGaza:settings',
  REMINDERS: '@DawaGaza:reminders',
};

// حفظ البيانات
export const saveData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// قراءة البيانات
export const loadData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

// حذف البيانات
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// مسح جميع البيانات
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// مفاتيح مخصصة للمفضلة
export const saveFavorites = async <T>(favorites: T): Promise<void> => {
  await saveData(STORAGE_KEYS.FAVORITES, favorites);
};

export const loadFavorites = async <T>(): Promise<T | null> => {
  return await loadData<T>(STORAGE_KEYS.FAVORITES);
};