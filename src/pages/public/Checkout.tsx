import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatPrice } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ShieldCheck, CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { items, getSubtotal, getDiscount, getShippingCost, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('تهران، خیابان ولیعصر، کوچه بهار، پلاک ۴');

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'fail'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  const hasBooks = items.some((i) => i.itemType === 'book');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage('لطفاً مشخصات فردی را کامل وارد نمایید');
      return;
    }
    if (hasBooks && !address.trim()) {
      setErrorMessage('جهت ارسال کتاب‌ها وارد کردن آدرس پستی الزامی است');
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      // 1. Create order
      const newOrder = orderService.createOrder({
        userId: user?.uid || 'guest_' + Date.now(),
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        items,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        shippingCost: getShippingCost(),
        total: getTotal(),
        paymentStatus: 'pending',
        orderStatus: 'pending',
        address: hasBooks ? address : undefined,
      });

      // 2. Request simulated payment gateway
      const payReq = await paymentService.requestPayment(newOrder);

      // 3. Verify payment
      const verify = await paymentService.verifyPayment(payReq.authority, newOrder.id);

      if (verify.success) {
        orderService.updatePaymentStatus(newOrder.id, 'paid');
        orderService.updateOrderStatus(newOrder.id, 'paid');
        clearCart();
        setPaymentStep('success');
      } else {
        orderService.updatePaymentStatus(newOrder.id, 'failed');
        setPaymentStep('fail');
      }
    } catch (err: any) {
      setPaymentStep('fail');
      setErrorMessage(err.message || 'خطا در ارتباط با درگاه بانکی');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && paymentStep === 'form') {
    navigate('/cart');
    return null;
  }

  if (paymentStep === 'processing') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-spin">
          <Loader2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">در حال اتصال به درگاه پرداخت شاپرک...</h3>
          <p className="text-xs text-slate-500">لطفاً چند لحظه شکیبا باشید و صفحه را نبندید.</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-mono" dir="ltr">
          Secured by Shaparak Payment Network
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-emerald-200 shadow-xl text-center space-y-6 text-right">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-black text-slate-900">پرداخت با موفقیت انجام شد!</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            سفارش شما در سیستم آموزشگاه پل ثبت گردید و دسترسی به دوره‌ها در داشبورد فعال شد.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">وضعیت پرداخت:</span>
            <span className="text-emerald-600 font-bold">موفق</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">مبلغ پرداخت شده:</span>
            <span className="font-bold">{formatPrice(getTotal())}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Button onClick={() => navigate('/dashboard/orders')} className="w-full">
            مشاهده در سفارشات من
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
            ورود به داشبورد تحصیلی
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'fail') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-6 text-right">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-black text-slate-900">پرداخت ناموفق بود</h3>
          <p className="text-xs text-slate-600">
            تراکنش انجام نشد یا توسط کاربر لغو گردید. در صورت کسر وجه تا ۷۲ ساعت آینده بازگشت داده خواهد شد.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setPaymentStep('form')} variant="primary" className="w-full">
            تلاش مجدد برای پرداخت
          </Button>
          <Button onClick={() => navigate('/cart')} variant="outline" className="w-full">
            بازگشت به سبد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">تکمیل اطلاعات و پرداخت نهایی</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Right in RTL) */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              مشخصات سفارش‌دهنده
            </h3>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <Input
                label="نام و نام خانوادگی"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="شماره موبایل"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="ایمیل"
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {hasBooks && (
                <Textarea
                  label="آدرس کامل پستی (ویژه ارسال کتاب‌ها)"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  helperText="کتاب‌ها حداکثر ظرف ۴۸ ساعت کاری با پست پیشتاز تحویل داده می‌شوند."
                />
              )}

              {/* Gateway selection info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">انتخاب درگاه پرداخت آنلاین:</h4>
                <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-xl">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">درگاه پرداخت امن شتاب (زرین‌پال / شاپرک)</p>
                      <p className="text-[11px] text-slate-500">پشتیبانی از کلیه کارت‌های بانکی عضو شتاب</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700">انتخاب شده</span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  پرداخت نهایی ({formatPrice(getTotal())})
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Details & Security Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              اقلام سفارش ({items.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.itemId} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden pr-1">
                    <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                  </div>
                  <span className="font-bold text-slate-900 whitespace-nowrap mr-2">
                    {formatPrice(item.finalPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>جمع اقلام:</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>تخفیف:</span>
                <span>- {formatPrice(getDiscount())}</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه پست:</span>
                <span>{getShippingCost() === 0 ? 'رایگان' : formatPrice(getShippingCost())}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-blue-600">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </Card>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 flex-shrink-0 text-emerald-600" />
            <span>خرید شما توسط سیستم پرداخت شاپرک تضمین شده است و اطلاعات رمز عبور در سرور امن بانک ثبت می‌شود.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
