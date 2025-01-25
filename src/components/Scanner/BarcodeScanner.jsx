import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const BarcodeScanner = ({ onScanSuccess }) => {
  const [scanner, setScanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newScanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    });

    newScanner.render(success, error);
    setScanner(newScanner);
    setIsLoading(false);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const success = (result) => {
    if (scanner) {
      scanner.clear();
    }
    onScanSuccess(result);
  };

  const error = (err) => {
    console.warn(err);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-indigo-600">
        <div className="flex items-center justify-center space-x-2">
          <QrCodeIcon className="h-6 w-6 text-white" />
          <h2 className="text-lg font-semibold text-white">Scanner de code-barres</h2>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div id="reader" className="w-full"></div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Placez le code-barres dans le cadre pour le scanner
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
