
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import ProductItem from '../features/products/components/ProductItem';

interface CategoryGroupProps {
  title: string;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
  onAddToShoppingList: (product: Product) => void;
}

export default function CategoryGroup({
  title,
  products,
  onUpdateQuantity,
  onUpdateLocation,
  onDelete,
  onAddToShoppingList,
}: CategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (products.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} article{products.length !== 1 ? 's' : ''}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onUpdateQuantity={onUpdateQuantity}
              onUpdateLocation={onUpdateLocation}
              onDelete={onDelete}
              onAddToShoppingList={onAddToShoppingList}
            />
          ))}
        </div>
      )}
    </div>
  );
}
