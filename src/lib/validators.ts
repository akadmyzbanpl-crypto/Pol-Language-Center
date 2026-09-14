import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
    lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد'),
    username: z
      .string()
      .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
      .regex(/^[a-zA-Z0-9_]+$/, 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و خط زیر باشد'),
    phone: z
      .string()
      .regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر وارد کنید (مانند 09123456789)'),
    email: z.string().email('ایمیل معتبر وارد کنید'),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(6, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور با تکرار آن یکسان نیست',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  identifier: z.string().min(3, 'نام کاربری یا ایمیل را وارد کنید'),
  password: z.string().min(6, 'رمز عبور را وارد کنید'),
  rememberMe: z.boolean().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'عنوان دوره باید حداقل ۳ کاراکتر باشد'),
  level: z.string().min(1, 'سطح دوره را انتخاب کنید'),
  teacherId: z.string().min(1, 'استاد دوره را انتخاب کنید'),
  price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  discountPercent: z.number().min(0).max(100, 'تخفیف باید بین ۰ تا ۱۰۰ درصد باشد'),
  sessionCount: z.number().min(1, 'تعداد جلسات حداقل ۱ است'),
  durationHours: z.number().min(1, 'مدت ساعت دوره الزامی است'),
  type: z.enum(['online', 'inPerson', 'hybrid']),
  description: z.string().min(10, 'توضیحات دوره باید حداقل ۱۰ کاراکتر باشد'),
  thumbnailUrl: z.string().optional(),
});

export const bookSchema = z.object({
  title: z.string().min(2, 'عنوان کتاب الزامی است'),
  author: z.string().min(2, 'نام نویسنده الزامی است'),
  category: z.string().min(2, 'دسته‌بندی الزامی است'),
  price: z.number().min(0, 'قیمت معتبر نیست'),
  discountPercent: z.number().min(0).max(100, 'درصد تخفیف باید بین ۰ تا ۱۰۰ باشد'),
  stock: z.number().min(0, 'موجودی انبار نمی‌تواند منفی باشد'),
  description: z.string().min(10, 'توضیحات کتاب حداقل ۱۰ کاراکتر است'),
});

export const classSchema = z.object({
  title: z.string().min(3, 'عنوان کلاس حداقل ۳ کاراکتر است'),
  courseId: z.string().min(1, 'دوره مرتبط را انتخاب کنید'),
  teacherId: z.string().min(1, 'استاد کلاس را انتخاب کنید'),
  capacity: z.number().min(1, 'ظرفیت حداقل ۱ نفر است'),
  startDate: z.string().min(1, 'تاریخ شروع الزامی است'),
  endDate: z.string().min(1, 'تاریخ پایان الزامی است'),
  startTime: z.string().min(1, 'ساعت شروع الزامی است'),
  endTime: z.string().min(1, 'ساعت پایان الزامی است'),
  type: z.enum(['online', 'inPerson', 'hybrid']),
  weekDays: z.array(z.number()).min(1, 'حداقل یک روز هفته را انتخاب کنید'),
});
