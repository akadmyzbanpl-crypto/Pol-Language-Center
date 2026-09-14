import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, GraduationCap, Star, BookOpen, Video } from 'lucide-react';

export const AdminTeachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const teachers = authService.listUsers().filter((u) => u.role === 'teacher');

  const filtered = teachers.filter(
    (t) =>
      t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">اساتید و کادر آموزشی آکادمی پل</h2>
          <p className="text-xs text-slate-500 mt-0.5">مدیریت مدرسین فعال، دوره‌ها و برنامه‌ریزی ساعات تدریس</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="جستجوی مدرس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((teacher) => (
          <Card key={teacher.uid} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{teacher.firstName} {teacher.lastName}</h4>
                <span className="text-xs text-blue-600 font-semibold">مدرس ارشد آکادمی پل</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              دارنده مدارک بین‌المللی کمبریج و اگزمینر رسمی دوره‌های تخصصی آزمون‌های آیلتس.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>ایمیل رسمی:</span>
                <span className="font-mono text-slate-800" dir="ltr">{teacher.email}</span>
              </div>
              <div className="flex justify-between">
                <span>کلاس‌های فعال:</span>
                <span className="font-bold text-blue-600">۳ کلاس آنلاین و حضوری</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Badge variant="emerald">استاد تایید شده</Badge>
              <Button size="sm" variant="outline">
                تخصیص کلاس
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
