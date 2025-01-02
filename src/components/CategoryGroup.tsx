
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../types";
import ProductItem from "../features/products/components/ProductItem";

interface LocationGroupProps {
  title: string;
  products: Product[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateLocation: (id: string, location: string) => void;
  onDelete: (id: string) => void;
  onAddToShoppingList: (product: Product) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LocationGroup({
  title,
  products,
  onUpdateQuantity,
  onUpdateLocation,
  onDelete,
  onAddToShoppingList,
}: LocationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (products.length === 0) return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="rounded-xl mb-4 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 px-4 flex items-center justify-between"
      >
        <motion.h3
          variants={item}
          className="text-lg font-medium text-gray-900 dark:text-white"
        >
          {title}
        </motion.h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} article{products.length !== 1 ? "s" : ""}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <motion.div variants={container} className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <motion.div key={product.id} variants={item} layout>
              <ProductItem
                product={product}
                onUpdateQuantity={onUpdateQuantity}
                onUpdateLocation={onUpdateLocation}
                onDelete={onDelete}
                onAddToShoppingList={onAddToShoppingList}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
