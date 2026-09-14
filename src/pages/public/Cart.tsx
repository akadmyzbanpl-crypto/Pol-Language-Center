import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Tag } from 'lucide-react';

export const Cart: React.FC = () => {
  const {
    items,
    removeItem,
    updateQty,
    clearCart,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTotal,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponMsg({ text: 'کد تخفیف ۱۰۰,۰۰۰ تومانی با موفقیت اعمال شد!', isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: 'کد تخفیف نامعتبر یا منقضی شده است (کد تستی: POL2026)', isError: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingCart className="w-10 h-10 text-slate-400" />}
          title="سبد خرید شما خالی است"
          description="هنوز هیچ دوره یا کتابی به سبد خرید خود اضافه نکرده‌اید."
          actionText="مشاهده دوره‌ها و کتاب‌ها"
          onAction={() => navigate('/courses')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">سبد خرید شما</h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
        >
          پاک کردن کل سبد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (Right in RTL) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-0 overflow-hidden divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.itemId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-xs flex-shrink-0"
                  />
                  <div className="text-right">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 mb-1 inline-block">
                      {item.itemType === 'course' ? 'دوره آموزشی' : 'کتاب آموزشی'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <span className="text-xs font-semibold text-blue-600 mt-1 block">
                      {formatPrice(item.finalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Stepper for books only */}
                  {item.itemType === 'book' ? (
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateQty(item.itemId, item.qty - 1)}
                        className="p-1 hover:bg-white rounded-lg text-slate-600 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">
                        {toPersianDigits(item.qty)}
                      </span>
                      <button
                        onClick={() => updateQty(item.itemId, item.qty + 1)}
                        className="p-1 hover:bg-white rounded-lg text-slate-600 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">۱ کاربر (مجوز انفرادی)</span>
                  )}

                  <div className="text-left">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatPrice(item.finalPrice * item.qty)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.itemId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="حذف از سبد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </Card>

          {/* Coupon Code section */}
          <Card className="p-4 sm:p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>کد تخفیف دارید؟</span>
            </h4>

            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <span>کد {couponCode} اعمال شد (-۱۰۰,۰۰۰ تومان)</span>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline font-bold"
                >
                  حذف کد
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  placeholder="مثلاً POL2026"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="text-xs uppercase"
                />
                <Button type="submit" variant="secondary" size="md">
                  اعمال
                </Button>
              </form>
            )}

            {couponMsg && (
              <p className={`text-xs ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                {couponMsg.text}
              </p>
            )}
          </Card>
        </div>

        {/* Order Summary Box (Left in RTL) */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-5 shadow-md">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              خلاصه سفارش
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>مجموع اقلام:</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>تخفیف کل:</span>
                <span>- {formatPrice(getDiscount())}</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span>{getShippingCost() === 0 ? 'رایگان' : formatPrice(getShippingCost())}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="text-blue-600">{formatPrice(getTotal())}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              size="lg"
              className="w-full"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              تکمیل خرید و پرداخت آنلاین
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
