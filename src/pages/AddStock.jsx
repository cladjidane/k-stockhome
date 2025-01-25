import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCodeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import BarcodeScanner from '../components/Scanner/BarcodeScanner';

export default function AddStock() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState(null);

  const handleScan = (result) => {
    setScannedBarcode(result);
    setIsScanning(false);
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
              {!scannedBarcode ? (
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
              ) : (
                <div>
                  <div className="border-b border-gray-200 pb-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Scanned Product: {scannedBarcode}
                    </h3>
                  </div>
                  {/* Add your form for updating stock here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
