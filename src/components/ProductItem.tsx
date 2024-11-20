import { ChevronDown, ChevronUp, Minus, Plus, Trash2 } from 'lucide-react';

import { Product } from '../types';
import { getProductInfo } from '../utils/productUtils';
import { useState } from 'react';

interface ProductItemProps {
  product: Product;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
}

const getNutriscoreColor = (score: string) => {
  const colors = {
    a: 'bg-green-100 text-green-800',
    b: 'bg-lime-100 text-lime-800',
    c: 'bg-yellow-100 text-yellow-800',
    d: 'bg-orange-100 text-orange-800',
    e: 'bg-red-100 text-red-800',
  };
  return colors[score.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export default function ProductItem({ product, onUpdateQuantity, onUpdateLocation, onDelete }: ProductItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const productInfo = getProductInfo(product.categories, product.labels);

  return (
    <div className="border-b last:border-b-0">
      {/* En-tête du produit */}
      <div className="p-4 flex items-center justify-between hover:bg-gray-50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {product.categories || (product.category === 'product' ? 'Produit' : 'Ingrédient')}
          </p>
          <select
            value={product.location}
            onChange={(e) => onUpdateLocation(product.id, e.target.value)}
            className="mt-1 text-sm text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Placard cuisine">Placard cuisine</option>
            <option value="Réfrigérateur">Réfrigérateur</option>
            <option value="Congélateur">Congélateur</option>
            <option value="Garde-manger">Garde-manger</option>
            <option value="Boîte à pain">Boîte à pain</option>
          </select>
        </div>
        
        {/* Contrôles de quantité */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateQuantity(product.id, Math.max(0, product.quantity - 1))}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="text-lg font-medium min-w-[3rem] text-center">
              {product.quantity} {product.unit}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Zone déroulante avec les détails */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50 space-y-4">
          {/* Nutri-Score */}
          {product.nutriscore && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Nutri-Score</h5>
              <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getNutriscoreColor(product.nutriscore)
              }`}>
                {product.nutriscore.toUpperCase()}
              </div>
            </div>
          )}

          {/* Régimes alimentaires */}
          {productInfo.dietInfo.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Régimes alimentaires</h5>
              <div className="mt-1 flex flex-wrap gap-2">
                {productInfo.dietInfo.map((diet, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergènes */}
          {productInfo.allergens.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Allergènes</h5>
              <div className="mt-1 flex flex-wrap gap-2">
                {productInfo.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Valeurs nutritionnelles */}
          {product.nutriments && (
            <div>
              <h5 className="text-sm font-medium text-gray-700">Valeurs nutritionnelles (pour 100g)</h5>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Calories:</span> {product.nutriments.energy_100g} kcal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Protéines:</span> {product.nutriments.proteins_100g}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Glucides:</span> {product.nutriments.carbohydrates_100g}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Lipides:</span> {product.nutriments.fat_100g}g
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 