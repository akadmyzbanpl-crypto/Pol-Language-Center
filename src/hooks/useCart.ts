import { create } from 'zustand';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
}

const savedCart = localStorage.getItem('pol_cart');
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

export const useCart = create<CartState>((set, get) => ({
  items: initialItems,
  couponCode: '',
  couponDiscount: 0,

  addItem(newItem) {
    const items = [...get().items];
    const existingIndex = items.findIndex((i) => i.itemId === newItem.itemId);

    if (existingIndex >= 0) {
      if (newItem.itemType === 'course') {
        // Courses can only be added once
        return;
      }
      items[existingIndex].qty += newItem.qty || 1;
    } else {
      items.push({
        ...newItem,
        qty: newItem.qty || 1,
      });
    }

    localStorage.setItem('pol_cart', JSON.stringify(items));
    set({ items });
  },

  removeItem(itemId) {
    const items = get().items.filter((i) => i.itemId !== itemId);
    localStorage.setItem('pol_cart', JSON.stringify(items));
    set({ items });
  },

  updateQty(itemId, qty) {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }
    const items = get().items.map((i) => (i.itemId === itemId ? { ...i, qty } : i));
    localStorage.setItem('pol_cart', JSON.stringify(items));
    set({ items });
  },

  clearCart() {
    localStorage.removeItem('pol_cart');
    set({ items: [], couponCode: '', couponDiscount: 0 });
  },

  applyCoupon(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'POL2026' || clean === 'WELCOME') {
      set({ couponCode: clean, couponDiscount: 100000 });
      return true;
    }
    return false;
  },

  removeCoupon() {
    set({ couponCode: '', couponDiscount: 0 });
  },

  getSubtotal() {
    return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  getDiscount() {
    const baseDiscount = get().items.reduce(
      (sum, item) => sum + (item.price - item.finalPrice) * item.qty,
      0
    );
    return baseDiscount + get().couponDiscount;
  },

  getShippingCost() {
    const hasBook = get().items.some((i) => i.itemType === 'book');
    return hasBook ? 45000 : 0;
  },

  getTotal() {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const shipping = get().getShippingCost();
    const total = subtotal - discount + shipping;
    return total > 0 ? total : 0;
  },
}));
