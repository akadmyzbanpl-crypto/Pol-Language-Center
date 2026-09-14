import { CourseLevel, UserRole } from '../types';

export const ACADEMY_NAME = 'آموزشگاه زبان پل';
export const ACADEMY_NAME_EN = 'Pol Language Center';
export const ACADEMY_SLOGAN = 'پلی به سوی آینده‌ای بهتر';
export const ACADEMY_PHONE = '021-88776655';
export const ACADEMY_EMAIL = 'info@pol-academy.ir';
export const ACADEMY_ADDRESS = 'تهران، میدان ونک، خیابان ولیعصر، پلاک ۱۲۴';

export const WEEK_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

export const COURSE_LEVELS: CourseLevel[] = [
  'مبتدی (A1-A2)',
  'متوسط (B1-B2)',
  'پیشرفته (C1-C2)',
  'آمادگی آیلتس',
  'مکالمه فشرده',
  'کودکان و نوجوانان',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'دانش‌آموز',
  teacher: 'استاد',
  admin: 'مدیر کل',
};

export const CLASS_TYPE_LABELS = {
  online: 'آنلاین',
  inPerson: 'حضوری',
  hybrid: 'ترکیبی (هیبرید)',
};

export const STATUS_LABELS = {
  scheduled: 'برنامه‌ریزی شده',
  live: 'در حال برگزاری (زنده)',
  finished: 'پایان یافته',
  cancelled: 'لغو شده',
};

export const ORDER_STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'در انتظار',
  paid: 'موفق',
  failed: 'ناموفق',
};
