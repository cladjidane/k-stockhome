
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

  fetchProducts: async () => {
    try {
      const { data, error } = await supabase()
        .from('products')
        .select('*');
      if (error) throw error;
      set({ products: data });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },

  fetchShoppingList: async () => {
    try {
      const { data, error } = await supabase()
        .from('shopping_list')
        .select('*')
        .order('added_at', { ascending: false });
      if (error) throw error;
      set({ shoppingList: data });
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  },

  addProduct: async (product) => {
    try {
      const { error } = await supabase()
        .from('products')
        .insert([product]);
      if (error) throw error;
      get().fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase()
        .from('products')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      get().fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },

  removeProduct: async (id: string) => {
    try {
      const { error } = await supabase()
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      get().fetchProducts();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  },

  addToShoppingList: async (item) => {
    try {
      const { error } = await supabase()
        .from('shopping_list')
        .insert([item]);
      if (error) throw error;
      get().fetchShoppingList();
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  },

  removeFromShoppingList: async (id: string) => {
    try {
      const { error } = await supabase()
        .from('shopping_list')
        .delete()
        .eq('id', id);
      if (error) throw error;
      get().fetchShoppingList();
    } catch (error) {
      console.error('Error removing from shopping list:', error);
    }
  },

  updateShoppingItem: async (id: string, updates: Partial<ShoppingListItem>) => {
    try {
      const { error } = await supabase()
        .from('shopping_list')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      get().fetchShoppingList();
    } catch (error) {
      console.error('Error updating shopping item:', error);
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get();
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
}));

export const {
  addProduct,
  updateProduct,
  removeProduct,
  addToShoppingList,
  removeFromShoppingList,
  updateShoppingItem,
  fetchProducts,
  fetchShoppingList,
  fetchCategories,
  addMainCategory,
  updateMainCategory,
  getMainCategory
} = useStore.getState();
