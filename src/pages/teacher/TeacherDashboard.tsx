import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { toPersianDigits } from '../../lib/formatters';
import {
  GraduationCap,
  Users,
  Video,
  ClipboardCheck,
  Plus,
  Radio,
  FileCheck2,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const classes = classService.listClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'class_1');

  // Attendance simulation state
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    'user_student_1': 'present',
    'student_2': 'present',
    'student_3': 'late',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Assignment creation modal
  const [newAssignmentModal, setNewAssignmentModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const students = [
    { id: 'user_student_1', name: 'حسام ناصری', score: 85 },
    { id: 'student_2', name: 'مریم احمدی', score: 92 },
    { id: 'student_3', name: 'امیر رضایی', score: 78 },
  ];

  const handleSetAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentTitle) return;
    const selectedClass = classes.find((c) => c.id === selectedClassId);
    assignmentService.createAssignment({
      classId: selectedClassId,
      classTitle: selectedClass?.title || 'کلاس عمومی',
      teacherId: user?.uid || 'teacher_1',
      teacherName: user ? `${user.firstName} ${user.lastName}` : 'استاد دوره',
      title: assignmentTitle,
      description: assignmentDesc,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      maxScore: 100,
    });
    setNewAssignmentModal(false);
    setAssignmentTitle('');
    setAssignmentDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      {/* Teacher Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>سامانه مدرسین آکادمی پل</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            پنل اختصاصی استاد: {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-xs text-slate-400">
            مدیریت کلاس‌ها، ثبت نمرات، حضور و غیاب و شروع اتاق تدریس آنلاین
          </p>
        </div>

        <Link to={`/live/${selectedClassId}`}>
          <Button size="lg" variant="danger" icon={<Radio className="w-4 h-4 animate-pulse" />}>
            شروع پخش زنده تدریس
          </Button>
        </Link>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">انتخاب کلاس فعال:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.title} ({cls.schedule?.days ? cls.schedule.days.join('، ') : 'جلسات هفتگی'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setNewAssignmentModal(true)}
          >
            تعریف تکلیف جدید
          </Button>
        </div>
      </div>

      {/* Attendance & Grading Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Attendance Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              <span>حضور و غیاب جلسه جاری ({currentClass.title})</span>
            </h3>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                حضور و غیاب ثبت گردید ✓
              </span>
            )}
          </div>

          <Card className="p-0 overflow-hidden divide-y divide-slate-100">
            {students.map((student) => {
              const status = attendance[student.id] || 'present';
              return (
                <div key={student.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                      <span className="text-[11px] text-slate-400">میانگین آزمون‌ها: {toPersianDigits(student.score)}/۱۰۰</span>
                    </div>
                  </div>

                  {/* Attendance buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => handleSetAttendance(student.id, 'present')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        status === 'present' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      حاضر
                    </button>
                    <button
                      onClick={() => handleSetAttendance(student.id, 'late')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        status === 'late' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      تأخیر
                    </button>
                    <button
                      onClick={() => handleSetAttendance(student.id, 'absent')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        status === 'absent' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      غایب
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-slate-50 flex justify-end">
              <Button size="sm" onClick={handleSaveAttendance}>
                ذخیره نهایی لیست حضور و غیاب
              </Button>
            </div>
          </Card>
        </div>

        {/* Assignments & Homework List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <span>تکالیف فعال کلاس</span>
          </h3>

          <div className="space-y-3">
            {assignmentService.listAssignmentsByClass(selectedClassId).map((a) => (
              <Card key={a.id} className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{a.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>مهلت: ۷ روز</span>
                  <Badge variant="blue" size="sm">
                    {toPersianDigits(students.length)} ارسال شده
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* New Assignment Modal */}
      {newAssignmentModal && (
        <Modal
          isOpen={newAssignmentModal}
          onClose={() => setNewAssignmentModal(false)}
          title="ثبت تکلیف کلاسی جدید"
        >
          <form onSubmit={handleCreateAssignment} className="space-y-4 text-right">
            <Input
              label="عنوان تکلیف"
              required
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="مثلاً رایتینگ تسک ۲ - موضوع آلودگی هوا"
            />
            <Input
              label="توضیحات و دستورالعمل انجام"
              value={assignmentDesc}
              onChange={(e) => setAssignmentDesc(e.target.value)}
              placeholder="دستورالعمل، حداقل تعداد کلمات و نکات بارم‌بندی..."
            />
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setNewAssignmentModal(false)}>
                انصراف
              </Button>
              <Button type="submit">
                انتشار برای دانش‌آموزان
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
