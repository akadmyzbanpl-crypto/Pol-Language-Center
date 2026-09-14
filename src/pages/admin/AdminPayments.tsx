import React from 'react';
import { paymentService } from '../../services/paymentService';
import { formatPersianDate, formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const transactions = paymentService.listTransactions();

  return (
    <div className="space-y-6 text-right">
      <div>
        <h2 className="text-xl font-black text-slate-900">تراکنش‌های درگاه پرداخت شاپرک</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          گزارش دقیق کدهای پیگیری، مبالغ تسویه شده و مرجع بانک مرکزی
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">کد رهگیری تراکنش</th>
                <th className="p-4">شماره سفارش</th>
                <th className="p-4">مبلغ واریزی</th>
                <th className="p-4">درگاه بانکی</th>
                <th className="p-4">کارت پرداخت کننده</th>
                <th className="p-4">وضعیت شاپرک</th>
                <th className="p-4">زمان ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600" dir="ltr">
                    {tx.refId || tx.id}
                  </td>
                  <td className="p-4 font-mono text-slate-700" dir="ltr">
                    #{tx.orderId}
                  </td>
                  <td className="p-4 font-black text-slate-900">{formatPrice(tx.amount)}</td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700">{tx.gateway}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-500" dir="ltr">
                    {tx.cardPanMasked || '****-****-****-1234'}
                  </td>
                  <td className="p-4">
                    <Badge variant={tx.status === 'success' ? 'emerald' : 'rose'}>
                      {tx.status === 'success' ? 'تایید شده شاپرک' : 'ناموفق'}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{formatPersianDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
