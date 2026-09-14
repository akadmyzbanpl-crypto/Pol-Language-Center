import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { classService } from '../../services/classService';
import { CLASS_TYPE_LABELS } from '../../lib/constants';
import { formatPersianDate, formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  ChevronLeft,
  Calendar,
  Radio,
} from 'lucide-react';

export const Classes: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const classes = classService.listClasses();

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchType = selectedType === 'all' || cls.type === selectedType;
      const matchStatus = selectedStatus === 'all' || cls.status === selectedStatus;
      return matchType && matchStatus;
    });
  }, [classes, selectedType, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge variant="emerald">در حال برگزاری</Badge>;
      case 'upcoming':
        return <Badge variant="blue">شروع از ترم بعد</Badge>;
      case 'completed':
        return <Badge variant="slate">به اتمام رسیده</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">برنامه کلاس‌ها و ترم‌های آموزشی</h1>
          <p className="text-sm text-slate-500 mt-1">
            جدول زمان‌بندی کلاس‌های آنلاین در پلتفرم اختصاصی، حضوری در شعبه ونک و هیبرید
          </p>
        </div>

        <Link to="/live/class_1">
          <Button variant="danger" icon={<Radio className="w-4 h-4 animate-pulse" />}>
            ورود به کلاس آنلاین در حال برگزاری
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            همه شیوه‌ها
          </button>
          <button
            onClick={() => setSelectedType('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              selectedType === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            کلاس آنلاین
          </button>
          <button
            onClick={() => setSelectedType('inPerson')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              selectedType === 'inPerson' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            کلاس حضوری
          </button>
          <button
            onClick={() => setSelectedType('hybrid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              selectedType === 'hybrid' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ترکیبی (هیبرید)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">وضعیت ترم:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="ongoing">در حال برگزاری</option>
            <option value="upcoming">شروع ترم بعد</option>
            <option value="completed">پایان یافته</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          title="کلاسی یافت نشد"
          description="با فیلترهای انتخاب شده کلاسی پیدا نشد."
          actionText="مشاهده همه کلاس‌ها"
          onAction={() => {
            setSelectedType('all');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const fillPercentage = Math.round((cls.enrolledCount / cls.capacity) * 100);
            return (
              <Card key={cls.id} hoverEffect className="p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(cls.status)}
                    <Badge variant="blue">{CLASS_TYPE_LABELS[cls.type]}</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cls.title}</h3>
                    <p className="text-xs text-blue-600 font-medium mt-1">مدرس: {cls.teacherName}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <span>روزها: {cls.schedule.days.join('، ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>ساعت: {toPersianDigits(cls.schedule.time)} ({toPersianDigits(cls.sessionDurationMinutes)} دقیقه)</span>
                    </div>
                    {cls.roomOrLink && (
                      <div className="flex items-center gap-2">
                        {cls.type === 'online' ? (
                          <Video className="w-4 h-4 text-blue-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-emerald-500" />
                        )}
                        <span className="truncate">{cls.roomOrLink}</span>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">ظرفیت کلاس:</span>
                      <span className="font-bold text-slate-800">
                        {toPersianDigits(cls.enrolledCount)} از {toPersianDigits(cls.capacity)} نفر
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          fillPercentage >= 90 ? 'bg-rose-500' : fillPercentage >= 60 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">شهریه ترم:</span>
                    <span className="text-sm font-black text-slate-900">{formatPrice(cls.price)}</span>
                  </div>

                  {cls.type === 'online' && cls.status === 'ongoing' ? (
                    <Link to={`/live/${cls.id}`}>
                      <Button size="sm" variant="danger" icon={<Radio className="w-3.5 h-3.5" />}>
                        ورود به کلاس زنده
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/courses">
                      <Button size="sm" variant="outline">
                        ثبت نام در دوره
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
