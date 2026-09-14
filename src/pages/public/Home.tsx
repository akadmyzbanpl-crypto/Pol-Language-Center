import React from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { bookService } from '../../services/bookService';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Users,
  Award,
  Video,
  CheckCircle2,
  BookOpen,
  Clock,
  ChevronLeft,
  Star,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

export const Home: React.FC = () => {
  const courses = courseService.listCourses().slice(0, 4);
  const books = bookService.listBooks().slice(0, 3);

  const stats = [
    { label: 'زبان‌آموز موفق', value: '۵,۲۰۰+', icon: Users },
    { label: 'نرخ قبولی آیلتس ۷+', value: '۹۸٪', icon: Award },
    { label: 'دوره و کلاس تخصصی', value: '۱۲۰+', icon: BookOpen },
    { label: 'ساعت آموزش ویدیویی', value: '۴۵۰+', icon: Video },
  ];

  const features = [
    {
      title: 'کلاس‌های آنلاین با تعامل زنده',
      desc: 'سیستم شبیه‌ساز کلاس زنده همراه با گفتگوی صوتی، تصویری و چت کلاسی بی‌وقفه.',
      icon: Video,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'اساتید مجرب و دارای مدرک بین‌المللی',
      desc: 'تدریس توسط دارندگان مدارک CELTA, DELTA و اگزمینرهای رسمی آیلتس.',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'فروشگاه منابع و کتاب‌های معتبر',
      desc: 'دسترسی آسان و سریع به جدیدترین کتاب‌های زبان همراه با تخفیف‌های ویژه دانش‌آموزان.',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'پشتیبانی و رفع اشکال مستمر',
      desc: 'ارائه تکالیف هفتگی، تصحیح رایتینگ‌ها و بازخورد صوتی انفرادی برای هر زبان‌آموز.',
      icon: Headphones,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  const testimonials = [
    {
      name: 'امیرحسین کاظمی',
      score: 'IELTS Band 8.0',
      text: 'دوره مسترکلاس آیلتس آموزشگاه پل دقیقاً همان چیزی بود که نیاز داشتم. تکنیک‌های رایتینگ تسک ۲ دکتر رضایی فوق‌العاده کاربردی و نمره‌ساز بودند.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'نیلوفر صادقی',
      score: 'مکالمه روان و مصاحبه کاری',
      text: 'ورکشاپ‌های مکالمه استاد احمدی به من اعتماد به نفس داد تا مصاحبه کاری بین‌المللی با شرکتی در آلمان را با موفقیت پشت سر بگذارم.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right text column (RTL) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>پل به سوی آینده‌ای بهتر | Pol Language Center</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">
                یادگیری اصولی زبان انگلیسی،{' '}
                <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">
                  هوشمند و هدفمند
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                با مجرب‌ترین اساتید، دوره‌های جامع آیلتس، کلاس‌های آنلاین زنده و سیستم نوین ارزیابی مستمر، مهارت گفتاری و شنیداری خود را با بالاترین استاندارد ارتقا دهید.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/courses">
                  <Button size="lg" icon={<ArrowLeft className="w-5 h-5" />}>
                    مشاهده دوره‌های آموزشی
                  </Button>
                </Link>
                <Link to="/live/class_1">
                  <Button variant="outline" size="lg" icon={<Video className="w-5 h-5 text-rose-500" />}>
                    ورود به کلاس آنلاین زنده
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تعیین سطح و مشاوره تخصصی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ارائه مدرک معتبر پایان دوره</span>
                </div>
              </div>
            </div>

            {/* Left Image / Visual Card column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Backdrop blob */}
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                    alt="Pol Language Center Learning"
                    className="w-full h-[400px] object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-right">
                    <span className="text-xs font-bold text-blue-400">کلاس‌های تعاملی و گفتگو محور</span>
                    <h3 className="text-lg font-black mt-1">تجربه واقعی صحبت کردن به زبان انگلیسی</h3>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">تضمین کیفیت و پشتیبانی</p>
                    <p className="text-[11px] text-slate-500">مشاوره مداوم تحصیلی</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="text-center p-5 bg-white border-slate-200/90 shadow-sm">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1" dir="ltr">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">چرا آموزشگاه زبان پل؟</h2>
          <p className="text-sm text-slate-600 mt-2">
            استانداردهای بین‌المللی آموزشی را در محیطی مدرن و مجهز تجربه کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hoverEffect className="text-right p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="text-right">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">محبوب‌ترین دوره‌های آموزشی</h2>
            <p className="text-xs text-slate-500 mt-1">با برترین دوره‌های تخصصی مهارت‌های چهارگانه زبان را تقویت کنید</p>
          </div>
          <Link to="/courses" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>مشاهده همه دوره‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course.id} hoverEffect className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="blue">{course.level}</Badge>
                  </div>
                  {course.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      %{toPersianDigits(course.discountPercent)} تخفیف
                    </div>
                  )}
                </div>

                <div className="p-5 text-right space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>مدرس: {course.teacherName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{toPersianDigits(course.durationHours)} ساعت</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{toPersianDigits(course.sessionCount)} جلسه</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between">
                <div className="text-right">
                  {course.discountPercent > 0 && (
                    <span className="block text-[11px] text-slate-400 line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                  <span className="text-sm font-black text-blue-600">
                    {formatPrice(course.finalPrice)}
                  </span>
                </div>
                <Link to={`/courses/${course.slug}`}>
                  <Button size="sm" variant="outline">
                    مشاهده جزئیات
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bookstore Preview */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">کتاب‌ها و منابع آموزشی معتبر</h2>
              <p className="text-xs text-slate-500 mt-1">ارسال سریع کتب کمبریج و آکسفورد به سراسر کشور</p>
            </div>
            <Link to="/books" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>ورود به فروشگاه کتاب</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} hoverEffect className="p-4 flex gap-4 text-right">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-24 h-32 object-cover rounded-xl shadow-sm flex-shrink-0"
                />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <Badge variant="slate" size="sm" className="mb-1">
                      {book.category}
                    </Badge>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{book.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{book.author}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-blue-600">{formatPrice(book.finalPrice)}</span>
                    <Link to={`/books/${book.id}`}>
                      <Button size="sm" variant="secondary">
                        خرید
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">نظرات زبان‌آموزان موفق پل</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 text-right space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <span className="text-[11px] text-blue-600 font-semibold">{t.score}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 text-white text-right flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">آماده‌اید یادگیری را همین امروز آغاز کنید؟</h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              با شرکت در تعیین سطح تخصصی و مشاوره رایگان آکادمی پل، مسیر مستقیم خود به سمت آیلتس، مهاجرت یا مکالمه بی‌نقص را بیابید.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">
                شروع ثبت نام رایگان
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                تماس و مشاوره تلفنی
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
