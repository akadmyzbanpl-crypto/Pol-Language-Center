import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { formatPersianDate, formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ShoppingBag, Eye, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export const StudentOrders: React.FC = () => {
  const { user } = useAuth();
  const allOrders = orderService.listOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for current user or show demo orders
  const orders = user
    ? allOrders.filter((o) => o.userId === user.uid || o.userEmail === user.email)
    : allOrders;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="emerald">پرداخت شده</Badge>;
      case 'pending':
        return <Badge variant="amber">در انتظار پرداخت</Badge>;
      case 'shipped':
        return <Badge variant="blue">ارسال شده پستی</Badge>;
      case 'delivered':
        return <Badge variant="emerald">تحویل داده شده</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-black text-slate-900">سفارشات و فاکتورهای من</h1>
        <p className="text-xs text-slate-500 mt-1">سوابق خرید دوره‌ها و کتاب‌های آموزشی</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10 text-slate-400" />}
          title="هنوز سفارشی ثبت نکرده‌اید"
          description="پس از خرید دوره‌ها یا کتاب‌ها، فاکتور و وضعیت آنها در این بخش نمایش داده می‌شود."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">سفارش #{order.id}</span>
                  {getStatusBadge(order.paymentStatus)}
                </div>
                <p className="text-xs text-slate-500">
                  تاریخ: {formatPersianDate(order.createdAt)} • {toPersianDigits(order.items.length)} قلم کالا
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                <span className="text-sm font-black text-blue-600">
                  {formatPrice(order.total)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => setSelectedOrder(order)}
                >
                  مشاهده فاکتور
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`جزئیات فاکتور سفارش #${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-6 text-right">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">نام تحویل‌گیرنده:</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedOrder.userName}</p>
              </div>
              <div>
                <span className="text-slate-400 block">شماره تماس:</span>
                <p className="font-bold text-slate-800 mt-0.5" dir="ltr">{selectedOrder.userPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 block">تاریخ سفارش:</span>
                <p className="font-bold text-slate-800 mt-0.5">{formatPersianDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <span className="text-slate-400 block">وضعیت:</span>
                <div className="mt-0.5">{getStatusBadge(selectedOrder.paymentStatus)}</div>
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">اقلام فاکتور:</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.itemId} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <span className="font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-slate-400 text-[11px]">{toPersianDigits(item.qty)} عدد</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.finalPrice * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total calculation */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>جمع اقلام:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>تخفیف:</span>
                <span>- {formatPrice(selectedOrder.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه پست:</span>
                <span>{selectedOrder.shippingCost === 0 ? 'رایگان' : formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>مبلغ نهایی:</span>
                <span className="text-blue-600">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
