import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال ایمیل بازیابی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">بازیابی رمز عبور</h2>
          <p className="text-xs text-slate-500">
            ایمیل حساب کاربری خود را وارد کنید تا پیوند تغییر رمز عبور برای شما ارسال گردد.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 text-right">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">ایمیل بازیابی ارسال شد</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                لطفاً صندوق دریافت (و پوشه اسپم) ایمیل <strong>{email}</strong> را بررسی فرمایید.
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="outline" className="w-full">
                  بازگشت به صفحه ورود
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold">
                  {error}
                </div>
              )}
              <Input
                label="ایمیل حساب کاربری"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                rightIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />
              <Button type="submit" size="lg" className="w-full" loading={loading}>
                ارسال لینک بازیابی
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-blue-600 hover:underline">
                  به خاطر آوردم، بازگشت به ورود
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
