import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type OdooProduct } from '../services/productService';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string | false;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: OdooProduct, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find(i => i.productId === product.id);
        if (existing) {
          set({ items: items.map(i =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i
          )});
        } else {
          set({ items: [...items, {
            productId: product.id,
            name: product.name,
            price: product.list_price,
            image: product.image_1920,
            qty,
          }]});
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) });
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        set({ items: get().items.map(i =>
          i.productId === productId ? { ...i, qty } : i
        )});
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
);
