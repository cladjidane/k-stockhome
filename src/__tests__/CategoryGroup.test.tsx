import { render, screen, fireEvent } from '@testing-library/react';
import CategoryGroup from '../components/CategoryGroup';
import { Product } from '../types';

describe('CategoryGroup', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Yaourt nature',
      quantity: 2,
      unit: 'unité',
      category: 'product',
      location: 'Réfrigérateur',
      categories: 'Produits laitiers',
    },
    {
      id: '2',
      name: 'Lait',
      quantity: 1,
      unit: 'L',
      category: 'product',
      location: 'Réfrigérateur',
      categories: 'Produits laitiers',
    },
  ];

  const mockHandlers = {
    onUpdateQuantity: jest.fn(),
    onUpdateLocation: jest.fn(),
    onDelete: jest.fn(),
    onAddToShoppingList: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category title and product count', () => {
    render(
      <CategoryGroup
        title="Produits frais"
        products={mockProducts}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Produits frais')).toBeInTheDocument();
    expect(screen.getByText('2 articles')).toBeInTheDocument();
  });

  it('expands and collapses when clicked', () => {
    render(
      <CategoryGroup
        title="Produits frais"
        products={mockProducts}
        {...mockHandlers}
      />
    );

    // Par défaut, le groupe est expansé
    expect(screen.getByText('Yaourt nature')).toBeInTheDocument();
    expect(screen.getByText('Lait')).toBeInTheDocument();

    // Cliquer pour réduire
    fireEvent.click(screen.getByText('Produits frais'));
    
    // Les produits ne devraient plus être visibles
    expect(screen.queryByText('Yaourt nature')).not.toBeInTheDocument();
    expect(screen.queryByText('Lait')).not.toBeInTheDocument();

    // Cliquer pour expanser à nouveau
    fireEvent.click(screen.getByText('Produits frais'));
    
    // Les produits devraient être à nouveau visibles
    expect(screen.getByText('Yaourt nature')).toBeInTheDocument();
    expect(screen.getByText('Lait')).toBeInTheDocument();
  });

  it('does not render if products array is empty', () => {
    render(
      <CategoryGroup
        title="Produits frais"
        products={[]}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('Produits frais')).not.toBeInTheDocument();
  });

  it('handles product interactions correctly', () => {
    render(
      <CategoryGroup
        title="Produits frais"
        products={mockProducts}
        {...mockHandlers}
      />
    );

    // Simuler la mise à jour de la quantité
    const decrementButton = screen.getByLabelText('Diminuer la quantité de Yaourt nature');
    fireEvent.click(decrementButton);
    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith('1', 1);

    // Simuler la mise à jour de l'emplacement
    const locationSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(locationSelect, { target: { value: 'Placard cuisine' } });
    expect(mockHandlers.onUpdateLocation).toHaveBeenCalledWith('1', 'Placard cuisine');
  });
});
