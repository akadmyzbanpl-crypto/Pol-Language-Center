import React, { useState } from 'react';
import { classService } from '../../services/classService';
import { courseService } from '../../services/courseService';
import { ClassSchedule, ClassType } from '../../types';
import { CLASS_TYPE_LABELS } from '../../lib/constants';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, CalendarDays, Search, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassSchedule[]>(classService.listClasses());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTeacher, setFormTeacher] = useState('دکتر علیرضا رضایی');
  const [formType, setFormType] = useState<ClassType>('online');
  const [formDays, setFormDays] = useState('شنبه، دوشنبه');
  const [formTime, setFormTime] = useState('18:00 - 19:30');
  const [formDuration, setFormDuration] = useState('90');
  const [formCapacity, setFormCapacity] = useState('15');
  const [formPrice, setFormPrice] = useState('2900000');
  const [formRoom, setFormRoom] = useState('اتاق آنلاین شماره ۱');
  const [formStatus, setFormStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('ongoing');

  const refreshList = () => {
    setClasses(classService.listClasses());
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setFormTitle('');
    setFormTeacher('دکتر علیرضا رضایی');
    setFormType('online');
    setFormDays('شنبه، دوشنبه');
    setFormTime('18:00 - 19:30');
    setFormDuration('90');
    setFormCapacity('15');
    setFormPrice('2900000');
    setFormRoom('اتاق آنلاین شماره ۱');
    setFormStatus('ongoing');
    setModalOpen(true);
  };

  const openEditModal = (cls: ClassSchedule) => {
    setEditingClass(cls);
    setFormTitle(cls.title);
    setFormTeacher(cls.teacherName);
    setFormType(cls.type);
    setFormDays(cls.schedule.days.join('، '));
    setFormTime(cls.schedule.time);
    setFormDuration(cls.sessionDurationMinutes.toString());
    setFormCapacity(cls.capacity.toString());
    setFormPrice(cls.price.toString());
    setFormRoom(cls.roomOrLink || '');
    setFormStatus(cls.status);
    setModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const daysArray = formDays.split('،').map((d) => d.trim()).filter(Boolean);

    if (editingClass) {
      classService.updateClass(editingClass.id, {
        title: formTitle,
        teacherName: formTeacher,
        type: formType,
        schedule: { days: daysArray, time: formTime },
        sessionDurationMinutes: Number(formDuration) || 90,
        capacity: Number(formCapacity) || 15,
        price: Number(formPrice) || 2500000,
        roomOrLink: formRoom,
        status: formStatus,
      });
    } else {
      classService.createClass({
        courseId: 'course_1',
        courseTitle: 'مسترکلاس جامع آیلتس',
        title: formTitle,
        teacherId: 'teacher_1',
        teacherName: formTeacher,
        level: 'متوسط (B1-B2)',
        type: formType,
        weekDays: [0, 2],
        startTime: formTime || '18:00',
        endTime: '19:30',
        endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
        schedule: { days: daysArray, time: formTime },
        sessionDurationMinutes: Number(formDuration) || 90,
        capacity: Number(formCapacity) || 15,
        price: Number(formPrice) || 2500000,
        startDate: new Date().toISOString(),
        roomOrLink: formRoom,
        status: formStatus,
      });
    }
    setModalOpen(false);
    refreshList();
  };

  const handleDeleteClass = () => {
    if (deleteTargetId) {
      classService.deleteClass(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی کلاس یا استاد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          تعریف ترم و کلاس جدید
        </Button>
      </div>

      {/* Classes Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">عنوان کلاس / ترم</th>
                <th className="p-4">مدرس</th>
                <th className="p-4">شیوه</th>
                <th className="p-4">روز و ساعت برگزاری</th>
                <th className="p-4">ظرفیت</th>
                <th className="p-4">شهریه</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{cls.title}</span>
                    <span className="text-[11px] text-slate-400">{cls.roomOrLink}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{cls.teacherName}</td>
                  <td className="p-4">
                    <Badge variant="blue">{CLASS_TYPE_LABELS[cls.type]}</Badge>
                  </td>
                  <td className="p-4">
                    <span className="block text-slate-800">{cls.schedule.days.join('، ')}</span>
                    <span className="text-slate-400 font-mono text-[11px]" dir="ltr">
                      {cls.schedule.time}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900">
                      {toPersianDigits(cls.enrolledCount)} / {toPersianDigits(cls.capacity)}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{formatPrice(cls.price)}</td>
                  <td className="p-4">
                    <Badge
                      variant={cls.status === 'ongoing' ? 'emerald' : cls.status === 'upcoming' ? 'blue' : 'slate'}
                      size="sm"
                    >
                      {cls.status === 'ongoing' ? 'در حال برگزاری' : cls.status === 'upcoming' ? 'ترم بعد' : 'پایان یافته'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {cls.type === 'online' && (
                        <Link
                          to={`/live/${cls.id}`}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="ورود به پخش زنده"
                        >
                          <Radio className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => openEditModal(cls)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(cls.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف کلاس"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingClass ? 'ویرایش کلاس' : 'تعریف ترم و کلاس جدید'}
        >
          <form onSubmit={handleSaveClass} className="space-y-4 text-right">
            <Input
              label="عنوان کلاس"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="مثلاً کلاس مکالمه فشرده کد 102"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="نام مدرس"
                required
                value={formTeacher}
                onChange={(e) => setFormTeacher(e.target.value)}
              />
              <Select
                label="شیوه تشکیل کلاس"
                value={formType}
                onChange={(e) => setFormType(e.target.value as ClassType)}
                options={[
                  { label: 'آنلاین در پلتفرم زنده', value: 'online' },
                  { label: 'حضوری در شعبه ونک', value: 'inPerson' },
                  { label: 'ترکیبی (هیبرید)', value: 'hybrid' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="روزهای برگزاری (با ویرگول جدا کنید)"
                value={formDays}
                onChange={(e) => setFormDays(e.target.value)}
                placeholder="مثلاً شنبه، چهارشنبه"
              />
              <Input
                label="ساعت کلاس"
                dir="ltr"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                placeholder="18:00 - 19:30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="ظرفیت (نفر)"
                type="number"
                dir="ltr"
                value={formCapacity}
                onChange={(e) => setFormCapacity(e.target.value)}
              />
              <Input
                label="شهریه ترم (تومان)"
                type="number"
                dir="ltr"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
              <Select
                label="وضعیت کلاس"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                options={[
                  { label: 'در حال برگزاری', value: 'ongoing' },
                  { label: 'شروع از ترم بعد', value: 'upcoming' },
                  { label: 'پایان یافته', value: 'completed' },
                ]}
              />
            </div>

            <Input
              label="شماره اتاق یا لینک پلتفرم"
              value={formRoom}
              onChange={(e) => setFormRoom(e.target.value)}
              placeholder="مثلاً اتاق آنلاین شماره ۲ یا کلاس ۱۰۳ حضوری"
            />

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">
                {editingClass ? 'ذخیره تغییرات' : 'ایجاد کلاس'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteClass}
        title="حذف کلاس"
        message="آیا از حذف این کلاس اطمینان دارید؟ تمامی ساعات و حضور غیاب‌های آن حذف خواهد شد."
        confirmText="بله، حذف کن"
      />
    </div>
  );
};
