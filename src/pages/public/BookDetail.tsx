import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useCart } from '../../hooks/useCart';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ShoppingCart, Check, ShieldCheck, Truck, ArrowRight, BookOpen } from 'lucide-react';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const book = bookService.getBookById(id || '');

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">کتاب مورد نظر یافت نشد</h2>
        <Link to="/books" className="mt-4 inline-block text-blue-600 hover:underline">
          بازگشت به کتاب‌ها
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      itemType: 'book',
      itemId: book.id,
      title: book.title,
      price: book.price,
      finalPrice: book.finalPrice,
      imageUrl: book.coverUrl,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600">خانه</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-blue-600">فروشگاه کتاب</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{book.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Book cover (Right in RTL) */}
        <div className="md:col-span-5 flex justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="max-h-96 object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="blue">{book.category}</Badge>
              {book.level && <Badge variant="slate">{book.level}</Badge>}
              <Badge variant={book.stock > 0 ? 'emerald' : 'rose'}>
                {book.stock > 0 ? `موجود در انبار (${toPersianDigits(book.stock)} جلد)` : 'ناموجود'}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-sm font-semibold text-slate-600">نویسنده / ناشر: {book.author}</p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            {book.description}
          </p>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-blue-600">{formatPrice(book.finalPrice)}</span>
              {book.discountPercent > 0 && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(book.price)}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleAdd}
              size="lg"
              variant="outline"
              disabled={book.stock <= 0}
              icon={added ? <Check className="w-5 h-5 text-emerald-600" /> : <ShoppingCart className="w-5 h-5" />}
            >
              {added ? 'به سبد خرید افزوده شد' : 'افزودن به سبد خرید'}
            </Button>
            <Button
              onClick={handleBuyNow}
              size="lg"
              disabled={book.stock <= 0}
            >
              خرید و پرداخت فوری
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>ارسال سریع با پست پیشتاز</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ضمانت اصالت و چاپ باکیفیت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
