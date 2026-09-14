import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, GraduationCap, Award, Mail, Phone } from 'lucide-react';
import { formatPersianDate, toPersianDigits } from '../../lib/formatters';

export const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const students = authService.listUsers().filter((u) => u.role === 'student');

  const filtered = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">لیست زبان‌آموزان آکادمی پل</h2>
          <p className="text-xs text-slate-500 mt-0.5">مشاهده وضعیت ثبت‌نام، نمرات و سوابق کلاسی دانش‌آموزان</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="جستجوی زبان‌آموز..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((student) => (
          <Card key={student.uid} className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{student.firstName} {student.lastName}</h4>
                <span className="text-xs text-slate-400 font-mono" dir="ltr">@{student.username}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono" dir="ltr">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr">{student.phone || 'ثبت نشده'}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>۲ دوره فعال • نرخ حضور ۹۵٪</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Badge variant="emerald" size="sm">
                وضعیت: فعال
              </Badge>
              <span className="text-[11px] text-slate-400">
                عضویت: {formatPersianDate(student.createdAt)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
