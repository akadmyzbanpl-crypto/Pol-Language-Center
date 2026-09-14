import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">صفحه مورد نظر پیدا نشد (۴۰۴)</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            صفحه‌ای که به دنبال آن هستید حذف شده یا آدرس آن تغییر یافته است.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button>بازگشت به صفحه اصلی</Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline">مشاهده دوره‌ها</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
