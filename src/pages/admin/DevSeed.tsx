import React, { useState } from 'react';
import { storeService } from '../../services/storeService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RefreshCw, CheckCircle2, Database, ShieldAlert } from 'lucide-react';

export const DevSeed: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    storeService.resetToSeed();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <div>
        <h2 className="text-xl font-black text-slate-900">بازنشانی و پر کردن دیتابیس دمو (Seed Data)</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          این ابزار تمام اطلاعات ذخیره شده در حافظه محلی را به داده‌های اولیه و غنی آزمایشی بازمی‌گرداند.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">داده‌های پیش‌فرض پل</h3>
            <p className="text-xs text-slate-500 mt-1">
              شامل ۳ کاربر (ادمین، استاد، دانش‌آموز)، ۴ دوره آموزشی کامل، کلاس‌های زنده، ۵ کتاب و تراکنش‌های بانکی نمونه.
            </p>
          </div>
        </div>

        {resetSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>اطلاعات اولیه با موفقیت بارگذاری شد و صفحه در حال تازه‌سازی است...</span>
          </div>
        )}

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/70 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            با کلیک بر روی دکمه زیر، تمامی سفارشات جدید یا دوره‌هایی که اضافه کرده‌اید حذف شده و پایگاه داده با نمونه اولیه جایگزین خواهد شد.
          </p>
        </div>

        <Button
          onClick={handleReset}
          size="lg"
          variant="danger"
          className="w-full"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          بازنشانی کامل داده‌های اولیه دمو
        </Button>
      </Card>
    </div>
  );
};
