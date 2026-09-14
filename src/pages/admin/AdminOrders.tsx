import React, { useState } from 'react';
import { orderService } from '../../services/orderService';
import { Order, OrderPaymentStatus } from '../../types';
import { formatPersianDate, formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Search, Eye, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(orderService.listOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const refreshList = () => {
    setOrders(orderService.listOrders());
  };

  const handleUpdateStatus = (orderId: string, status: string) => {
    if (status === 'paid' || status === 'failed') {
      orderService.updatePaymentStatus(orderId, status as any);
      if (status === 'paid') orderService.updateOrderStatus(orderId, 'processing');
    } else {
      orderService.updateOrderStatus(orderId, status as any);
    }
    refreshList();
    if (selectedOrder && selectedOrder.id === orderId) {
      const refreshed = orderService.getOrderById(orderId);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userPhone.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="emerald">پرداخت موفق</Badge>;
      case 'pending':
        return <Badge variant="amber">در انتظار پرداخت</Badge>;
      case 'processing':
        return <Badge variant="blue">در حال پردازش</Badge>;
      case 'shipped':
        return <Badge variant="blue">تحویل به پست</Badge>;
      case 'delivered':
        return <Badge variant="purple">تحویل داده شده</Badge>;
      case 'cancelled':
        return <Badge variant="rose">لغو شده</Badge>;
      case 'failed':
        return <Badge variant="rose">ناموفق</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900">مدیریت سفارشات و فاکتورها</h2>
          <p className="text-xs text-slate-500 mt-0.5">بررسی وضعیت پرداخت، ارسال پستی و پیگیری مشتریان</p>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی شماره سفارش، نام یا شماره تماس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">شماره سفارش</th>
                <th className="p-4">مشتری</th>
                <th className="p-4">تلفن تماس</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4">مبلغ کل</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900" dir="ltr">
                    #{o.id}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{o.userName}</td>
                  <td className="p-4 font-mono text-slate-500" dir="ltr">{o.userPhone}</td>
                  <td className="p-4 text-slate-500">{formatPersianDate(o.createdAt)}</td>
                  <td className="p-4 font-black text-slate-900">{formatPrice(o.total)}</td>
                  <td className="p-4">{getStatusBadge(o.paymentStatus)}</td>
                  <td className="p-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedOrder(o)}
                    >
                      جزئیات
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`مدیریت سفارش #${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-6 text-right">
            {/* Status change bar */}
            <div className="p-4 bg-slate-50 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700">تغییر وضعیت سفارش:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  پرداخت شد ✓
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ارسال با پست
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  تحویل داده شد
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  لغو سفارش
                </button>
              </div>
            </div>

            {/* Address */}
            {selectedOrder.shippingAddress && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block">نشانی تحویل گیرنده پستی:</span>
                <p>{selectedOrder.shippingAddress.address} - کد پستی: {selectedOrder.shippingAddress.postalCode}</p>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">اقلام خریداری شده:</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((it) => (
                  <div key={it.itemId} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <span className="font-bold text-slate-800 block">{it.title}</span>
                        <span className="text-slate-400 text-[11px]">{toPersianDigits(it.qty)} عدد</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(it.finalPrice * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
