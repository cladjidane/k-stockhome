import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const BarcodeScanner = ({ onScanSuccess }) => {
  const [error, setError] = useState(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log('[BarcodeScanner] Scan successful:', { result: result.getText() });
      onScanSuccess(result.getText());
    },
    onError(error) {
      console.error('[BarcodeScanner] Scan error:', error);
      setError('Unable to access camera: ' + error.message);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-indigo-600">
        <div className="flex items-center justify-center space-x-2">
          <QrCodeIcon className="h-6 w-6 text-white" />
          <h2 className="text-lg font-semibold text-white">Scanner de code-barres</h2>
        </div>
      </div>
      
      <div className="p-4">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="relative">
            <video ref={ref} className="w-full h-64 object-cover" />
            <p className="mt-4 text-sm text-gray-500 text-center">
              Placez le code-barres dans le cadre pour le scanner
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
