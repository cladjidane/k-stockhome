import React from 'react';
import { Share } from 'lucide-react';
import { Product } from '../types';
import Tooltip from './Tooltip';

interface ShareButtonProps {
  products: Product[];
}

export default function ShareButton({ products }: ShareButtonProps) {
  const formatShoppingList = (products: Product[]): string => {
    if (products.length === 0) return "Liste de courses vide";

    const header = "📝 Ma liste de courses:\n\n";
    const items = products
      .map(p => `• ${p.name} (${p.quantity} ${p.unit})`)
      .join('\n');
    
    return `${header}${items}`;
  };

  const handleShare = async () => {
    const text = formatShoppingList(products);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma liste de courses',
          text: text,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Erreur lors du partage:', error);
          // Fallback pour le copier-coller
          await navigator.clipboard.writeText(text);
          alert('Liste copiée dans le presse-papier !');
        }
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      try {
        await navigator.clipboard.writeText(text);
        alert('Liste copiée dans le presse-papier !');
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
      }
    }
  };

  return (
    <Tooltip content="Partager la liste">
      <button
        onClick={handleShare}
        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
        aria-label="Partager la liste de courses"
      >
        <Share className="w-5 h-5" />
      </button>
    </Tooltip>
  );
}
