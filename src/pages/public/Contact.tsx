import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { ACADEMY_PHONE, ACADEMY_EMAIL, ACADEMY_ADDRESS } from '../../lib/constants';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-right">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">ارتباط با آموزشگاه زبان پل</h1>
        <p className="text-sm text-slate-500">
          مشاوران آموزشی ما آماده پاسخگویی به سوالات شما و تعیین وقت مصاحبه حضوری یا آنلاین هستند.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Hours (Right in RTL) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              اطلاعات تماس مستقیم
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">نشانی آکادمی:</span>
                  <p className="mt-0.5">{ACADEMY_ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">تلفن پشتیبانی و ثبت نام:</span>
                  <p className="mt-0.5" dir="ltr">{ACADEMY_PHONE}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">پست الکترونیک:</span>
                  <p className="mt-0.5" dir="ltr">{ACADEMY_EMAIL}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">ساعات کاری و پاسخگویی:</span>
                  <p className="mt-0.5">شنبه تا پنج‌شنبه: ۸:۰۰ صبح الی ۲۰:۳۰ شب</p>
                  <p className="text-slate-400">جمعه‌ها: ۱۰:۰۰ الی ۱۴:۰۰ (پشتیبانی آنلاین)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              ارسال پیام یا درخواست مشاوره
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-emerald-800">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">پیام شما با موفقیت دریافت شد!</h4>
                <p className="text-xs text-emerald-700">
                  کارشناسان آموزشگاه پل در کمتر از ۲۴ ساعت کاری با شما تماس خواهند گرفت.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="نام و نام خانوادگی"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="شماره تماس"
                    required
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <Input
                  label="موضوع پیام"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="مثلاً درخواست تعیین سطح آیلتس یا سوال درباره دوره‌ها"
                />

                <Textarea
                  label="متن پیام شما"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="پیام یا پرسش خود را اینجا بنویسید..."
                />

                <Button type="submit" size="lg" className="w-full" icon={<Send className="w-4 h-4" />}>
                  ارسال پیام به واحد پشتیبانی
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
