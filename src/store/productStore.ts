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
  addToShoppingList: (
    item: Omit<ShoppingListItem, "id" | "addedAt">,
  ) => Promise<void>;
  removeFromShoppingList: (id: string) => Promise<void>;
  updateShoppingItem: (
    id: string,
    updates: Partial<ShoppingListItem>,
  ) => Promise<void>;
  getFilteredProducts: () => Product[];
  fetchShoppingList: () => Promise<void>;
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
      const { data, error } = await supabase().from("products").select("*");
      if (error) throw error;
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchShoppingList: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase()
        .from("shopping_list")
        .select("*");
      if (error) throw error;
      console.log("Fetched shopping list:", data);
      set({ shoppingList: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addToShoppingList: async (item) => {
    try {
      const { data: existing } = await supabase()
        .from("shopping_list")
        .select()
        .eq("product_id", item.product_id)
        .single();

      if (existing) {
        const { error } = await supabase()
          .from("shopping_list")
          .update({ quantity: item.quantity })
          .eq("product_id", item.product_id);

        if (error) throw error;
      } else {
        const { error } = await supabase()
          .from("shopping_list")
          .insert([
            {
              product_id: item.product_id,
              name: item.name,
              quantity: item.quantity || 1,
              unit: item.unit,
              auto_update_stock: true,
            },
          ]);

        if (error) throw error;
      }

      await get().fetchShoppingList();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addProduct: async (product) => {
    try {
      const { data, error } = await supabase()
        .from("products")
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ products: [...state.products, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { error } = await supabase()
        .from("products")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p,
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeProduct: async (id) => {
    try {
      const { error } = await supabase().from("products").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  removeFromShoppingList: async (id) => {
    try {
      const { error } = await supabase()
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
      const { error } = await supabase()
        .from("shopping_list")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        shoppingList: state.shoppingList.map((i) =>
          i.id === id ? { ...i, ...updates } : i,
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery } = get();
    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      if (!searchQuery) return matchesCategory;

      const query = searchQuery.toLowerCase();
      const name = product.name.toLowerCase();

      const startsWithMatch = name.startsWith(query);
      const containsMatch = query
        .split(" ")
        .every((word) => name.includes(word.toLowerCase()));

      return matchesCategory && (startsWithMatch || containsMatch);
    });
  },

  getSuggestions: (query: string) => {
    const { products } = get();
    if (!query) return [];

    const normalizedQuery = query.toLowerCase();
    return [
      ...new Set(
        products
          .filter((p) => p.name.toLowerCase().includes(normalizedQuery))
          .map((p) => p.name)
          .slice(0, 5),
      ),
    ];
  },
}));

export const {
  updateShoppingItem,
  updateProduct,
  removeProduct,
  addToShoppingList,
  removeFromShoppingList,
} = useStore.getState();
