import { Product } from '../types';

export const MAIN_CATEGORIES = {
  'Produits frais': ['Produits laitiers', 'Viandes', 'Poissons', 'Fruits et légumes'],
  'Épicerie': ['Conserves', 'Pâtes et riz', 'Petit-déjeuner', 'Snacks', 'Condiments'],
  'Boissons': ['Eau', 'Sodas', 'Jus', 'Alcools'],
  'Non alimentaire': ['Entretien', 'Hygiène', 'Fournitures'],
  'Autres': ['Divers']
} as const;

export type MainCategory = keyof typeof MAIN_CATEGORIES;

export function getMainCategory(category?: string): MainCategory {
  if (!category) return 'Autres';

  // Convertir en minuscules pour la comparaison
  const lowerCategory = category.toLowerCase();

  // Parcourir toutes les catégories principales
  for (const [mainCat, subCats] of Object.entries(MAIN_CATEGORIES)) {
    // Vérifier si la catégorie correspond à la catégorie principale
    if (lowerCategory.includes(mainCat.toLowerCase())) {
      return mainCat as MainCategory;
    }
    // Vérifier si la catégorie correspond à une sous-catégorie
    for (const subCat of subCats) {
      if (lowerCategory.includes(subCat.toLowerCase())) {
        return mainCat as MainCategory;
      }
    }
  }

  return 'Autres';
}

export function groupProductsByCategory(products: Product[]): Record<MainCategory, Product[]> {
  const grouped = {} as Record<MainCategory, Product[]>;

  // Initialiser toutes les catégories principales avec des tableaux vides
  for (const mainCat of Object.keys(MAIN_CATEGORIES)) {
    grouped[mainCat as MainCategory] = [];
  }

  // Grouper les produits par catégorie principale
  products.forEach(product => {
    const mainCategory = getMainCategory(product.categories);
    grouped[mainCategory].push(product);
  });

  return grouped;
}
