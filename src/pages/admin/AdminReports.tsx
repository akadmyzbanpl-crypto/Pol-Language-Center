import React from 'react';
import { reportService } from '../../services/reportService';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Award, Download } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const stats = reportService.getSummaryStats();

  const coursePopularity = [
    { name: 'مسترکلاس آیلتس ۷+', students: 145 },
    { name: 'مکالمه روان و لهجه', students: 210 },
    { name: 'انگلیسی بازرگانی', students: 80 },
    { name: 'گرامر جامع کمبریج', students: 160 },
  ];

  const pieData = [
    { name: 'آنلاین', value: 65, color: '#2563eb' },
    { name: 'حضوری', value: 25, color: '#10b981' },
    { name: 'ترکیبی', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">گزارشات آماری و تحلیلی آکادمی پل</h2>
          <p className="text-xs text-slate-500 mt-0.5">تحلیل عملکرد، محبوبیت دوره‌ها و نسبت ثبت‌نام‌های آنلاین و حضوری</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('خروجی اکسل گزارشات آکادمی با موفقیت آماده دانلود شد.')}
        >
          دریافت خروجی اکسل (Excel)
        </Button>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <span className="text-xs text-slate-500 font-medium">مجموع درآمد ترم جاری</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatPrice(stats.totalRevenue)}</h3>
          <span className="text-xs text-emerald-600 font-bold block mt-1">+۲۲٪ نسبت به دوره قبل</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 font-medium">نرخ تکمیل دوره‌ها توسط زبان‌آموزان</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">۸۸.۴٪</h3>
          <span className="text-xs text-blue-600 font-bold block mt-1">بالاترین نرخ در پلتفرم‌های آموزشی</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-500 font-medium">میانگین رضایت‌مندی از اساتید</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">۴.۹ از ۵</h3>
          <span className="text-xs text-amber-600 font-bold block mt-1">بر اساس ۵۴۰ نظرسنجی پایان ترم</span>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popularity Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">تعداد زبان‌آموزان بر حسب دوره</h3>
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursePopularity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={120} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#2563eb" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Online vs InPerson Pie Chart (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">توزیع شیوه‌های برگزاری کلاس‌ها</h3>
            <div className="h-64 w-full flex items-center justify-center" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>آنلاین (۶۵٪)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>حضوری (۲۵٪)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>هیبرید (۱۰٪)</span>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
