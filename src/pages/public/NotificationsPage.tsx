import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatPersianDate } from '../../lib/formatters';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    if (user) {
      setNotifications(notificationService.listNotifications(user.uid));
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAllRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.uid);
      loadNotifications();
    }
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">اعلان‌ها و پیام‌های سیستمی</h1>
          <p className="text-xs text-slate-500 mt-1">
            پیام‌های مربوط به کلاس‌ها، تغییرات برنامه و تکالیف شما
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            icon={<CheckCheck className="w-4 h-4 text-blue-600" />}
          >
            خواندن همه
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10 text-slate-400" />}
          title="هیچ اعلانی ندارید"
          description="در حال حاضر پیام یا هشدار جدیدی برای شما ثبت نشده است."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-all ${
                !notif.isRead ? 'bg-blue-50/40 border-blue-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.isRead && (
                      <Badge variant="blue" size="sm">
                        جدید
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {formatPersianDate(notif.createdAt)}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap cursor-pointer"
                >
                  علامت خوانده شده
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
