import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { CheckCircle2, Save, Building, Phone, Mail, Globe, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [academyName, setAcademyName] = useState('آموزشگاه زبان پل (Pol Language Center)');
  const [phone, setPhone] = useState('021-88776655');
  const [email, setEmail] = useState('info@pol-academy.ir');
  const [address, setAddress] = useState('تهران، میدان ونک، خیابان ولیعصر، برج سپهر، طبقه چهارم');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 text-right">
      <div>
        <h2 className="text-xl font-black text-slate-900">تنظیمات اصلی آکادمی پل</h2>
        <p className="text-xs text-slate-500 mt-0.5">مدیریت اطلاعات تماس، آدرس شعب و وضعیت ثبت‌نام ترم جدید</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تنظیمات عمومی با موفقیت ذخیره گردید.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="نام رسمی آموزشگاه"
            required
            value={academyName}
            onChange={(e) => setAcademyName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="تلفن پشتیبانی و مشاوره"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="ایمیل سازمانی"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Textarea
            label="نشانی شعبه مرکزی"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">ثبت‌نام آنلاین ترم جدید</span>
              <span className="text-[11px] text-slate-500">
                در صورت غیرفعال بودن، دکمه‌های ثبت‌نام در دوره‌ها به حالت «بسته شد» تغییر می‌یابند.
              </span>
            </div>
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3">
            <Button type="submit" size="lg" icon={<Save className="w-4 h-4" />}>
              ذخیره تغییرات سامانه
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
