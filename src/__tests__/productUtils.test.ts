import { getProductInfo } from '../utils/productUtils';

describe('productUtils', () => {
  describe('getProductInfo', () => {
    it('extracts diet information from categories', () => {
      const result = getProductInfo('Végétarien, Sans gluten', '');
      expect(result.dietInfo).toContain('Convient aux végétariens');
      expect(result.dietInfo).toContain('Sans gluten');
    });

    it('extracts diet information from labels', () => {
      const result = getProductInfo('', 'Bio, Vegan');
      expect(result.dietInfo).toContain('Agriculture biologique');
      expect(result.dietInfo).toContain('Convient aux végans');
    });

    it('combines diet information from both categories and labels', () => {
      const result = getProductInfo('Végétarien', 'Bio');
      expect(result.dietInfo).toHaveLength(2);
      expect(result.dietInfo).toContain('Convient aux végétariens');
      expect(result.dietInfo).toContain('Agriculture biologique');
    });

    it('handles undefined inputs', () => {
      const result = getProductInfo(undefined, undefined);
      expect(result.dietInfo).toHaveLength(0);
    });

    it('handles empty strings', () => {
      const result = getProductInfo('', '');
      expect(result.dietInfo).toHaveLength(0);
    });

    it('removes duplicates from categories and labels', () => {
      const result = getProductInfo('Bio, Vegan', 'Bio, Sans gluten');
      expect(result.dietInfo).toHaveLength(3);
      expect(result.dietInfo).toContain('Agriculture biologique');
      expect(result.dietInfo).toContain('Convient aux végans');
      expect(result.dietInfo).toContain('Sans gluten');
    });

    it('trims whitespace from categories and labels', () => {
      const result = getProductInfo(' Végétarien , Bio ', ' Vegan ');
      expect(result.dietInfo).toContain('Convient aux végétariens');
      expect(result.dietInfo).toContain('Agriculture biologique');
      expect(result.dietInfo).toContain('Convient aux végans');
    });

    it('filters out empty values', () => {
      const result = getProductInfo('Bio,,Vegan', 'Sans gluten, , ');
      expect(result.dietInfo).toHaveLength(3);
      expect(result.dietInfo).toContain('Agriculture biologique');
      expect(result.dietInfo).toContain('Convient aux végans');
      expect(result.dietInfo).toContain('Sans gluten');
    });
  });
});
