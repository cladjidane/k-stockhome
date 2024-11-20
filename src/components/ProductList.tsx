import { Product } from '../types';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onUpdateQuantity, onUpdateLocation, onDelete }: ProductListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onUpdateQuantity={onUpdateQuantity}
          onUpdateLocation={onUpdateLocation}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}