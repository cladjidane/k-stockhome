import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCodeIcon, ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import BarcodeScanner from '../components/Scanner/BarcodeScanner';
import { productService } from '../services/productService';

export default function AddStock() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (result) => {
    setIsScanning(false);
    setScannedBarcode(result);
    setIsLoading(true);
    setError('');

    try {
      const products = await productService.getProducts({ search: result });
      const existingProduct = products.find(p => p.codebar === result);
      
      if (existingProduct) {
        setProduct(existingProduct);
        setQuantity(existingProduct.quantite);
      } else {
        navigate('/products/new', { state: { codebar: result } });
      }
    } catch (err) {
      setError('Erreur lors de la recherche du produit');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (delta) => {
    const newQuantity = Math.max(0, quantity + delta);
    if (newQuantity === quantity) return;

    setIsLoading(true);
    setError('');

    try {
      await productService.updateQuantity(product.id, newQuantity);
      setQuantity(newQuantity);
    } catch (err) {
      setError('Erreur lors de la mise à jour de la quantité');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <Link
                  to="/products"
                  className="mr-4 rounded-full bg-white p-2 text-gray-400 hover:text-gray-500"
                >
                  <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Add Stock
                </h2>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : !scannedBarcode ? (
                <div className="text-center">
                  {!isScanning ? (
                    <div>
                      <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Scan a product</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start by scanning a product's barcode to add or update stock.
                      </p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => setIsScanning(true)}
                          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                        >
                          <QrCodeIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                          Scan Barcode
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-lg mx-auto">
                      <BarcodeScanner onScanSuccess={handleScan} />
                      <button
                        type="button"
                        onClick={() => setIsScanning(false)}
                        className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : product ? (
                <div>
                  <div className="border-b border-gray-200 pb-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {product.marque}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Code-barres: {scannedBarcode}
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        type="button"
                        disabled={isLoading || quantity === 0}
                        onClick={() => handleUpdateQuantity(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      >
                        <MinusIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      <span className="text-2xl font-semibold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleUpdateQuantity(1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      >
                        <PlusIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setScannedBarcode(null);
                          setProduct(null);
                          setQuantity(1);
                        }}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Scanner un autre produit
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
