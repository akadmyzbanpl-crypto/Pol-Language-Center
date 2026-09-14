import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Calendar,
  Radio,
  Video,
  BookMarked,
  ShoppingCart,
  CreditCard,
  ClipboardCheck,
  FileCheck2,
  Bell,
  BarChart3,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { Logo } from '../ui/Logo';

export interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  title,
  subtitle,
  actionButton,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'داشبورد مدیریت', icon: LayoutDashboard, href: '/admin' },
    { label: 'مدیریت کاربران', icon: Users, href: '/admin/users' },
    { label: 'دانش‌آموزان', icon: UserCheck, href: '/admin/students' },
    { label: 'اساتید و مدرسین', icon: GraduationCap, href: '/admin/teachers' },
    { label: 'دوره‌های آموزشی', icon: BookOpen, href: '/admin/courses' },
    { label: 'کلاس‌ها و ترم‌ها', icon: CalendarDays, href: '/admin/classes' },
    { label: 'تقویم آکادمی', icon: Calendar, href: '/admin/calendar' },
    { label: 'کلاس‌های زنده', icon: Radio, href: '/admin/live' },
    { label: 'ویدیوهای ضبط‌شده', icon: Video, href: '/admin/videos' },
    { label: 'کتاب‌ها و منابع', icon: BookMarked, href: '/admin/books' },
    { label: 'سفارشات', icon: ShoppingCart, href: '/admin/orders' },
    { label: 'تراکنش‌های مالی', icon: CreditCard, href: '/admin/payments' },
    { label: 'حضور و غیاب', icon: ClipboardCheck, href: '/admin/attendance' },
    { label: 'تکالیف و نمرات', icon: FileCheck2, href: '/admin/assignments' },
    { label: 'ارسال اعلان‌ها', icon: Bell, href: '/admin/notifications' },
    { label: 'گزارشات و نمودارها', icon: BarChart3, href: '/admin/reports' },
    { label: 'تنظیمات آکادمی', icon: Settings, href: '/admin/settings' },
    { label: 'دیتای اولیه (Seed)', icon: Database, href: '/dev/seed' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <Logo size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 rounded-lg hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar (RTL Right side) */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 shadow-xl ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="bg-white/10 p-2 rounded-xl">
            <Logo size="sm" />
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            پنل ادمین
          </span>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مشاهده سایت اصلی</span>
            </span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-lg font-black text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {actionButton}
            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
            <Link
              to="/admin/notifications"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="اعلان‌های سیستم"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5 pr-2">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="Admin"
                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-bold text-slate-800">
                  {user?.firstName || 'مدیر'} {user?.lastName || 'سیستم'}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">مدیریت کل آکادمی</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
