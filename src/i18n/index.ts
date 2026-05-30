// src/i18n/index.ts
import ar from './locales/ar.json';
// import en from './locales/en.json';

export type Language = 'ar' | 'en';

// تعريف نوع المفاتيح المسطحة (flat keys)
export type TranslationKey = 
  | 'app_name'
  | 'tagline'
  | 'connected'
  | 'offline'
  | 'search.title'
  | 'search.placeholder'
  | 'search.button'
  | 'search.no_results'
  | 'search.results_found'
  | 'search.ai_suggestion'
  | 'search.alternative'
  | 'quick_actions.title'
  | 'quick_actions.upload_prescription'
  | 'quick_actions.upload_subtitle'
  | 'quick_actions.ask_pharmacist'
  | 'quick_actions.medicine_reminder'
  | 'quick_actions.nearby_pharmacies'
  | 'pharmacy.open'
  | 'pharmacy.closed'
  | 'pharmacy.distance_meter'
  | 'pharmacy.distance_km'
  | 'pharmacy.directions'
  | 'pharmacy.call'
  | 'pharmacy.order'
  | 'chat.title'
  | 'chat.connected'
  | 'chat.placeholder'
  | 'chat.send'
  | 'prescription.title'
  | 'prescription.upload_title'
  | 'prescription.upload_subtitle'
  | 'prescription.browse'
  | 'prescription.select_pharmacy'
  | 'prescription.notes'
  | 'prescription.notes_placeholder'
  | 'prescription.submit'
  | 'reminder.title'
  | 'reminder.add'
  | 'reminder.times_per_day'
  | 'reminder.edit'
  | 'reminder.delete'
  | 'profile.title'
  | 'profile.edit'
  | 'profile.orders'
  | 'profile.view_all'
  | 'profile.completed'
  | 'profile.pending'
  | 'profile.cancelled'
  | 'profile.settings'
  | 'profile.notifications'
  | 'profile.language'
  | 'profile.logout'
  | 'auth.phone'
  | 'auth.password'
  | 'auth.login'
  | 'auth.demo_accounts'
  | 'auth.patient'
  | 'auth.pharmacist'
  | 'auth.warehouse'
  | 'tabs.home'
  | 'tabs.search'
  | 'tabs.chat'
  | 'tabs.profile';

// الترجمات العربية (بمفاتيح مسطحة)
export const translations: Record<Language, Record<TranslationKey, string>> = {
  ar: {
    app_name: 'DawaGaza',
    tagline: 'الدواء حيث أنت',
    connected: 'متصل',
    offline: 'غير متصل',
    'search.title': '🔍 ابحث عن دوائك',
    'search.placeholder': 'اكتب اسم الدواء (تجاري، علمي، مادة فعالة)',
    'search.button': 'بحث',
    'search.no_results': 'لم يتم العثور على نتائج',
    'search.results_found': 'نتائج',
    'search.ai_suggestion': 'اقتراح الذكاء الاصطناعي',
    'search.alternative': 'بديل',
    'quick_actions.title': 'الإجراءات السريعة',
    'quick_actions.upload_prescription': 'رفع وصفة طبية',
    'quick_actions.upload_subtitle': 'معالجة طلبك بسرعة',
    'quick_actions.ask_pharmacist': 'اسأل صيدلي',
    'quick_actions.medicine_reminder': 'تذكير دواء',
    'quick_actions.nearby_pharmacies': 'أقرب الصيدليات',
    'pharmacy.open': 'مفتوحة',
    'pharmacy.closed': 'مغلقة',
    'pharmacy.distance_meter': 'متر',
    'pharmacy.distance_km': 'كم',
    'pharmacy.directions': 'الاتجاهات',
    'pharmacy.call': 'اتصال',
    'pharmacy.order': 'طلب',
    'chat.title': 'الدردشة مع الصيدلي',
    'chat.connected': 'متصل الآن',
    'chat.placeholder': 'اكتب رسالتك هنا...',
    'chat.send': 'إرسال',
    'prescription.title': 'رفع وصفة طبية',
    'prescription.upload_title': 'رفع صورة أو التقاط صورة',
    'prescription.upload_subtitle': 'يجب أن تكون الصورة واضحة',
    'prescription.browse': 'تصفح الملفات',
    'prescription.select_pharmacy': 'اختيار الصيدلية',
    'prescription.notes': 'ملاحظات إضافية (اختياري)',
    'prescription.notes_placeholder': 'اكتب أي ملاحظات أو تعليمات خاصة هنا...',
    'prescription.submit': 'إرسال الوصفة',
    'reminder.title': 'تذكيرات الأدوية',
    'reminder.add': 'أضف تذكير جديد',
    'reminder.times_per_day': 'مرات يومياً',
    'reminder.edit': 'تعديل',
    'reminder.delete': 'حذف',
    'profile.title': 'الملف الشخصي',
    'profile.edit': 'تعديل البيانات',
    'profile.orders': 'الطلبات السابقة',
    'profile.view_all': 'عرض الكل',
    'profile.completed': 'مكتمل',
    'profile.pending': 'قيد الانتظار',
    'profile.cancelled': 'ملغي',
    'profile.settings': 'الإعدادات',
    'profile.notifications': 'الإشعارات',
    'profile.language': 'اللغة',
    'profile.logout': 'تسجيل الخروج',
    'auth.phone': 'رقم الهاتف',
    'auth.password': 'كلمة المرور',
    'auth.login': 'تسجيل الدخول',
    'auth.demo_accounts': 'حسابات تجريبية',
    'auth.patient': 'مريض',
    'auth.pharmacist': 'صيدلي',
    'auth.warehouse': 'مستودع',
    'tabs.home': 'الرئيسية',
    'tabs.search': 'بحث',
    'tabs.chat': 'محادثة',
    'tabs.profile': 'الملف',
  },
  en: {} as Record<TranslationKey, string>, // سيتم إضافته لاحقاً
};

export const defaultLanguage: Language = 'ar';
export const supportedLanguages: Language[] = ['ar', 'en'];