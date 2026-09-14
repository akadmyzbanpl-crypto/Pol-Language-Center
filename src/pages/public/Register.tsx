import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../lib/validators';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { UserPlus, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'اطلاعات وارد شده نامعتبر است');
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">عضویت در آموزشگاه زبان پل</h2>
          <p className="text-xs text-slate-500">
            برای شرکت در کلاس‌ها و خرید دوره‌ها حساب کاربری خود را ایجاد فرمایید.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-slate-200 text-right">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="نام"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="مثلاً علی"
              />
              <Input
                label="نام خانوادگی"
                required
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="مثلاً حسینی"
              />
            </div>

            <Input
              label="نام کاربری (انگلیسی و یکتا)"
              required
              dir="ltr"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="ali_hosseini"
              helperText="فقط حروف انگلیسی، اعداد و خط زیر مجاز است."
              rightIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="شماره موبایل"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="09123456789"
                rightIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="آدرس ایمیل"
                type="email"
                required
                dir="ltr"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="ali@example.com"
                rightIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="رمز عبور"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                rightIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="تکرار رمز عبور"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="تکرار رمز عبور"
                rightIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full" loading={loading} icon={<UserPlus className="w-4 h-4" />}>
                تکمیل ثبت نام و ورود به داشبورد
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              ورود به حساب
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
