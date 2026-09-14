import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { reportService } from '../../services/reportService';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Video,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Radio,
  FileCheck2,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const enrolledCourses = courseService.listCourses().slice(0, 2);
  const upcomingClasses = classService.listClasses().filter((c) => c.status === 'ongoing');
  const assignments = assignmentService.listAssignmentsByClass('class_1');

  return (
    <div className="space-y-8 text-right">
      {/* Welcome Banner with Live Class Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-right">
          <span className="text-xs text-blue-200 font-bold">سامانه مدیریت یادگیری آموزشگاه پل</span>
          <h1 className="text-2xl sm:text-3xl font-black">
            سلام، {user?.firstName || 'زبان‌آموز گرامی'}! خوش آمدید.
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            کلاس بعدی شما «مسترکلاس جامع آیلتس» همین امروز در سامانه فعال است. می‌توانید وارد کلاس زنده شوید.
          </p>
        </div>

        <Link to="/live/class_1" className="flex-shrink-0">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold" icon={<Radio className="w-4 h-4 text-rose-600 animate-pulse" />}>
            ورود به کلاس آنلاین
          </Button>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">دوره‌های من</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{toPersianDigits(2)} دوره</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">حضور در کلاس‌ها</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">۹۵٪</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">تکالیف تحویل شده</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{toPersianDigits(4)} تکلیف</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">جلسات باقیمانده</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{toPersianDigits(12)} جلسه</h3>
          </div>
        </Card>
      </div>

      {/* Enrolled Courses & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: My Courses Progress (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">دوره‌های در حال یادگیری</h3>
            <Link to="/dashboard/my-courses" className="text-xs font-bold text-blue-600 hover:underline">
              مشاهده همه
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.map((course, idx) => {
              const progress = idx === 0 ? 65 : 40;
              return (
                <Card key={course.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-20 h-20 rounded-2xl object-cover shadow-xs flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <Badge variant="blue" size="sm">
                        {course.level}
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                      <p className="text-xs text-slate-500">مدرس: {course.teacherName}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-60 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">پیشرفت دوره:</span>
                      <span className="text-blue-600">%{toPersianDigits(progress)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <Link to={`/courses/${course.slug}`} className="block pt-1">
                      <Button size="sm" variant="outline" className="w-full">
                        ادامه مشاهده جلسات
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pending Homework */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-black text-slate-900">تکالیف کلاسی من</h3>
            <div className="space-y-3">
              {assignments.map((ass) => (
                <Card key={ass.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ass.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ass.description}</p>
                  </div>
                  <Badge variant="amber" size="sm">
                    مهلت: تا فردا
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Schedule & Quick Live (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>برنامه جلسات این هفته</span>
            </h3>

            <div className="space-y-3 text-xs">
              {upcomingClasses.map((c) => (
                <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="font-bold text-slate-800 block truncate">{c.title}</span>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{c.schedule?.days ? c.schedule.days.join(' و ') : 'جلسات هفتگی'}</span>
                    <span dir="ltr">{c.schedule?.time ? toPersianDigits(c.schedule.time) : (c.startTime ? toPersianDigits(c.startTime) : '')}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/dashboard/schedule" className="block pt-2">
              <Button variant="secondary" size="sm" className="w-full">
                مشاهده تقویم کامل
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
