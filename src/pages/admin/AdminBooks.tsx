import React, { useState } from 'react';
import { bookService } from '../../services/bookService';
import { Book } from '../../types';
import { formatPrice, toPersianDigits } from '../../lib/formatters';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';

export const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(bookService.listBooks());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('آزمون‌ها');
  const [formLevel, setFormLevel] = useState('B2');
  const [formPrice, setFormPrice] = useState('280000');
  const [formDiscount, setFormDiscount] = useState('10');
  const [formStock, setFormStock] = useState('25');
  const [formCover, setFormCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80');
  const [formDesc, setFormDesc] = useState('');

  const refreshList = () => {
    setBooks(bookService.listBooks());
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setFormTitle('');
    setFormAuthor('Cambridge University Press');
    setFormCategory('آزمون‌ها');
    setFormLevel('B2');
    setFormPrice('280000');
    setFormDiscount('10');
    setFormStock('20');
    setFormCover('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80');
    setFormDesc('');
    setModalOpen(true);
  };

  const openEditModal = (b: Book) => {
    setEditingBook(b);
    setFormTitle(b.title);
    setFormAuthor(b.author);
    setFormCategory(b.category);
    setFormLevel(b.level || 'B2');
    setFormPrice(b.price.toString());
    setFormDiscount(b.discountPercent.toString());
    setFormStock(b.stock.toString());
    setFormCover(b.coverUrl);
    setFormDesc(b.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formPrice) || 0;
    const discount = Number(formDiscount) || 0;
    const finalPrice = Math.round(price * (1 - discount / 100));

    if (editingBook) {
      bookService.updateBook(editingBook.id, {
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        level: formLevel,
        price,
        discountPercent: discount,
        finalPrice,
        stock: Number(formStock) || 0,
        coverUrl: formCover,
        description: formDesc,
      });
    } else {
      bookService.createBook({
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        level: formLevel,
        price,
        discountPercent: discount,
        stock: Number(formStock) || 0,
        coverUrl: formCover,
        description: formDesc,
        isActive: true,
        isPublished: true,
      });
    }
    setModalOpen(false);
    refreshList();
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      bookService.deleteBook(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="جستجوی کتاب یا نویسنده..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          افزودن کتاب جدید به فروشگاه
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-4">عنوان کتاب</th>
                <th className="p-4">نویسنده / ناشر</th>
                <th className="p-4">دسته‌بندی</th>
                <th className="p-4">موجودی انبار</th>
                <th className="p-4">قیمت و تخفیف</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={b.coverUrl} alt="" className="w-10 h-14 object-contain rounded shadow-xs" />
                      <span className="font-bold text-slate-900">{b.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{b.author}</td>
                  <td className="p-4">
                    <Badge variant="blue">{b.category}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={b.stock > 5 ? 'emerald' : b.stock > 0 ? 'amber' : 'rose'}>
                      {toPersianDigits(b.stock)} عدد
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-blue-600 block">{formatPrice(b.finalPrice)}</span>
                    {b.discountPercent > 0 && (
                      <span className="text-[10px] text-rose-500">%{toPersianDigits(b.discountPercent)} تخفیف</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(b.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingBook ? 'ویرایش کتاب' : 'افزودن کتاب به فروشگاه'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-right">
            <Input
              label="عنوان کتاب"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <Input
              label="نویسنده / ناشر"
              required
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="دسته‌بندی (مثلاً آزمون‌ها، مکالمه)"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
              <Input
                label="سطح پیشنهادی"
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="قیمت اصلی (تومان)"
                type="number"
                required
                dir="ltr"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
              <Input
                label="درصد تخفیف"
                type="number"
                dir="ltr"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
              />
              <Input
                label="موجودی انبار"
                type="number"
                required
                dir="ltr"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
              />
            </div>

            <Input
              label="آدرس تصویر جلد کتاب (Cover URL)"
              dir="ltr"
              value={formCover}
              onChange={(e) => setFormCover(e.target.value)}
            />

            <Textarea
              label="معرفی و خلاصه کتاب"
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">
                {editingBook ? 'ذخیره تغییرات' : 'افزودن به فروشگاه'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="حذف کتاب"
        message="آیا از حذف این کتاب از فروشگاه اطمینان دارید؟"
        confirmText="بله، حذف کن"
      />
    </div>
  );
};
