import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Phone, Mail, MapPin, Instagram, Send, Linkedin, ShieldCheck } from 'lucide-react';
import { ACADEMY_SLOGAN } from '../../lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl inline-block">
              <Logo size="md" />
            </div>
            <p className="text-xs text-blue-400 font-semibold">{ACADEMY_SLOGAN}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              آموزشگاه زبان پل با بهره‌گیری از جدیدترین متدهای آموزشی بین‌المللی و اساتید مجرب آیلتس، فضایی پویا و استاندارد برای پیشرفت سریع زبان‌آموزان فراهم نموده است.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-blue-400 transition-colors">تمام دوره‌های آموزشی</Link></li>
              <li><Link to="/classes" className="hover:text-blue-400 transition-colors">برنامه کلاس‌های آنلاین و حضوری</Link></li>
              <li><Link to="/books" className="hover:text-blue-400 transition-colors">فروشگاه کتاب‌های زبان</Link></li>
              <li><Link to="/teachers" className="hover:text-blue-400 transition-colors">اساتید و مدرسین آکادمی</Link></li>
              <li><Link to="/videos" className="hover:text-blue-400 transition-colors">آرشیو ویدیوهای آموزشی</Link></li>
            </ul>
          </div>

          {/* Col 3: Student & Admin Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">سامانه‌ها و پنل‌ها</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">داشبورد زبان‌آموزان</Link></li>
              <li><Link to="/teacher" className="hover:text-blue-400 transition-colors">سامانه مدیریت اساتید</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">پنل مدیریت کل (ادمین)</Link></li>
              <li><Link to="/dashboard/schedule" className="hover:text-blue-400 transition-colors">تقویم کلاسی و حضور غیاب</Link></li>
              <li><Link to="/dev/seed" className="text-amber-400 hover:underline">بارگذاری دیتای اولیه (Seed Demo)</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white">اطلاعات ارتباطی</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۴</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span dir="ltr">021 - 8877 6655</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>info@pol-academy.ir</span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] text-slate-300">دارای مجوز رسمی از وزارت آموزش و پرورش</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 آموزشگاه زبان پل (Pol Language Center). کلیه حقوق محفوظ است.</p>
          <p className="text-[11px]">طراحی و توسعه یافته با استاندارد واکنش‌گرا و سازگار با GitHub Pages</p>
        </div>
      </div>
    </footer>
  );
};
