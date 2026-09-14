import React from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toPersianDigits } from '../../lib/formatters';
import { PlayCircle, Clock, BookOpen, Award } from 'lucide-react';

export const MyCourses: React.FC = () => {
  const courses = courseService.listCourses();

  return (
    <div className="space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-black text-slate-900">دوره‌های آموزشی من</h1>
        <p className="text-xs text-slate-500 mt-1">
          لیست دوره‌هایی که در آن‌ها ثبت‌نام کرده‌اید و پیشرفت آموزشی شما
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, idx) => {
          const progress = idx === 0 ? 65 : idx === 1 ? 40 : 15;
          return (
            <Card key={course.id} className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="blue">{course.level}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-500">مدرس: {course.teacherName}</p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">پیشرفت:</span>
                      <span className="text-blue-600">%{toPersianDigits(progress)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {toPersianDigits(course.sessionCount)} جلسه آموزشی
                </span>
                <Link to={`/courses/${course.slug}`}>
                  <Button size="sm" icon={<PlayCircle className="w-4 h-4" />}>
                    ادامه دوره
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
