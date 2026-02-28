import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  packSize: string;
  stock: number;
  category?: string;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  deliveryFee: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryFee: 4.99,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(i => i.productId === product.id);
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: Math.min(newItems[existingIndex].quantity + quantity, product.stock),
            };
            return { items: newItems };
          }
          return {
            items: [...state.items, { productId: product.id, product, quantity: Math.min(quantity, product.stock) }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, i.product.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = subtotal >= 50 ? 0 : get().deliveryFee;
        return subtotal + deliveryFee;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'smoke-essentials-cart',
    }
  )
);
