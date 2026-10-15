import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodCard from '../components/FoodCard';

// ==========================================
// EXPERIMENT 1: Component Testing for FoodCard
// a) Test cases for FoodCard
// b) Test whether food information is rendered correctly
// d) Test add-to-cart action
// ==========================================

const mockFood = {
  id: 'food-test-1',
  name: 'Artisan Truffle Burger',
  category: 'Burgers',
  price: 16.99,
  rating: 4.9,
  reviewsCount: 142,
  prepTime: '20 mins',
  calories: 780,
  isVegetarian: true,
  isSpicy: true,
  description: 'Dry-aged Black Angus patty, black truffle aioli, melted Gruyère.',
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
};

describe('FoodCard Component Testing', () => {
  it('renders food information correctly', () => {
    render(<FoodCard food={mockFood} />);

    // b) Verify food title, description, and category
    expect(screen.getByText('Artisan Truffle Burger')).toBeInTheDocument();
    expect(screen.getByText(/Dry-aged Black Angus patty/i)).toBeInTheDocument();
    expect(screen.getByText('Burgers')).toBeInTheDocument();

    // Verify price formatting
    expect(screen.getByText('$16.99')).toBeInTheDocument();

    // Verify rating and reviews
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('(142)')).toBeInTheDocument();

    // Verify prep time and calories
    expect(screen.getByText(/20 mins/i)).toBeInTheDocument();
    expect(screen.getByText(/780 kcal/i)).toBeInTheDocument();

    // Verify dietary badges
    expect(screen.getByText(/Veg/i)).toBeInTheDocument();
    expect(screen.getByText(/Spicy/i)).toBeInTheDocument();
  });

  it('triggers onSelectDetails with food id when Details button is clicked', () => {
    const handleDetails = jest.fn();
    render(<FoodCard food={mockFood} onSelectDetails={handleDetails} />);

    const detailsButton = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsButton);

    expect(handleDetails).toHaveBeenCalledTimes(1);
    expect(handleDetails).toHaveBeenCalledWith('food-test-1');
  });

  it('triggers onAddToCart with food item when Add button is clicked', () => {
    const handleAddToCart = jest.fn();
    render(<FoodCard food={mockFood} onAddToCart={handleAddToCart} />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockFood);
  });
});
