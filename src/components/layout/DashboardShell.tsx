import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Video,
  ShoppingBag,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { Logo } from '../ui/Logo';

export interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'داشبورد اصلی', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'دوره‌های من', icon: BookOpen, href: '/dashboard/my-courses' },
    { label: 'برنامه هفتگی و تقویم', icon: Calendar, href: '/dashboard/schedule' },
    { label: 'ویدیوهای آموزشی', icon: Video, href: '/dashboard/videos' },
    { label: 'سفارش‌های من', icon: ShoppingBag, href: '/dashboard/orders' },
    { label: 'پروفایل کاربری', icon: User, href: '/dashboard/profile' },
    { label: 'اعلان‌ها', icon: Bell, href: '/notifications' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <Logo size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Right Sidebar (RTL) */}
      <aside
        className={`fixed md:static inset-y-0 right-0 z-30 w-64 bg-white border-l border-slate-200 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <Logo size="sm" />
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center gap-3">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={user.firstName}
              className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-blue-600 font-medium">زبان‌آموز پل</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Quick link back to website */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            >
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>بازگشت به سایت اصلی</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از سامانه</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-800">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
