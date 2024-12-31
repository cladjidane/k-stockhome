
import { create } from "zustand";
import { Product, ShoppingListItem } from "../types";
import { supabase } from "../config/supabase/client";

interface ProductStore {
  products: Product[];
  shoppingList: ShoppingListItem[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, "id" | "addedAt">) => Promise<void>;
  removeFromShoppingList: (id: string) => Promise<void>;
  updateShoppingItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  getFilteredProducts: () => Product[];
}

export const useStore = create<ProductStore>((set, get) => ({
  products: [],
  shoppingList: [],
  selectedCategory: null,
  searchQuery: "",
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    console.log('Attempting to add product:', product);
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
      
      console.log('Product added successfully:', data);
      set((state) => ({ products: [...state.products, data] }));
    } catch (error) {
      console.error('Caught error while adding product:', error);
      set({ error: (error as Error).message });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeProduct: async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addToShoppingList: async (item) => {
    try {
      const { data, error } = await supabase
        .from("shopping_list")
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      set((state) => ({
        shoppingList: [...state.shoppingList, data],
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeFromShoppingList: async (id) => {
    try {
      const { error } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        shoppingList: state.shoppingList.filter((i) => i.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateShoppingItem: async (id, updates) => {
    try {
      const { error } = await supabase
        .from("shopping_list")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        shoppingList: state.shoppingList.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get();
    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  },
}));
