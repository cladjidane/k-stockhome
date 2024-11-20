export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'product' | 'ingredient';
  location: string;
  categories?: string;
  nutriscore?: string;
  nutriments?: {
    energy_100g: number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
  };
  allergens?: string;
}