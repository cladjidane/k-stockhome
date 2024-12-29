import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning';
  dismissible?: boolean;
}

export default function ErrorMessage({ 
  message, 
  onDismiss, 
  type = 'error',
  dismissible = true 
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const styles = {
    error: {
      container: 'bg-red-50 text-red-700 border-red-200',
      icon: 'text-red-400',
    },
    warning: {
      container: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: 'text-yellow-400',
    }
  };

  return (
    <div className={`p-4 rounded-md border ${styles[type].container} relative`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 ${styles[type].icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'error' 
                    ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                    : 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                }`}
              >
                <span className="sr-only">Fermer</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
