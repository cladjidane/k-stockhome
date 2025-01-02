
import React, { useState } from 'react';
import { Tag, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une catégorie..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredCategories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(selectedCategory === category ? null : category)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  selectedCategory === category
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <Tag className="w-4 h-4" />
              {category}
              {selectedCategory === category && (
                <X className="w-4 h-4 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
