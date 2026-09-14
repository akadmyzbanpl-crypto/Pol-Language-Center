import React, { useState } from 'react';
import { classService } from '../../services/classService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ClipboardCheck, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toPersianDigits } from '../../lib/formatters';

export const AdminAttendance: React.FC = () => {
  const classes = classService.listClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'class_1');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const demoRecords = [
    { studentName: 'حسام ناصری', presentCount: 14, absentCount: 1, lateCount: 0, percent: 93 },
    { studentName: 'مریم احمدی', presentCount: 15, absentCount: 0, lateCount: 1, percent: 98 },
    { studentName: 'امیر رضایی', presentCount: 12, absentCount: 2, lateCount: 1, percent: 80 },
    { studentName: 'سارا محمدی', presentCount: 15, absentCount: 0, lateCount: 0, percent: 100 },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">دفتر آمار حضور و غیاب کلاس‌ها</h2>
          <p className="text-xs text-slate-500 mt-0.5">بررسی غیبت‌ها، تاخیرها و انضباط آموزشی زبان‌آموزان</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">انتخاب کلاس:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.title} ({cls.teacherName})
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">زبان‌آموز</th>
                <th className="p-4">جلسات حاضر</th>
                <th className="p-4">غیبت‌ها</th>
                <th className="p-4">تأخیر ورود</th>
                <th className="p-4">درصد حضور کل</th>
                <th className="p-4">وضعیت انضباطی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demoRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="p-4 text-emerald-600 font-bold">
                    {toPersianDigits(r.presentCount)} جلسه
                  </td>
                  <td className="p-4 text-rose-500 font-bold">
                    {toPersianDigits(r.absentCount)} جلسه
                  </td>
                  <td className="p-4 text-amber-500 font-bold">
                    {toPersianDigits(r.lateCount)} جلسه
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800">
                    %{toPersianDigits(r.percent)}
                  </td>
                  <td className="p-4">
                    <Badge variant={r.percent >= 90 ? 'emerald' : r.percent >= 75 ? 'amber' : 'rose'}>
                      {r.percent >= 90 ? 'بسیار خوب' : r.percent >= 75 ? 'هشدار غیبت' : 'محروم از آزمون'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
