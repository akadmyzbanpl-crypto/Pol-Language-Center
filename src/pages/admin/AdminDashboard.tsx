import React from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { orderService } from '../../services/orderService';
import { formatPrice, toPersianDigits, formatPersianDate } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ShoppingBag,
  ArrowUpLeft,
  Calendar,
  CreditCard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const stats = reportService.getSummaryStats();
  const recentOrders = orderService.listOrders().slice(0, 5);

  const chartData = [
    { month: 'فروردین', revenue: 12500000, students: 45 },
    { month: 'اردیبهشت', revenue: 18400000, students: 62 },
    { month: 'خرداد', revenue: 24200000, students: 85 },
    { month: 'تیر', revenue: 29800000, students: 110 },
    { month: 'مرداد', revenue: 35600000, students: 140 },
    { month: 'شهریور', revenue: 42800000, students: 180 },
  ];

  const kpis = [
    {
      title: 'درآمد کل آکادمی',
      value: formatPrice(stats.totalRevenue),
      subtext: '+۱۸٪ نسبت به ماه گذشته',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'زبان‌آموزان ثبت‌نامی',
      value: `${toPersianDigits(stats.totalStudents)} نفر`,
      subtext: 'در ۲۴ کلاس فعال',
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'دوره‌های آموزشی فعال',
      value: `${toPersianDigits(stats.totalCourses)} دوره`,
      subtext: 'سطوح مقدماتی تا پیشرفته',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'سفارشات فروشگاه',
      value: `${toPersianDigits(stats.totalOrders)} سفارش`,
      subtext: '۹۴٪ پرداخت موفق',
      icon: ShoppingBag,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 text-right">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">نمای کلی وضعیت آکادمی پل</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            آمار ثبت‌نام‌ها، تحلیل درآمد ماهانه و کنترل سفارشات آنلاین
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/courses">
            <Button size="sm" variant="outline">
              + دوره جدید
            </Button>
          </Link>
          <Link to="/admin/classes">
            <Button size="sm">
              + تعریف کلاس / ترم
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-5 flex items-center justify-between border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <h3 className="text-xl font-black text-slate-900">{kpi.value}</h3>
                <span className="text-[11px] text-emerald-600 font-medium block">{kpi.subtext}</span>
              </div>
              <div className={`p-3.5 rounded-2xl ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Chart (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">روند درآمد ماهانه (تومان)</h3>
                <span className="text-xs text-slate-400">شش ماه اخیر</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                رشد پیوسته
              </span>
            </div>

            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Enrollments Bar Chart (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">ثبت‌نام زبان‌آموزان جدید</h3>
              <span className="text-xs text-slate-400">تعداد نفرات ماهانه</span>
            </div>

            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="students" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">آخرین سفارشات و تراکنش‌ها</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">
            مشاهده همه سفارش‌ها
          </Link>
        </div>

        <Card className="p-0 overflow-hidden divide-y divide-slate-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{order.userName}</span>
                  <span className="text-slate-400 text-[11px]" dir="ltr">{order.userPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-slate-500">{formatPersianDate(order.createdAt)}</span>
                <span className="font-black text-slate-900">{formatPrice(order.total)}</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'emerald' : 'amber'}>
                  {order.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار'}
                </Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
