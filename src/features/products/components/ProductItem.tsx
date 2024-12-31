import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Minus,
  Award,
  Leaf,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Tooltip } from '../../../shared';
import { Product, ShoppingListItem } from '../../../types';
import create from 'zustand';

interface ProductItemProps {
  product: Product;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onAddToShoppingList: (item: ShoppingListItem) => void;
}

const LOW_STOCK_THRESHOLD = 2;

const locationColors: Record<string, { bg: string; text: string; icon: string }> = {
  'Placard cuisine': { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🪟' },
  'Réfrigérateur': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '❄️' },
  'Congélateur': { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '🧊' },
  'Garde-manger': { bg: 'bg-green-50', text: 'text-green-700', icon: '🏠' },
  'Boîte à pain': { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🍞' },
};

const defaultLocationStyle = { bg: 'bg-gray-50', text: 'text-gray-700', icon: '📍' };

interface StoreState {
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  addToShoppingList: (item: ShoppingListItem) => void;
}

const useStore = create<StoreState>()((set) => ({
  products: [],
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
    })),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  addToShoppingList: (item) => console.log("Added to shopping list:", item) // Placeholder - needs actual shopping list management
}));


export default function ProductItem({
  product,
  onDelete,
  onUpdateQuantity,
  onUpdateLocation,
  onAddToShoppingList
}: ProductItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const locationStyle = locationColors[product.location] || defaultLocationStyle;
  const { updateProduct, addToShoppingList } = useStore();

  useEffect(() => {
    setShowLowStockAlert(product.quantity <= LOW_STOCK_THRESHOLD);
  }, [product.quantity]);

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? product.quantity + 1 : Math.max(0, product.quantity - 1);
    updateProduct(product.id, { quantity: newQuantity });
  };

  const handleAddToShoppingList = () => {
    addToShoppingList({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit
    });
    setShowLowStockAlert(false);
  };

  const renderNutriscore = () => {
    if (!product.nutriscore) return null;
    const colors: Record<string, string> = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500'
    };
    const descriptions: Record<string, string> = {
      'a': 'Excellente qualité nutritionnelle',
      'b': 'Bonne qualité nutritionnelle',
      'c': 'Qualité nutritionnelle moyenne',
      'd': 'Qualité nutritionnelle insuffisante',
      'e': 'Mauvaise qualité nutritionnelle'
    };
    const bgColor = colors[product.nutriscore.toLowerCase()] || 'bg-gray-500';

    return (
      <Tooltip content={descriptions[product.nutriscore.toLowerCase()] || 'Nutri-Score'}>
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4 text-gray-500" />
          <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${bgColor}`}>
            {product.nutriscore.toUpperCase()}
          </span>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible transition-all duration-200 hover:shadow-md">
      {showLowStockAlert && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Stock bas pour {product.name}
              </span>
            </div>
            <button
              onClick={handleAddToShoppingList}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-amber-100 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-800/50 text-amber-700 dark:text-amber-300 rounded-md transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                {product.nutriments && (
                  <Tooltip content="Informations nutritionnelles disponibles">
                    <div className="relative">
                      <Leaf className="w-4 h-4 text-green-500" />
                    </div>
                  </Tooltip>
                )}
                {renderNutriscore()}
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center px-2 py-1 rounded-md ${locationStyle.bg} ${locationStyle.text} text-sm dark:bg-opacity-10 dark:text-opacity-90`}>
                <span className="mr-1">{locationStyle.icon}</span>
                {product.location}
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm">
                {product.quantity} {product.unit}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Tooltip content="Supprimer le produit">
              <div className="relative">
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Tooltip>
            <Tooltip content={isExpanded ? "Masquer les informations nutritionnelles" : "Voir les informations nutritionnelles"}>
              <div className="relative">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  aria-label={isExpanded ? "Masquer les détails" : "Voir les détails"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {isExpanded && product.nutriments && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{product.nutriments.energy_100g}</div>
              <div className="text-gray-500 dark:text-gray-400">kcal/100g</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{product.nutriments.proteins_100g}g</div>
              <div className="text-gray-500 dark:text-gray-400">Protéines</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{product.nutriments.carbohydrates_100g}g</div>
              <div className="text-gray-500 dark:text-gray-400">Glucides</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{product.nutriments.fat_100g}g</div>
              <div className="text-gray-500 dark:text-gray-400">Lipides</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}