import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { COURSE_LEVELS, CLASS_TYPE_LABELS } from '../../lib/constants';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search, GraduationCap, Clock, BookOpen, Filter } from 'lucide-react';

export const Courses: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = courseService.listCourses();

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchLevel = selectedLevel === 'all' || c.level === selectedLevel;
      const matchType = selectedType === 'all' || c.type === selectedType;
      const matchSearch =
        !searchTerm.trim() ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchLevel && matchType && matchSearch;
    });
  }, [courses, selectedLevel, selectedType, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header banner */}
      <div className="text-right space-y-2">
        <h1 className="text-3xl font-black text-slate-900">دوره‌های آموزشی زبان انگلیسی</h1>
        <p className="text-sm text-slate-500">
          لیست جامع دوره‌های آنلاین، حضوری و هیبرید آموزشگاه زبان پل
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="جستجوی عنوان دوره یا مدرس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">همه سطوح</option>
              {COURSE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">همه نوع کلاس‌ها</option>
            <option value="online">کلاس آنلاین</option>
            <option value="inPerson">کلاس حضوری</option>
            <option value="hybrid">کلاس ترکیبی (هیبرید)</option>
          </select>

          {(selectedLevel !== 'all' || selectedType !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedType('all');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:underline px-2"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="دوره‌ای یافت نشد"
          description="با توجه به فیلترهای انتخابی شما دوره‌ای پیدا نشد. لطفاً فیلترها را تغییر دهید."
          actionText="مشاهده همه دوره‌ها"
          onAction={() => {
            setSelectedLevel('all');
            setSelectedType('all');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} hoverEffect className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Badge variant="blue">{course.level}</Badge>
                    <Badge variant="slate">{CLASS_TYPE_LABELS[course.type]}</Badge>
                  </div>
                  {course.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                      %{toPersianDigits(course.discountPercent)} تخفیف
                    </div>
                  )}
                </div>

                <div className="p-6 text-right space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>مدرس: {course.teacherName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{toPersianDigits(course.durationHours)} ساعت آموزش</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{toPersianDigits(course.sessionCount)} جلسه</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                <div className="text-right">
                  {course.discountPercent > 0 && (
                    <span className="block text-xs text-slate-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                  <span className="text-base font-black text-blue-600">
                    {formatPrice(course.finalPrice)}
                  </span>
                </div>
                <Link to={`/courses/${course.slug}`}>
                  <Button size="sm">
                    جزئیات و ثبت‌نام
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
