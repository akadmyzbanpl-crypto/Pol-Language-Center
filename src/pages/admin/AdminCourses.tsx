import React, { useState } from 'react';
import { courseService } from '../../services/courseService';
import { Course, CourseLevel, ClassType } from '../../types';
import { COURSE_LEVELS, CLASS_TYPE_LABELS } from '../../lib/constants';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(courseService.listCourses());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formLevel, setFormLevel] = useState<CourseLevel>('B2 (Upper-Intermediate)');
  const [formType, setFormType] = useState<ClassType>('online');
  const [formPrice, setFormPrice] = useState('3500000');
  const [formDiscount, setFormDiscount] = useState('15');
  const [formTeacher, setFormTeacher] = useState('دکتر علیرضا رضایی');
  const [formDuration, setFormDuration] = useState('40');
  const [formSessions, setFormSessions] = useState('20');
  const [formDesc, setFormDesc] = useState('');
  const [formThumbnail, setFormThumbnail] = useState(
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  );

  const refreshList = () => {
    setCourses(courseService.listCourses());
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormSlug('');
    setFormLevel('B2 (Upper-Intermediate)');
    setFormType('online');
    setFormPrice('3500000');
    setFormDiscount('0');
    setFormTeacher('دکتر علیرضا رضایی');
    setFormDuration('40');
    setFormSessions('20');
    setFormDesc('');
    setModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormSlug(course.slug);
    setFormLevel(course.level);
    setFormType(course.type);
    setFormPrice(course.price.toString());
    setFormDiscount(course.discountPercent.toString());
    setFormTeacher(course.teacherName);
    setFormDuration(course.durationHours.toString());
    setFormSessions(course.sessionCount.toString());
    setFormDesc(course.description);
    setFormThumbnail(course.thumbnailUrl);
    setModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formPrice) || 0;
    const discount = Number(formDiscount) || 0;
    const finalPrice = Math.round(price * (1 - discount / 100));

    if (editingCourse) {
      courseService.updateCourse(editingCourse.id, {
        title: formTitle,
        slug: formSlug || formTitle.toLowerCase().replace(/\s+/g, '-'),
        level: formLevel,
        type: formType,
        price,
        discountPercent: discount,
        finalPrice,
        teacherName: formTeacher,
        durationHours: Number(formDuration) || 30,
        sessionCount: Number(formSessions) || 15,
        description: formDesc,
        thumbnailUrl: formThumbnail,
      });
    } else {
      courseService.createCourse({
        title: formTitle,
        slug: formSlug || 'course-' + Date.now(),
        level: formLevel,
        type: formType,
        price,
        discountPercent: discount,
        teacherName: formTeacher,
        teacherId: 'teacher_1',
        durationHours: Number(formDuration) || 30,
        sessionCount: Number(formSessions) || 15,
        description: formDesc,
        thumbnailUrl: formThumbnail,
        status: 'published',
        lessons: [
          {
            id: 'l1',
            title: 'جلسه اول: آشنایی و ارزیابی تشخیصی',
            description: 'مرور اهداف آموزشی دوره و اصول مکالمه پیشرفته.',
            duration: '90 دقیقه',
            order: 1,
            isFree: true,
          },
        ],
      });
    }
    setModalOpen(false);
    refreshList();
  };

  const handleDeleteCourse = () => {
    if (deleteTargetId) {
      courseService.deleteCourse(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی عنوان دوره یا مدرس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          تعریف دوره آموزشی جدید
        </Button>
      </div>

      {/* Courses Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">عنوان دوره</th>
                <th className="p-4">سطح</th>
                <th className="p-4">شیوه برگزاری</th>
                <th className="p-4">مدرس</th>
                <th className="p-4">شهریه و تخفیف</th>
                <th className="p-4">تعداد جلسات</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnailUrl}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{c.title}</span>
                        <span className="text-[11px] text-slate-400">/{c.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="blue">{c.level}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="slate">{CLASS_TYPE_LABELS[c.type]}</Badge>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{c.teacherName}</td>
                  <td className="p-4">
                    <span className="font-bold text-blue-600 block">{formatPrice(c.finalPrice)}</span>
                    {c.discountPercent > 0 && (
                      <span className="text-[10px] text-rose-500 font-semibold">
                        %{toPersianDigits(c.discountPercent)} تخفیف
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600">
                    {toPersianDigits(c.sessionCount)} جلسه ({toPersianDigits(c.durationHours)} ساعت)
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(c.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف دوره"
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
          title={editingCourse ? 'ویرایش مشخصات دوره' : 'تعریف دوره آموزشی جدید'}
          size="lg"
        >
          <form onSubmit={handleSaveCourse} className="space-y-4 text-right">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="عنوان دوره"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="مثلاً دوره جامع آیلتس آکادمیک"
              />
              <Input
                label="نامک (Slug آدرس وبسایت)"
                dir="ltr"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="ielts-masterclass"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="سطح دوره"
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value as CourseLevel)}
                options={COURSE_LEVELS.map((l) => ({ label: l, value: l }))}
              />
              <Select
                label="شیوه برگزاری"
                value={formType}
                onChange={(e) => setFormType(e.target.value as ClassType)}
                options={[
                  { label: 'آنلاین زنده', value: 'online' },
                  { label: 'حضوری', value: 'inPerson' },
                  { label: 'ترکیبی (هیبرید)', value: 'hybrid' },
                ]}
              />
              <Input
                label="نام استاد مدرس"
                required
                value={formTeacher}
                onChange={(e) => setFormTeacher(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="شهریه اصلی (تومان)"
                type="number"
                required
                dir="ltr"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
              <Input
                label="درصد تخفیف"
                type="number"
                dir="ltr"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
              />
              <Input
                label="مدت آموزش (ساعت)"
                type="number"
                dir="ltr"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
              />
              <Input
                label="تعداد جلسات"
                type="number"
                dir="ltr"
                value={formSessions}
                onChange={(e) => setFormSessions(e.target.value)}
              />
            </div>

            <Input
              label="آدرس تصویر شاخص (Thumbnail URL)"
              dir="ltr"
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
            />

            <Textarea
              label="توضیحات و اهداف دوره"
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">
                {editingCourse ? 'ذخیره تغییرات' : 'ایجاد دوره'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteCourse}
        title="حذف دوره"
        message="آیا از حذف این دوره اطمینان دارید؟ تمامی جلسات مربوطه حذف خواهند شد."
        confirmText="بله، حذف شود"
      />
    </div>
  );
};
