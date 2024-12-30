import { Camera, Minus, Plus, X, PenLine } from 'lucide-react';
import React, { useState } from 'react';

import { useZxing } from 'react-zxing';
import ErrorMessage from '../../../components/ErrorMessage';
import ManualProductForm from '../../../components/ManualProductForm';
import { Product } from '../../../types';
import { getProductInfo } from '../../../utils/productUtils';

interface BarcodeScannerProps {
  onProductFound: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
  products: Product[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

interface ScannedProduct {
  name: string;
  existingProduct?: Product;
  categories?: string;
  labels?: string;
  nutriscore_grade?: string;
  nutriments?: {
    energy_100g: number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
  };
}

interface ApiError {
  message: string;
  type: 'error' | 'warning';
}

export default function BarcodeScanner({ onProductFound, onClose, products, onUpdateQuantity }: BarcodeScannerProps) {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const { ref } = useZxing({
    onDecodeResult: async (result) => {
      const barcode = result.getText();
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la recherche du produit');
        }
        
        const data = await response.json();
        
        if (data.status === 1) {
          const product = data.product;
          const productName = product.product_name_fr || product.product_name || 'Produit inconnu';
          
          if (productName === 'Produit inconnu') {
            setError({
              message: 'Produit trouvé mais sans nom. Vous pouvez l\'ajouter manuellement.',
              type: 'warning'
            });
          }
          
          // Recherche si le produit existe déjà
          const existingProduct = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
          
          setScannedProduct({
            name: productName,
            existingProduct,
            categories: product.categories || '',
            labels: product.labels || '',
            nutriscore_grade: product.nutriscore_grade,
            nutriments: {
              energy_100g: product.nutriments?.energy_100g || 0,
              proteins_100g: product.nutriments?.proteins_100g || 0,
              carbohydrates_100g: product.nutriments?.carbohydrates_100g || 0,
              fat_100g: product.nutriments?.fat_100g || 0,
            }
          });
        } else {
          setError({
            message: 'Produit non trouvé dans la base de données. Vous pouvez l\'ajouter manuellement.',
            type: 'warning'
          });
        }
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Erreur lors de la recherche du produit',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error(error);
      setError({
        message: 'Erreur lors du scan. Vérifiez que votre caméra est bien activée.',
        type: 'error'
      });
    },
  });

  const handleAddProduct = () => {
    if (scannedProduct) {
      const productInfo = getProductInfo(scannedProduct.categories, scannedProduct.labels);

      onProductFound({
        name: scannedProduct.name,
        quantity: 1,
        unit: 'unité',
        category: 'product',
        location: productInfo.location,
        categories: scannedProduct.categories,
        labels: scannedProduct.labels,
        nutriscore: scannedProduct.nutriscore_grade,
        nutriments: scannedProduct.nutriments
      });
      onClose();
    }
  };

  const handleUpdateQuantity = (increase: boolean) => {
    if (scannedProduct?.existingProduct && onUpdateQuantity) {
      const newQuantity = increase 
        ? scannedProduct.existingProduct.quantity + 1
        : Math.max(0, scannedProduct.existingProduct.quantity - 1);
      onUpdateQuantity(scannedProduct.existingProduct.id, newQuantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {showManualForm ? 'Ajouter manuellement' : 'Scanner un code-barres'}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label={showManualForm ? 'Passer au scan' : 'Saisie manuelle'}
            >
              {showManualForm ? (
                <Camera className="w-6 h-6" />
              ) : (
                <PenLine className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showManualForm ? (
          <ManualProductForm
            onSubmit={(product) => {
              onProductFound(product);
              onClose();
            }}
            onCancel={() => setShowManualForm(false)}
          />
        ) : (
          <>
            <div className="relative aspect-video mb-4 bg-black rounded-lg overflow-hidden">
              <video ref={ref} className="w-full h-full object-cover" />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4">
                <ErrorMessage
                  message={error.message}
                  type={error.type}
                  onDismiss={() => setError(null)}
                />
              </div>
            )}

            {scannedProduct ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-medium text-lg">{scannedProduct.name}</h4>
                  {scannedProduct.existingProduct && (
                    <p className="text-sm text-gray-500">
                      Quantité actuelle : {scannedProduct.existingProduct.quantity} {scannedProduct.existingProduct.unit}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {scannedProduct.existingProduct ? (
                    <>
                      <button
                        onClick={() => handleUpdateQuantity(true)}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter 1
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(false)}
                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Retirer 1
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddProduct}
                      className="col-span-2 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter le produit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Placez le code-barres du produit devant la caméra pour le scanner automatiquement.
                </p>
                <div className="text-center">
                  <button
                    onClick={() => setShowManualForm(true)}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    <PenLine className="w-4 h-4 mr-1" />
                    Ou ajoutez manuellement
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}