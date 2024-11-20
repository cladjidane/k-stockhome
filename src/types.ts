export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'product' | 'ingredient';
  location: string;
}