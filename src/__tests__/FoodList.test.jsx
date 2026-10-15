import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodList from '../components/FoodList';

// ==========================================
// EXPERIMENT 1: Component Testing for FoodList
// a) Test cases for FoodList component
// b) Test rendering food items
// c) Test search and category filtering
// f) React Testing Library interactions
// ==========================================

const mockFoods = [
  {
    id: 'food-1',
    name: 'Artisan Truffle Burger',
    category: 'Burgers',
    price: 16.99,
    rating: 4.9,
    description: 'Dry-aged patty with truffle aioli',
    image: 'https://images.unsplash.com/photo-1'
  },
  {
    id: 'food-2',
    name: 'Spicy Tonkotsu Ramen',
    category: 'Asian',
    price: 15.5,
    rating: 4.8,
    description: 'Rich pork broth with handmade noodles',
    image: 'https://images.unsplash.com/photo-2'
  }
];

describe('FoodList Component Testing', () => {
  it('renders a list of food items correctly', () => {
    render(<FoodList foods={mockFoods} />);

    expect(screen.getByText('Artisan Truffle Burger')).toBeInTheDocument();
    expect(screen.getByText('Spicy Tonkotsu Ramen')).toBeInTheDocument();
  });

  it('triggers onSearchChange when user types in the search input', () => {
    const handleSearch = jest.fn();
    render(<FoodList foods={mockFoods} searchQuery="" onSearchChange={handleSearch} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Truffle' } });

    expect(handleSearch).toHaveBeenCalledWith('Truffle');
  });

  it('triggers onCategorySelect when a category tab is clicked', () => {
    const handleCategory = jest.fn();
    render(
      <FoodList
        foods={mockFoods}
        categories={['All', 'Burgers', 'Asian']}
        selectedCategory="All"
        onCategorySelect={handleCategory}
      />
    );

    const asianPill = screen.getByTestId('category-pill-asian');
    fireEvent.click(asianPill);

    expect(handleCategory).toHaveBeenCalledWith('Asian');
  });

  it('displays loading skeleton indicator when isLoading is true', () => {
    render(<FoodList foods={[]} isLoading={true} />);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('displays error message and handles retry button', () => {
    const handleRefresh = jest.fn();
    render(
      <FoodList
        foods={[]}
        error="Network connection failure"
        isLoading={false}
        onRefresh={handleRefresh}
      />
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(/Network connection failure/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('retry-btn');
    fireEvent.click(retryBtn);

    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });

  it('displays empty state when foods array is empty', () => {
    render(<FoodList foods={[]} isLoading={false} error={null} />);

    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    expect(screen.getByText(/No dishes found/i)).toBeInTheDocument();
  });
});
