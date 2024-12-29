import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, ShoppingCart, Package } from 'lucide-react';
import { ShoppingListItem, Product } from '../types';

interface PurchaseValidationProps {
  item: ShoppingListItem;
  product: Product;
  onValidate: (validated: boolean, quantity: number, updateStock: boolean) => void;
  onClose: () => void;
}

export default function PurchaseValidation({
  item,
  product,
  onValidate,
  onClose,
}: PurchaseValidationProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updateStock, setUpdateStock] = useState(item.autoUpdateStock ?? true);
  const newStock = product.quantity + quantity;
  const isDifferentFromSuggested = item.suggestedQuantity && quantity !== item.suggestedQuantity;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Valider l'achat
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 py-4 space-y-4">
          {/* Informations produit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantité actuelle en stock : {product.quantity} {product.unit}
                </p>
              </div>
            </div>
          </div>

          {/* Quantité */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantité achetée
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="block w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400">{item.unit}</span>
            </div>
            
            {isDifferentFromSuggested && (
              <p className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                Quantité suggérée : {item.suggestedQuantity} {item.unit}
              </p>
            )}
          </div>

          {/* Aperçu du nouveau stock */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Nouveau stock après achat
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {newStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Option de mise à jour du stock */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={updateStock}
              onChange={(e) => setUpdateStock(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Mettre à jour automatiquement le stock
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
          >
            Annuler
          </button>
          <button
            onClick={() => onValidate(true, quantity, updateStock)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md inline-flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Valider l'achat
          </button>
        </div>
      </div>
    </motion.div>
  );
}
