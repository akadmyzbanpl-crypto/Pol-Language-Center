import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../lib/validators';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { LogIn, Lock, User as UserIcon, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, switchUserRole } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ identifier, password, rememberMe });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'اطلاعات وارد شده نامعتبر است');
      return;
    }

    setLoading(true);
    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'student' | 'teacher' | 'admin') => {
    switchUserRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'teacher') navigate('/teacher');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">ورود به سامانه آموزشگاه پل</h2>
          <p className="text-xs text-slate-500">
            جهت دسترسی به کلاس‌ها و دوره‌ها اطلاعات خود را وارد نمایید.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-slate-200 text-right">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="نام کاربری یا ایمیل"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="مثلاً hesam_student یا student@demo.com"
              rightIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="رمز عبور"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              rightIcon={<Lock className="w-4 h-4 text-slate-400" />}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>مرا به خاطر بسپار</span>
              </label>

              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading} icon={<LogIn className="w-4 h-4" />}>
              ورود به حساب کاربری
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block text-center">
              ورود آزمایشی سریع (دمو):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickDemo('student')}
                className="p-2 text-xs rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors cursor-pointer"
              >
                دانش‌آموز
              </button>
              <button
                onClick={() => handleQuickDemo('teacher')}
                className="p-2 text-xs rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer"
              >
                استاد
              </button>
              <button
                onClick={() => handleQuickDemo('admin')}
                className="p-2 text-xs rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold transition-colors cursor-pointer"
              >
                مدیر کل
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            هنوز در آموزشگاه پل ثبت نام نکرده‌اید؟{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              ایجاد حساب جدید
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
