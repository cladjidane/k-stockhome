
import create from 'zustand';
import { Product, ShoppingListItem } from '../types';

interface ProductStore {
  products: Product[];
  shoppingList: ShoppingListItem[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => void;
  removeFromShoppingList: (id: string) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingListItem>) => void;
}

export const useStore = create<ProductStore>((set) => ({
  products: [],
  shoppingList: [],
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: crypto.randomUUID() }]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  
  addToShoppingList: (item) => set((state) => ({
    shoppingList: [...state.shoppingList, {
      ...item,
      id: crypto.randomUUID(),
      addedAt: new Date()
    }]
  })),
  
  removeFromShoppingList: (id) => set((state) => ({
    shoppingList: state.shoppingList.filter(i => i.id !== id)
  })),
  
  updateShoppingItem: (id, updates) => set((state) => ({
    shoppingList: state.shoppingList.map(i => i.id === id ? { ...i, ...updates } : i)
  }))
}));
