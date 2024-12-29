export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  categories?: string;
  nutriscore?: string;
  nutriments?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
  };
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  suggestedQuantity?: number;
  purchased?: boolean;
  autoUpdateStock?: boolean;
  addedAt: Date;
}

export interface PurchaseValidation {
  shoppingItem: ShoppingListItem;
  currentStock: number;
  newStock: number;
  autoUpdateStock: boolean;
}

export type StockUpdateMode = 'manual' | 'automatic' | 'suggested';