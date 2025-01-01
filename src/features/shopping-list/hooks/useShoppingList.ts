import { useState, useCallback } from "react";
import { ShoppingListItem } from "../../../types";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  const addItem = useCallback((productId: string) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { productId, quantity: 1, purchased: false }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateItem = useCallback(
    (productId: string, updates: Partial<ShoppingListItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, ...updates } : item,
        ),
      );
    },
    [],
  );

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearList,
  };
}
