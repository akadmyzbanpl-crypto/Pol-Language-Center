import { NotificationItem, NotificationType } from '../types';
import { store } from './storeService';

export const notificationService = {
  listNotifications(userId?: string): NotificationItem[] {
    return store.getNotifications(userId);
  },

  markAsRead(id: string): void {
    store.markNotificationAsRead(id);
  },

  markAllAsRead(userId: string): void {
    store.markAllNotificationsRead(userId);
  },

  createNotification(data: {
    userId: string;
    title: string;
    body: string;
    type: NotificationType;
    link?: string;
  }): NotificationItem {
    const item: NotificationItem = {
      id: 'notif_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type,
      link: data.link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    store.saveNotification(item);
    return item;
  },

  broadcastNotification(title: string, body: string, type: 'info' | 'warning' | 'success' | NotificationType = 'info'): void {
    const users = store.getUsers();
    let notifType: NotificationType = 'general';
    if (type === 'warning') notifType = 'class_time_changed';
    else if (type === 'success') notifType = 'payment_success';
    users.forEach((u) => {
      this.createNotification({
        userId: u.uid,
        title,
        body,
        type: notifType,
      });
    });
  },

  createBulk(
    userIds: string[],
    data: {
      title: string;
      body: string;
      type: NotificationType;
      link?: string;
    }
  ): void {
    userIds.forEach((uid) => {
      this.createNotification({
        userId: uid,
        ...data,
      });
    });
  },
};
