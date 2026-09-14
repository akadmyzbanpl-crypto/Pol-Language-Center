import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Sparkles,
  GraduationCap,
  Video,
  FileSpreadsheet,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Database,
  ExternalLink,
} from 'lucide-react';

export const AcademyUserGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full">
                راهنمای جامع کاربری
              </span>
              <span className="text-xs text-indigo-200 hidden sm:inline">آموزش گام به گام استفاده از سامانه آموزشگاه پل</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              چگونه از بخش‌های مختلف سامانه آموزشگاه زبان پل استفاده کنیم؟
            </h2>
          </div>
        </div>

        <button
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          aria-label="Toggle Guide"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Guide Content */}
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            سامانه آموزشگاه زبان پل یک بستر یکپارچه و مدرن برای یادگیری آنلاین زبان انگلیسی و مدیریت آکادمیک است. در ادامه راهنمای استفاده از قابلیت‌های کلیدی آورده شده است:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">گام اول: ورود و دیتای نمونه</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">بارگذاری اطلاعات و نقش‌ها</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  می‌توانید به صفحه <strong>دیتای اولیه (Seed)</strong> رفته و با یک کلیک کاربران نمونه (مدیر، استاد، زبان‌آموز) و دوره‌ها را ایجاد و تست کنید.
                </p>
              </div>
              <Link
                to="/dev/seed"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                رفتن به صفحه Seed دیتابیس
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-emerald-600 mb-1">گام دوم: کلاس‌های آنلاین</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">حضور در کلاس زنده و تعاملی</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  از منوی بالا به بخش <strong>کلاس زنده (Live)</strong> وارد شوید. امکان گفتگوی آنلاین، وایت‌برد آموزشی و چت کلاسی فراهم است.
                </p>
              </div>
              <Link
                to="/live/class_1"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800"
              >
                ورود به کلاس آنلاین زنده
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-purple-600 mb-1">گام سوم: دوره‌ها و کتاب‌ها</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">ثبت‌نام دوره و خرید کتب</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  از بخش <strong>دوره‌ها</strong> و <strong>فروشگاه کتاب</strong> می‌توانید سرفصل‌های آیلتس و تافل را مرور کرده و به سبد خرید اضافه کنید.
                </p>
              </div>
              <Link
                to="/courses"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                مشاهده فهرست دوره‌ها
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-amber-600 mb-1">گام چهارم: ابزارهای گوگل</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">اسناد ابری Workspace</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  با اتصال حساب گوگل در همین صفحه، برگه‌های حضور و غیاب (Sheets)، جزوات (Drive)، کارنامه رایتینگ (Docs) و اسلایدهای تدریس (Slides) را مدیریت نمایید.
                </p>
              </div>
              <div className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                در همین صفحه فعال است
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
