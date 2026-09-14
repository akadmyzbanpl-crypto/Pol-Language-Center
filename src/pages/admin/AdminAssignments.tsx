import React, { useState } from 'react';
import { assignmentService } from '../../services/assignmentService';
import { Assignment } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { FileCheck2, Award, CheckCircle, Clock } from 'lucide-react';
import { toPersianDigits, formatPersianDate } from '../../lib/formatters';

export const AdminAssignments: React.FC = () => {
  const assignments = assignmentService.listAssignmentsByClass('class_1');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradeScore, setGradeScore] = useState('90');
  const [gradeFeedback, setGradeFeedback] = useState('تسک ۲ به خوبی ساختاربندی شده است.');

  return (
    <div className="space-y-6 text-right">
      <div>
        <h2 className="text-xl font-black text-slate-900">مدیریت تکالیف کلاسی و نمرات</h2>
        <p className="text-xs text-slate-500 mt-0.5">مشاهده پروژه‌ها، رایتینگ‌ها و نمرات ثبت شده توسط اساتید</p>
      </div>

      <div className="space-y-4">
        {assignments.map((a) => (
          <Card key={a.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{a.title}</span>
                <Badge variant="blue" size="sm">کلاس آیلتس</Badge>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">{a.description}</p>
              <span className="text-[11px] text-slate-400 block pt-1">
                مهلت ارسال: {formatPersianDate(a.dueDate)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                icon={<Award className="w-4 h-4" />}
                onClick={() => setSelectedAssignment(a)}
              >
                مشاهده پاسخ‌ها و نمره‌دهی
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Grading Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={`بررسی و نمره‌دهی: ${selectedAssignment.title}`}
        >
          <div className="space-y-4 text-right">
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-800">زبان‌آموز: حسام ناصری</span>
              <p className="text-slate-600">فایل پاسخ: essay_task2_final.pdf (ارسال شده دیروز)</p>
            </div>

            <div className="space-y-3">
              <Input
                label="نمره از ۱۰۰"
                type="number"
                dir="ltr"
                value={gradeScore}
                onChange={(e) => setGradeScore(e.target.value)}
              />
              <Input
                label="بازخورد استاد به زبان‌آموز"
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                بستن
              </Button>
              <Button
                onClick={() => {
                  alert('نمره با موفقیت در کارنامه زبان‌آموز ثبت گردید.');
                  setSelectedAssignment(null);
                }}
              >
                ثبت نمره نهایی
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
