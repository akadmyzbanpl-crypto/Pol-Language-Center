import React from 'react';
import { Card } from '../../components/ui/Card';
import { Award, BookOpen, Users, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ACADEMY_NAME, ACADEMY_SLOGAN } from '../../lib/constants';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-right">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">درباره {ACADEMY_NAME}</h1>
        <p className="text-base text-blue-600 font-bold">{ACADEMY_SLOGAN}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            آموزشگاه زبان پل با هدف ارتقای استانداردهای آموزش زبان انگلیسی در ایران و ایجاد پلی مستحکم به سوی فرصت‌های تحصیلی، شغلی و بین‌المللی بنیان‌گذاری شده است.
          </p>
          <p>
            ما باور داریم زبان تنها مجموعه‌ای از کلمات و قوانین گرامری نیست؛ بلکه ابزاری زنده برای برقراری ارتباط، درک فرهنگ‌ها و خلق فرصت‌های تازه است. در آکادمی پل، با تلفیق جدیدترین متدهای آموزشی روز دنیا (مانند Communicative Language Teaching) و بسترهای فناورانه نوین، یادگیری زبان را لذت‌بخش و مؤثر ساخته‌ایم.
          </p>
          <p>
            سیستم آموزشی هوشمند ما شامل کلاس‌های آنلاین با زیرساخت اختصاصی، تصحیح مستمر تکالیف و نمرات و ارزیابی فردی هر زبان‌آموز در مسیر آیلتس و مکالمه پیشرفته است.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
            alt="About Pol Academy"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">ماموریت ما</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            آموزش هدفمند و باکیفیت برای توانمندسازی افراد در دستیابی به مدارک بین‌المللی و مکالمه بدون استرس.
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">مجوزها و استانداردها</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            دارای تاییدیه رسمی از وزارت آموزش و پرورش و تطابق با استانداردهای چارچوب اروپایی CEFR.
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">کادر اساتید حرفه‌ای</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            مدرسین دارای مدارک بین‌المللی CELTA و DELTA با سابقه‌های درخشان در آزمون‌های آیلتس.
          </p>
        </Card>
      </div>
    </div>
  );
};
