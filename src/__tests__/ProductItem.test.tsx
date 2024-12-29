import { render, screen, fireEvent } from '@testing-library/react';
import ProductItem from '../components/ProductItem';
import { Product } from '../types';

describe('ProductItem', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Yaourt nature',
    quantity: 2,
    unit: 'unité',
    category: 'product',
    location: 'Réfrigérateur',
    categories: 'Produits laitiers',
    nutriscore: 'a',
    nutriments: {
      energy_100g: 100,
      proteins_100g: 3.5,
      carbohydrates_100g: 4.8,
      fat_100g: 3.2
    },
    labels: 'Bio, Sans lactose'
  };

  const mockHandlers = {
    onUpdateQuantity: jest.fn(),
    onUpdateLocation: jest.fn(),
    onDelete: jest.fn(),
    onAddToShoppingList: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    expect(screen.getByText('Yaourt nature')).toBeInTheDocument();
    expect(screen.getByText('2 unité')).toBeInTheDocument();
    expect(screen.getByText('Produits laitiers')).toBeInTheDocument();
  });

  it('handles quantity updates correctly', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    // Test diminution
    const decrementButton = screen.getByLabelText('Diminuer la quantité de Yaourt nature');
    fireEvent.click(decrementButton);
    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('1', 1);

    // Test augmentation
    const incrementButton = screen.getByLabelText('Augmenter la quantité de Yaourt nature');
    fireEvent.click(incrementButton);
    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('prevents negative quantities', () => {
    const productWithZeroQuantity = { ...mockProduct, quantity: 0 };
    render(<ProductItem product={productWithZeroQuantity} {...mockHandlers} />);
    
    const decrementButton = screen.getByLabelText('Diminuer la quantité de Yaourt nature');
    fireEvent.click(decrementButton);
    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('1', 0);
  });

  it('displays nutriscore with correct color', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    const expandButton = screen.getByLabelText('Afficher les détails');
    fireEvent.click(expandButton);
    
    const nutriscoreElement = screen.getByText('A');
    expect(nutriscoreElement).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('shows low stock alert when quantity is low', () => {
    const lowStockProduct = { ...mockProduct, quantity: 1 };
    render(<ProductItem product={lowStockProduct} {...mockHandlers} />);
    
    expect(screen.getByText(/stock bas pour yaourt nature/i)).toBeInTheDocument();
    
    const addToShoppingListButton = screen.getByText(/ajouter à la liste de courses/i);
    fireEvent.click(addToShoppingListButton);
    expect(mockHandlers.onAddToShoppingList).toHaveBeenCalledWith(lowStockProduct);
  });

  it('handles location changes correctly', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    const locationSelect = screen.getByRole('combobox');
    fireEvent.change(locationSelect, { target: { value: 'Placard cuisine' } });
    expect(mockHandlers.onUpdateLocation).toHaveBeenCalledWith('1', 'Placard cuisine');
  });

  it('handles product deletion', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    const deleteButton = screen.getByLabelText('Supprimer Yaourt nature');
    fireEvent.click(deleteButton);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('displays product details when expanded', () => {
    render(<ProductItem product={mockProduct} {...mockHandlers} />);
    
    const expandButton = screen.getByLabelText('Afficher les détails');
    fireEvent.click(expandButton);
    
    // Vérifier les nutriments
    expect(screen.getByText(/nutri-score/i)).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    
    // Vérifier les labels
    expect(screen.getByText(/bio/i)).toBeInTheDocument();
    expect(screen.getByText(/sans lactose/i)).toBeInTheDocument();
  });
});
