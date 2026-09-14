import React from 'react';
import { Link } from 'react-router-dom';
import { classService } from '../../services/classService';
import { liveClassService } from '../../services/liveClassService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Radio, Users, Video, ShieldCheck, ExternalLink } from 'lucide-react';
import { toPersianDigits } from '../../lib/formatters';

export const AdminLive: React.FC = () => {
  const onlineClasses = classService.listClasses().filter((c) => c.type === 'online');
  const liveState = liveClassService.getLiveClassState('class_1');

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">مانیتورینگ کلاس‌های آنلاین و وبینارها</h2>
          <p className="text-xs text-slate-500 mt-0.5">مشاهده زنده اتاق‌های تدریس و تعداد حاضرین هر کلاس</p>
        </div>

        <Link to="/live/class_1">
          <Button variant="danger" icon={<Radio className="w-4 h-4 animate-pulse" />}>
            ورود به عنوان ناظر آکادمی
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {onlineClasses.map((cls) => (
          <Card key={cls.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-600">پخش استریم زنده فعال</span>
              </div>
              <Badge variant="blue">{cls.teacherName}</Badge>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">{cls.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{cls.roomOrLink}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>حاضرین فعلی در کلاس:</span>
              </div>
              <span className="font-bold text-slate-900">
                {toPersianDigits(liveState?.participants.length || 8)} نفر
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono" dir="ltr">
                Bitrate: 1080p @ 60fps
              </span>
              <Link to={`/live/${cls.id}`}>
                <Button size="sm" variant="outline" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  نظارت بر کلاس
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
