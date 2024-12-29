import { getMainCategory, groupProductsByCategory } from '../utils/categoryUtils';
import { Product } from '../types';

describe('categoryUtils', () => {
  describe('getMainCategory', () => {
    it('returns correct main category for known categories', () => {
      expect(getMainCategory('Produits laitiers')).toBe('Produits frais');
      expect(getMainCategory('Conserves')).toBe('Épicerie');
      expect(getMainCategory('Sodas')).toBe('Boissons');
      expect(getMainCategory('Entretien')).toBe('Non alimentaire');
    });

    it('handles case insensitive matching', () => {
      expect(getMainCategory('produits laitiers')).toBe('Produits frais');
      expect(getMainCategory('CONSERVES')).toBe('Épicerie');
    });

    it('returns Autres for unknown categories', () => {
      expect(getMainCategory('Catégorie inconnue')).toBe('Autres');
      expect(getMainCategory(undefined)).toBe('Autres');
    });
  });

  describe('groupProductsByCategory', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Yaourt',
        quantity: 1,
        unit: 'unité',
        category: 'product',
        location: 'Réfrigérateur',
        categories: 'Produits laitiers'
      },
      {
        id: '2',
        name: 'Pâtes',
        quantity: 2,
        unit: 'paquet',
        category: 'product',
        location: 'Placard',
        categories: 'Pâtes et riz'
      },
      {
        id: '3',
        name: 'Lessive',
        quantity: 1,
        unit: 'bouteille',
        category: 'product',
        location: 'Placard',
        categories: 'Entretien'
      }
    ];

    it('groups products into correct categories', () => {
      const grouped = groupProductsByCategory(mockProducts);
      
      expect(grouped['Produits frais']).toHaveLength(1);
      expect(grouped['Épicerie']).toHaveLength(1);
      expect(grouped['Non alimentaire']).toHaveLength(1);
      
      expect(grouped['Produits frais'][0].name).toBe('Yaourt');
      expect(grouped['Épicerie'][0].name).toBe('Pâtes');
      expect(grouped['Non alimentaire'][0].name).toBe('Lessive');
    });

    it('initializes all categories even if empty', () => {
      const grouped = groupProductsByCategory([]);
      
      expect(grouped['Produits frais']).toHaveLength(0);
      expect(grouped['Épicerie']).toHaveLength(0);
      expect(grouped['Boissons']).toHaveLength(0);
      expect(grouped['Non alimentaire']).toHaveLength(0);
      expect(grouped['Autres']).toHaveLength(0);
    });

    it('handles products with unknown categories', () => {
      const productsWithUnknown: Product[] = [
        ...mockProducts,
        {
          id: '4',
          name: 'Produit inconnu',
          quantity: 1,
          unit: 'unité',
          category: 'product',
          location: 'Placard',
          categories: 'Catégorie inconnue'
        }
      ];

      const grouped = groupProductsByCategory(productsWithUnknown);
      expect(grouped['Autres']).toHaveLength(1);
      expect(grouped['Autres'][0].name).toBe('Produit inconnu');
    });
  });
});
