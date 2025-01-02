import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip } from "../../../shared";
import { Product } from "../../../types";
import { useStore } from "../../../store/productStore";
import { availableLocations } from "../../../utils/productUtils";

interface ProductItemProps {
  product: Product;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
}

const LOW_STOCK_THRESHOLD = 2;

const locationColors: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  "Placard cuisine": { bg: "bg-amber-50", text: "text-amber-700", icon: "🪟" },
  Réfrigérateur: { bg: "bg-blue-50", text: "text-blue-700", icon: "❄️" },
  Congélateur: { bg: "bg-indigo-50", text: "text-indigo-700", icon: "🧊" },
  "Garde-manger": { bg: "bg-green-50", text: "text-green-700", icon: "🏠" },
  "Boîte à pain": { bg: "bg-orange-50", text: "text-orange-700", icon: "🍞" },
  "Tiroir cuisine": { bg: "bg-purple-50", text: "text-purple-700", icon: "🗄️" },
  "Dépendance": { bg: "bg-gray-50", text: "text-gray-700", icon: "🏪" },
};

const defaultLocationStyle = {
  bg: "bg-gray-50",
  text: "text-gray-700",
  icon: "📍",
};

export default function ProductItem({ product, onDelete, onUpdateLocation }: ProductItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);
  const locationStyle =
    locationColors[product.location] || defaultLocationStyle;
  const { addToShoppingList } = useStore();

  useEffect(() => {
    setShowLowStockAlert(product.quantity <= LOW_STOCK_THRESHOLD);
  }, [product.quantity]);

  const handleAddToShoppingList = () => {
    addToShoppingList({
      product_id: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
    });
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500";
    toast.textContent = "Produit ajouté au panier";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  };

  const renderNutriscore = () => {
    if (!product.nutriscore) return null;
    const colors: Record<string, string> = {
      a: "bg-green-500",
      b: "bg-lime-500",
      c: "bg-yellow-500",
      d: "bg-orange-500",
      e: "bg-red-500",
    };
    const descriptions: Record<string, string> = {
      a: "Excellente qualité nutritionnelle",
      b: "Bonne qualité nutritionnelle",
      c: "Qualité nutritionnelle moyenne",
      d: "Qualité nutritionnelle insuffisante",
      e: "Mauvaise qualité nutritionnelle",
    };
    const bgColor = colors[product.nutriscore.toLowerCase()] || "bg-gray-500";

    return (
      <Tooltip
        content={
          descriptions[product.nutriscore.toLowerCase()] || "Nutri-Score"
        }
      >
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4 text-gray-500" />
          <span
            className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${bgColor}`}
          >
            {product.nutriscore.toUpperCase()}
          </span>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible transition-all duration-200 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
              <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white truncate">
                {showLowStockAlert && (
                  <Tooltip content="Stock bas - Ajouter au panier">
                    <button
                      onClick={handleAddToShoppingList}
                      className="p-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-800/30 text-amber-600 dark:text-amber-400 rounded-full transition-colors shadow-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </Tooltip>
                )}
                {product.name}
              </h3>
            </div>
            <div className="mt-1 space-y-2">
              <div className="relative group">
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.location) ? product.location : [product.location]).map((loc) => {
                    const style = locationColors[loc] || defaultLocationStyle;
                    return (
                      <div
                        key={loc}
                        className={`inline-flex items-center px-2 py-1 rounded-md ${style.bg} ${style.text} text-sm`}
                      >
                        <span className="mr-1">{style.icon}</span>
                        {loc}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setShowLocations(!showLocations)}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
                  >
                    <span className="mr-1">📍</span>
                    Modifier
                  </button>
                </div>
                
                {showLocations && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {availableLocations.map((location) => {
                        const style = locationColors[location] || defaultLocationStyle;
                        const isSelected = Array.isArray(product.location) 
                          ? product.location.includes(location)
                          : product.location === location;
                        
                        return (
                          <button
                            key={location}
                            onClick={() => {
                              const locations = Array.isArray(product.location)
                                ? product.location
                                : [product.location];
                              
                              if (locations.includes(location)) {
                                onUpdateLocation(product.id, 
                                  locations.filter(loc => loc !== location).join(',')
                                );
                              } else {
                                onUpdateLocation(product.id, 
                                  [...locations, location].join(',')
                                );
                              }
                            }}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              isSelected 
                                ? `${style.bg} ${style.text}`
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="mr-2">{style.icon}</span>
                            {location}
                            {isSelected && (
                              <span className="ml-2">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm">
                {product.quantity} {product.unit}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Tooltip content="Supprimer le produit">
              <div className="relative">
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Tooltip>
            <Tooltip
              content={
                isExpanded
                  ? "Masquer les informations nutritionnelles"
                  : "Voir les informations nutritionnelles"
              }
            >
              <div className="relative">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  aria-label={
                    isExpanded ? "Masquer les détails" : "Voir les détails"
                  }
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {isExpanded && product.nutriments && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 justify-center bg-neutral-100 p-1 rounded ">
            {renderNutriscore()}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {product.nutriments.energy_100g}
              </div>
              <div className="text-gray-500 dark:text-gray-400">kcal/100g</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {product.nutriments.proteins_100g}g
              </div>
              <div className="text-gray-500 dark:text-gray-400">Protéines</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {product.nutriments.carbohydrates_100g}g
              </div>
              <div className="text-gray-500 dark:text-gray-400">Glucides</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">
                {product.nutriments.fat_100g}g
              </div>
              <div className="text-gray-500 dark:text-gray-400">Lipides</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
