import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useCart } from '../../hooks/useCart';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search, ShoppingCart, BookOpen, Check } from 'lucide-react';

export const Books: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  const { addItem } = useCart();
  const allBooks = bookService.listBooks();

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allBooks.forEach((b) => cats.add(b.category));
    return Array.from(cats);
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((b) => {
      const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
      const matchSearch =
        !searchTerm.trim() ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allBooks, selectedCategory, searchTerm]);

  const handleAdd = (book: (typeof allBooks)[0]) => {
    addItem({
      itemType: 'book',
      itemId: book.id,
      title: book.title,
      price: book.price,
      finalPrice: book.finalPrice,
      imageUrl: book.coverUrl,
      qty: 1,
    });
    setAddedBookId(book.id);
    setTimeout(() => setAddedBookId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">فروشگاه کتاب و منابع آموزشی</h1>
        <p className="text-sm text-slate-500 mt-1">
          کتب اورجینال آموزش زبان، ریدینگ، واژگان، گرامر و آمادگی آزمون‌های بین‌المللی
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="جستجوی عنوان کتاب یا نویسنده..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            همه کتاب‌ها
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <EmptyState
          title="کتابی یافت نشد"
          description="کتابی متناسب با جستجوی شما یافت نشد."
          actionText="مشاهده همه کتاب‌ها"
          onAction={() => {
            setSelectedCategory('all');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} hoverEffect className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full object-contain rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  />
                  {book.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      %{toPersianDigits(book.discountPercent)} تخفیف
                    </div>
                  )}
                  {book.stock <= 5 && book.stock > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      فقط {toPersianDigits(book.stock)} عدد مانده
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <Badge variant="slate" size="sm">
                    {book.category}
                  </Badge>
                  <Link to={`/books/${book.id}`} className="block">
                    <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  {book.discountPercent > 0 && (
                    <span className="block text-[11px] text-slate-400 line-through">
                      {formatPrice(book.price)}
                    </span>
                  )}
                  <span className="text-sm font-black text-blue-600">
                    {formatPrice(book.finalPrice)}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={addedBookId === book.id ? 'primary' : 'outline'}
                  onClick={() => handleAdd(book)}
                  icon={addedBookId === book.id ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                >
                  {addedBookId === book.id ? 'افزوده شد' : 'خرید'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
