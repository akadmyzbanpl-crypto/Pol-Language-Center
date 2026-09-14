import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useCart } from '../../hooks/useCart';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { CLASS_TYPE_LABELS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Clock,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  PlayCircle,
  Lock,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [openLessonIndex, setOpenLessonIndex] = useState<number | null>(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const course = courseService.getCourseBySlug(slug || '');

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">دوره مورد نظر یافت نشد</h2>
        <Link to="/courses" className="mt-4 inline-block text-blue-600 hover:underline">
          بازگشت به لیست دوره‌ها
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      itemType: 'course',
      itemId: course.id,
      title: course.title,
      price: course.price,
      finalPrice: course.finalPrice,
      imageUrl: course.thumbnailUrl,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 text-right">
        <Link to="/" className="hover:text-blue-600">خانه</Link>
        <span>/</span>
        <Link to="/courses" className="hover:text-blue-600">دوره‌ها</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Info (Right in RTL) */}
        <div className="lg:col-span-8 space-y-8 text-right">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue">{course.level}</Badge>
              <Badge variant="slate">{CLASS_TYPE_LABELS[course.type]}</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Teacher preview */}
          <Card className="flex items-center gap-4 p-5 bg-slate-50 border-slate-200/80">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              alt={course.teacherName}
              className="w-14 h-14 rounded-2xl object-cover border border-white shadow-xs"
            />
            <div>
              <p className="text-xs text-slate-400 font-medium">مدرس دوره</p>
              <h4 className="text-base font-bold text-slate-900">{course.teacherName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">استاد بین‌المللی با بیش از ۱۰ سال سابقه آموزش آیلتس</p>
            </div>
          </Card>

          {/* Course Syllabus / Lessons Accordion */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">سرفصل‌ها و جلسات دوره</h3>

            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, idx) => {
                  const isOpen = openLessonIndex === idx;
                  return (
                    <div
                      key={lesson.id}
                      className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenLessonIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-right hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                            {toPersianDigits(lesson.order)}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{lesson.title}</p>
                            <span className="text-xs text-slate-400">{lesson.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {lesson.isFree ? (
                            <Badge variant="emerald" size="sm">
                              پیش‌نمایش رایگان
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Lock className="w-3.5 h-3.5" />
                              <span>ویژه ثبت‌نامی‌ها</span>
                            </div>
                          )}
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50">
                          <p className="leading-relaxed mb-3">{lesson.description}</p>
                          {lesson.isFree && (
                            <Link to="/videos">
                              <Button size="sm" variant="outline" icon={<PlayCircle className="w-4 h-4 text-blue-600" />}>
                                مشاهده جلسه رایگان
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">جلسات این دوره به زودی تکمیل خواهد شد.</p>
            )}
          </div>
        </div>

        {/* Sticky Buy Box (Left in RTL) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <Card className="p-0 overflow-hidden shadow-lg border-slate-200">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-6 text-right space-y-5">
              {/* Pricing */}
              <div>
                <span className="text-xs text-slate-500 block mb-1">شهریه کامل دوره:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-600">
                    {formatPrice(course.finalPrice)}
                  </span>
                  {course.discountPercent > 0 && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full"
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  {addedSuccess ? 'به سبد خرید اضافه شد ✓' : 'افزودن به سبد خرید'}
                </Button>
                <Button onClick={handleBuyNow} className="w-full">
                  ثبت نام فوری در دوره
                </Button>
              </div>

              {/* Course Features list */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>مدت زمان:</span>
                  </span>
                  <span className="font-semibold">{toPersianDigits(course.durationHours)} ساعت</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>تعداد جلسات:</span>
                  </span>
                  <span className="font-semibold">{toPersianDigits(course.sessionCount)} جلسه</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ارائه مدرک پایان دوره:</span>
                  </span>
                  <span className="font-semibold text-emerald-600">دارد</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>پشتیبانی و رفع اشکال:</span>
                  </span>
                  <span className="font-semibold text-blue-600">دائمی</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
