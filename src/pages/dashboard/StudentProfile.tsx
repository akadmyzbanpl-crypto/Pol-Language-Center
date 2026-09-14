import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Phone, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        avatarUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-black text-slate-900">پروفایل کاربری من</h1>
        <p className="text-xs text-slate-500 mt-1">مشاهده و ویرایش اطلاعات حساب کاربری در آموزشگاه پل</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.</span>
          </div>
        )}

        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt="User avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{firstName} {lastName}</h3>
            <span className="text-xs text-blue-600 font-medium">نقش: {user?.role === 'admin' ? 'مدیر' : user?.role === 'teacher' ? 'مدرس' : 'دانش‌آموز'}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="نام"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="نام خانوادگی"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="نام کاربری (غیرقابل ویرایش)"
              disabled
              dir="ltr"
              value={user?.username || ''}
            />
            <Input
              label="ایمیل (غیرقابل ویرایش)"
              disabled
              dir="ltr"
              value={user?.email || ''}
            />
          </div>

          <Input
            label="شماره موبایل"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="آدرس تصویر پروفایل (Avatar URL)"
            dir="ltr"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
