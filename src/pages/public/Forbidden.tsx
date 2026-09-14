import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Forbidden: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">دسترسی غیرمجاز (خطای ۴۰۳)</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            شما سطح دسترسی لازم برای مشاهده این بخش یا پنل را ندارید. در صورت نیاز از نوار بالای سایت نقش کاربری خود را بررسی فرمایید.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button>بازگشت به صفحه اصلی</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">ورود با حسابی دیگر</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
