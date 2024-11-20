import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { Camera, X, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface BarcodeScannerProps {
  onProductFound: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
  products: Product[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export default function BarcodeScanner({ onProductFound, onClose, products, onUpdateQuantity }: BarcodeScannerProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<{
    name: string;
    existingProduct?: Product;
  } | null>(null);

  const { ref } = useZxing({
    onDecodeResult: async (result) => {
      const barcode = result.getText();
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
          const product = data.product;
          const productName = product.product_name_fr || product.product_name || 'Produit inconnu';
          
          // Recherche si le produit existe déjà
          const existingProduct = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
          
          setScannedProduct({
            name: productName,
            existingProduct
          });
        } else {
          setError('Produit non trouvé dans la base de données');
        }
      } catch (err) {
        setError('Erreur lors de la recherche du produit');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error(error);
      setError('Erreur lors du scan');
    },
  });

  const handleAddProduct = () => {
    if (scannedProduct) {
      onProductFound({
        name: scannedProduct.name,
        quantity: 1,
        unit: 'unité',
        category: 'product',
        location: 'Placard cuisine'
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
          <h3 className="text-lg font-medium">Scanner un code-barres</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-video mb-4 bg-black rounded-lg overflow-hidden">
          <video ref={ref} className="w-full h-full object-cover" />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
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
          <p className="text-sm text-gray-500">
            Placez le code-barres du produit devant la caméra pour le scanner automatiquement.
          </p>
        )}
      </div>
    </div>
  );
}