import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { GraduationCap, Award, BookOpen, Star, Mail } from 'lucide-react';

export const Teachers: React.FC = () => {
  const teachers = [
    {
      id: 't1',
      name: 'دکتر علیرضا رضایی',
      role: 'مدرس ارشد آیلتس و تافل',
      bio: 'دکترای آموزش زبان انگلیسی از دانشگاه تهران، با بیش از ۱۲ سال سابقه تدریس دوره‌های آمادگی آزمون‌های بین‌المللی و دارنده مدرک DELTA کمبریج.',
      degrees: ['Ph.D. in TEFL', 'Cambridge DELTA', 'Official IELTS Examiner (Former)'],
      rating: 4.9,
      studentsCount: '۱,۴۰۰+',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 't2',
      name: 'استاد سارا احمدی',
      role: 'مدرس مکالمه پیشرفته و بیزینس',
      bio: 'کارشناس ارشد مترجمی زبان انگلیسی و متخصص آموزش مکالمه فشرده با متد تعاملی و داستان‌سرایی، برگزارکننده کارگاه‌های مکاتبات تجاری بین‌المللی.',
      degrees: ['M.A. in Translation Studies', 'CELTA Certified', 'Business English Specialist'],
      rating: 4.8,
      studentsCount: '۹۵۰+',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 't3',
      name: 'مهندس کاوه مرادی',
      role: 'مدرس اصطلاحات و گرامر کاربردی',
      bio: 'بیش از ۸ سال تدریس سطوح متوسط و پیشرفته زبان انگلیسی، طراح جزوات انحصاری تکنیک‌های درک شنیداری و گرامر تحلیلی برای دانشجویان مهاجرت.',
      degrees: ['B.A. in English Literature', 'TKT Certified', 'Listening & Accent Coach'],
      rating: 4.9,
      studentsCount: '۱,۱۰۰+',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div>
        <h1 className="text-3xl font-black text-slate-900">کادر علمی و اساتید آموزشگاه پل</h1>
        <p className="text-sm text-slate-500 mt-1">
          با مجرب‌ترین مدرسین دارای مدارک بین‌المللی کمبریج و سوابق درخشان آموزشی آشنا شوید
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teachers.map((teacher) => (
          <Card key={teacher.id} hoverEffect className="p-0 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-64 overflow-hidden bg-slate-100 relative">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{teacher.rating}</span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg font-black text-slate-900">{teacher.name}</h3>
                <p className="text-xs font-bold text-blue-600">{teacher.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{teacher.bio}</p>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 block">مدارک و افتخارات:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.degrees.map((d, i) => (
                      <Badge key={i} variant="slate" size="sm">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{teacher.studentsCount} زبان‌آموز</span>
              </div>
              <Badge variant="emerald" size="sm">
                مدرس فعال
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
