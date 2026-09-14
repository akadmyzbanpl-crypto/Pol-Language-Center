import { Order, OrderStatus, PaymentStatus } from '../types';
import { notificationService } from './notificationService';
import { store } from './storeService';

export const orderService = {
  listOrders(): Order[] {
    return store.getOrders();
  },

  getUserOrders(userId: string): Order[] {
    return store.getOrders().filter((o) => o.userId === userId);
  },

  getOrderById(id: string): Order | undefined {
    return store.getOrders().find((o) => o.id === id || o.orderNumber === id);
  },

  adminListOrders(filter?: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  }): Order[] {
    let list = store.getOrders();
    if (filter?.orderStatus && filter.orderStatus !== 'all') {
      list = list.filter((o) => o.orderStatus === filter.orderStatus);
    }
    if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
      list = list.filter((o) => o.paymentStatus === filter.paymentStatus);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q)
      );
    }
    return list;
  },

  createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orderNumber = 'POL-' + Math.floor(1000 + Math.random() * 9000);
    const order: Order = {
      ...data,
      id: 'order_' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    store.saveOrder(order);

    // Notify student
    notificationService.createNotification({
      userId: order.userId,
      title: 'ثبت سفارش جدید',
      body: `سفارش شما با شماره پیگیری ${orderNumber} به مبلغ کل ${order.total.toLocaleString()} تومان با موفقیت ثبت شد.`,
      type: 'payment_success',
      link: '/dashboard/orders',
    });

    return order;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('سفارش یافت نشد');
    order.orderStatus = status;
    store.saveOrder(order);

    const statusLabels: Record<OrderStatus, string> = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش و آماده‌سازی',
      shipped: 'تحویل پست و ارسال شده',
      completed: 'تکمیل و تحویل داده شده',
      cancelled: 'لغو شده',
    };

    notificationService.createNotification({
      userId: order.userId,
      title: 'تغییر وضعیت سفارش',
      body: `وضعیت سفارش شماره ${order.orderNumber} به "${statusLabels[status]}" تغییر یافت.`,
      type: 'general',
      link: '/dashboard/orders',
    });

    return order;
  },

  updatePaymentStatus(orderId: string, status: PaymentStatus): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('سفارش یافت نشد');
    order.paymentStatus = status;
    if (status === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'paid';
    }
    store.saveOrder(order);
    return order;
  },
};
