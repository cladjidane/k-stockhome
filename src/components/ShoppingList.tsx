import React, { useState } from 'react';
import { ShoppingCart, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingListItem, Product } from '../types';
import PurchaseValidation from './PurchaseValidation';
import ShareButton from './ShareButton';

interface ShoppingListProps {
  items: ShoppingListItem[];
  products: Product[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateProduct: (productId: string, quantity: number) => void;
  onPurchaseComplete: (itemId: string) => void;
}

export default function ShoppingList({
  items,
  products,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateProduct,
  onPurchaseComplete
}: ShoppingListProps) {
  const [validatingItem, setValidatingItem] = useState<ShoppingListItem | null>(null);

  const handlePurchaseClick = (item: ShoppingListItem) => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      const suggestedQuantity = Math.max(1, product.quantity);
      setValidatingItem({
        ...item,
        suggestedQuantity,
        autoUpdateStock: true
      });
    }
  };

  const handleValidatePurchase = (validated: boolean, quantity: number, updateStock: boolean) => {
    if (validatingItem && validated) {
      if (updateStock) {
        onUpdateProduct(validatingItem.productId, quantity);
      }
      onPurchaseComplete(validatingItem.id);
    }
    setValidatingItem(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">Votre liste de courses est vide</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Liste de courses ({items.length})
        </h2>
        <ShareButton products={products} />
      </div>
      <AnimatePresence>
        {items.map((item) => {
          const product = products.find(p => p.id === item.productId);
          const isLowStock = product && product.quantity <= 2;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 dark:text-white font-medium truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} {item.unit}
                    </span>
                    {isLowStock && (
                      <span className="inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        Stock bas
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePurchaseClick(item)}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {validatingItem && (
          <PurchaseValidation
            item={validatingItem}
            product={products.find(p => p.id === validatingItem.productId)!}
            onValidate={handleValidatePurchase}
            onClose={() => setValidatingItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}