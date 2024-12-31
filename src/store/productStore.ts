
import { create } from 'zustand';
import { Product, ShoppingListItem } from '../types';

interface ProductStore {
  products: Product[];
  shoppingList: ShoppingListItem[];
  selectedCategory: string | null;
  searchQuery: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => void;
  removeFromShoppingList: (id: string) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  getFilteredProducts: () => Product[];
}

export const useStore = create<ProductStore>((set, get) => ({
  products: [],
  shoppingList: [],
  selectedCategory: null,
  searchQuery: '',
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: crypto.randomUUID() }]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
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
  })),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get();
    return products.filter(product => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
}));
