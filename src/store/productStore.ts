
import { create } from "zustand";
import { Product, ShoppingListItem } from "../types";
import { supabase } from "../config/supabase/client";

interface ProductStore {
  products: Product[];
  shoppingList: ShoppingListItem[];
  mainCategories: Record<string, string[]>;
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addMainCategory: (name: string, subCategories: string[]) => Promise<void>;
  updateMainCategory: (id: number, name: string, subCategories: string[]) => Promise<void>;
  getMainCategory: (category: string) => Promise<string>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, "id" | "addedAt">) => Promise<void>;
  removeFromShoppingList: (id: string) => Promise<void>;
  updateShoppingItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  getFilteredProducts: () => Product[];
  fetchShoppingList: () => Promise<void>;
}

export const useStore = create<ProductStore>((set, get) => ({
  products: [],
  shoppingList: [],
  mainCategories: {},
  selectedCategory: null,
  searchQuery: "",
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase()
        .from('main_categories')
        .select('*');
      if (error) throw error;
      
      const categories = data.reduce((acc, cat) => ({
        ...acc,
        [cat.name]: cat.sub_categories
      }), {});
      
      set({ mainCategories: categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  addMainCategory: async (name: string, subCategories: string[]) => {
    try {
      const { error } = await supabase()
        .from('main_categories')
        .insert([{ name, sub_categories: subCategories }]);
      if (error) throw error;
      get().fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  },

  updateMainCategory: async (id: number, name: string, subCategories: string[]) => {
    try {
      const { error } = await supabase()
        .from('main_categories')
        .update({ name, sub_categories: subCategories })
        .eq('id', id);
      if (error) throw error;
      get().fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  },

  getMainCategory: async (category: string) => {
    if (!category) return 'Autres';
    
    const { mainCategories } = get();
    const lowerCategory = category.toLowerCase();
    
    for (const [mainCat, subCats] of Object.entries(mainCategories)) {
      if (lowerCategory.includes(mainCat.toLowerCase())) {
        return mainCat;
      }
      for (const subCat of subCats) {
        if (lowerCategory.includes(subCat.toLowerCase())) {
          return mainCat;
        }
      }
    }
    
    return 'Autres';
  },

  // ... Rest of the existing store code ...
}));

// ... Rest of the exports ...
