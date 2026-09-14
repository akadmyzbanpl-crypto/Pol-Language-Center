import React from 'react';
import { classService } from '../../services/classService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, Radio, CheckCircle2 } from 'lucide-react';
import { toPersianDigits } from '../../lib/formatters';

export const StudentSchedule: React.FC = () => {
  const classes = classService.listClasses();

  const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه'];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">برنامه هفتگی و تقویم آموزشی</h1>
          <p className="text-xs text-slate-500 mt-1">زمان‌بندی کلاس‌های فعال شما در آموزشگاه پل</p>
        </div>

        <Link to="/live/class_1">
          <Button size="sm" variant="danger" icon={<Radio className="w-4 h-4 animate-pulse" />}>
            ورود به کلاس زنده اکنون
          </Button>
        </Link>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="p-5 space-y-4 border-slate-200">
            <div className="flex items-center justify-between">
              <Badge variant="blue">{cls.type === 'online' ? 'آنلاین زنده' : 'حضوری'}</Badge>
              <span className="text-xs font-bold text-slate-400">ترم بهار</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{cls.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">استاد: {cls.teacherName}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>روزها: {cls.schedule?.days ? cls.schedule.days.join(' و ') : 'شنبه و چهارشنبه'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>ساعت: {cls.schedule?.time ? toPersianDigits(cls.schedule.time) : (cls.startTime ? toPersianDigits(cls.startTime) : '۱۸:۰۰')} ({toPersianDigits(cls.sessionDurationMinutes || 90)} دقیقه)</span>
              </div>
              <div className="flex items-center gap-2">
                {cls.type === 'online' ? (
                  <Video className="w-4 h-4 text-emerald-500" />
                ) : (
                  <MapPin className="w-4 h-4 text-amber-500" />
                )}
                <span>مکان: {cls.roomOrLink || (cls.type === 'online' ? 'اتاق آنلاین پل' : 'کلاس ۱۰۲ ساختمان مرکزی')}</span>
              </div>
            </div>

            {cls.type === 'online' ? (
              <Link to={`/live/${cls.id}`} className="block">
                <Button size="sm" variant="outline" className="w-full">
                  ورود به اتاق کلاس آنلاین
                </Button>
              </Link>
            ) : (
              <div className="p-2 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4" />
                <span>کلاس حضوری شعبه ولیعصر</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
