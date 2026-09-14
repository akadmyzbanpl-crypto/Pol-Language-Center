import React, { useState } from 'react';
import { classService } from '../../services/classService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Radio } from 'lucide-react';
import { toPersianDigits } from '../../lib/formatters';

export const AdminCalendar: React.FC = () => {
  const classes = classService.listClasses();
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه'];
  const [selectedDay, setSelectedDay] = useState('شنبه');

  const classesForDay = classes.filter((c) =>
    c.schedule.days.some((d) => d.includes(selectedDay))
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">تقویم جامع هفتگی آکادمی پل</h2>
          <p className="text-xs text-slate-500 mt-0.5">برنامه زمان‌بندی روزانه کلاس‌های آنلاین و حضوری شعب</p>
        </div>

        <Link to="/admin/classes">
          <Button size="sm">
            مدیریت کلاس‌ها
          </Button>
        </Link>
      </div>

      {/* Day Selector Pills */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {days.map((day) => {
          const count = classes.filter((c) => c.schedule.days.some((d) => d.includes(day))).length;
          const active = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {toPersianDigits(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline view for selected day */}
      <div className="space-y-4">
        {classesForDay.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-xs">
            در روز {selectedDay} کلاسی برای برگزاری تنظیم نشده است.
          </Card>
        ) : (
          classesForDay.map((cls) => (
            <Card key={cls.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-slate-900">{cls.title}</span>
                    <Badge variant="blue" size="sm">
                      {cls.type === 'online' ? 'آنلاین' : 'حضوری'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    استاد: {cls.teacherName} • ظرفیت: {toPersianDigits(cls.enrolledCount)} از {toPersianDigits(cls.capacity)} نفر
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-left" dir="ltr">
                  <span className="text-xs font-bold text-slate-800 font-mono block">{cls.schedule.time}</span>
                  <span className="text-[11px] text-slate-400">{cls.roomOrLink}</span>
                </div>

                {cls.type === 'online' && (
                  <Link to={`/live/${cls.id}`}>
                    <Button size="sm" variant="danger" icon={<Radio className="w-3.5 h-3.5" />}>
                      ورود زنده
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
