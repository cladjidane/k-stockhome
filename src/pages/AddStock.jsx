import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCodeIcon, ArrowLeftIcon, PlusIcon, MinusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const products = await productService.getProducts({ search: query });
      setSearchResults(products);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScan = async (result) => {
    setIsScanning(false);
    setScannedBarcode(result);
    setIsLoading(true);
    setError('');

    try {
      const products = await productService.getProducts({ search: result });
      const existingProduct = products.find(p => p.barcodes.some(b => b.code === result));
      
      if (existingProduct) {
        setProduct(existingProduct);
        setQuantity(existingProduct.quantite);
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setError('Erreur lors de la recherche du produit');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBarcodeToProduct = async (selectedProduct) => {
    setIsLoading(true);
    setError('');
    try {
      const updatedProduct = await productService.addBarcodeToProduct(selectedProduct.id, scannedBarcode);
      setProduct(updatedProduct);
      setQuantity(updatedProduct.quantite);
      setShowModal(false);
    } catch (err) {
      setError('Erreur lors de l\'ajout du code-barres');
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

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Code-barres non trouvé</h3>
            <p className="text-sm text-gray-500 mb-6">Que souhaitez-vous faire avec ce code-barres ?</p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate('/products/new', { state: { codebar: scannedBarcode } });
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Créer un nouveau produit
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit existant..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>

              {isSearching ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddBarcodeToProduct(item)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">{item.brand?.name || item.category?.name}</div>
                      <div className="text-sm text-gray-500">{item.category?.name}</div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-6">
                  <div className="text-gray-400 mb-2">
                    <MagnifyingGlassIcon className="h-12 w-12 mx-auto" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-gray-500">Aucun produit ne correspond à votre recherche</p>
                  <p className="text-xs text-gray-400 mt-1">Essayez avec d'autres termes ou créez un nouveau produit</p>
                </div>
              ) : null}

              <button
                onClick={() => {
                  setShowModal(false);
                  setScannedBarcode(null);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
                      <div className="mt-6 flex flex-col space-y-4">
                        <button
                          type="button"
                          onClick={() => setIsScanning(true)}
                          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                        >
                          <QrCodeIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                          Scanner
                        </button>
                        <Link
                          to="/products/new"
                          className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                          Ajouter un produit manuellement
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-lg mx-auto">
                      <BarcodeScanner onScanSuccess={handleScan} />
                      <div className="mt-4 flex flex-col space-y-4">
                        <button
                          type="button"
                          onClick={() => setIsScanning(false)}
                          className="w-full inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <Link
                          to="/products/new"
                          className="w-full inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                          Ajouter un produit manuellement
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : product ? (
                <div>
                  <div className="border-b border-gray-200 pb-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {product.brand?.name || product.category?.name}
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
      {renderModal()}
    </div>
  );
}
