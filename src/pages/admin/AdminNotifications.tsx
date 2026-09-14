import React, { useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { formatPersianDate } from '../../lib/formatters';

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(notificationService.listNotifications());
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    notificationService.broadcastNotification(title, message, type);
    setNotifications(notificationService.listNotifications());
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-right">
      <div>
        <h2 className="text-xl font-black text-slate-900">ارسال اعلان‌ها و پیام‌های همگانی</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ارسال اطلاعیه‌های تعطیلی، امتحانات و تخفیف‌ها به تمام کاربران یا نقش‌های مشخص
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>ارسال اعلان جدید</span>
            </h3>

            {sentSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>اعلان با موفقیت به همه کاربران ارسال شد.</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <Input
                label="عنوان پیام"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً تغییر ساعت کلاس‌های پنج‌شنبه"
              />

              <Select
                label="نوع پیام"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                options={[
                  { label: 'اطلاعیه عمومی (آبی)', value: 'info' },
                  { label: 'مهم / هشدار (زرد)', value: 'warning' },
                  { label: 'رویداد موفقیت / تخفیف (سبز)', value: 'success' },
                ]}
              />

              <Textarea
                label="متن پیام اعلان"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="متن کامل پیام جهت نمایش در نوار اعلان کاربران..."
              />

              <Button type="submit" className="w-full" icon={<Send className="w-4 h-4" />}>
                ارسال اعلان به همه
              </Button>
            </form>
          </Card>
        </div>

        {/* List of Sent Notifications (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">اعلان‌های ارسال شده اخیر</h3>

          <div className="space-y-3">
            {notifications.map((n) => (
              <Card key={n.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <Badge variant={n.type === 'success' ? 'emerald' : n.type === 'warning' ? 'amber' : 'blue'}>
                    {n.type}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {formatPersianDate(n.createdAt)}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
