import { Book } from '../types';
import { store } from './storeService';

export const bookService = {
  listBooks(filter?: { category?: string; search?: string }): Book[] {
    let list = store.getBooks();
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((b) => b.category === filter.category);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getBookById(id: string): Book | undefined {
    return store.getBookById(id);
  },

  createBook(data: Omit<Book, 'id' | 'finalPrice'>): Book {
    const finalPrice = Math.round(data.price * (1 - (data.discountPercent || 0) / 100));
    const newBook: Book = {
      ...data,
      id: 'book_' + Date.now(),
      finalPrice,
    };
    store.saveBook(newBook);
    return newBook;
  },

  updateBook(id: string, data: Partial<Book>): Book {
    const existing = store.getBookById(id);
    if (!existing) throw new Error('کتاب یافت نشد');
    const price = data.price !== undefined ? data.price : existing.price;
    const discount = data.discountPercent !== undefined ? data.discountPercent : existing.discountPercent;
    const finalPrice = Math.round(price * (1 - (discount || 0) / 100));
    const updated: Book = {
      ...existing,
      ...data,
      finalPrice,
    };
    store.saveBook(updated);
    return updated;
  },

  updateStock(id: string, newStock: number): void {
    const existing = store.getBookById(id);
    if (existing) {
      existing.stock = newStock;
      store.saveBook(existing);
    }
  },

  deleteBook(id: string): void {
    store.deleteBook(id);
  },
};
