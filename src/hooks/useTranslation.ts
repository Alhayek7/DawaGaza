// src/hooks/useTranslation.ts
import { useLanguage } from '@/i18n/LanguageContext';

export const useTranslation = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  return { t, language, setLanguage, isRTL };
};