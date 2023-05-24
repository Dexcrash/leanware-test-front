import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuList from './MenuList';

describe('MenuList', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      category: '1',
      img: 'image1.jpg',
    },
    {
      id: '2',
      name: 'Product 2',
      category: '2',
      img: 'image2.jpg',
    },
    {
      id: '3',
      name: 'Product 3',
      category: '2',
      img: 'image3.jpg',
    },
  ];

  const mockAddProduct = jest.fn();

  test('renders category cards correctly', () => {
    render(<MenuList addProduct={mockAddProduct} products={mockProducts} />);

    const categoryCard1 = screen.getByTestId('category-card-1');
    const categoryCard2 = screen.getByTestId('category-card-2');
    const backButton = screen.queryByTestId('button-back');

    expect(categoryCard1).toBeInTheDocument();
    expect(categoryCard2).toBeInTheDocument();
    expect(backButton).not.toBeInTheDocument();
  });

  test('renders product cards when a category card is clicked', () => {
    render(<MenuList addProduct={mockAddProduct} products={mockProducts} />);

    const categoryCard2 = screen.getByTestId('category-card-2');
    fireEvent.click(categoryCard2);

    const backButton = screen.getByTestId('button-back');
    const productCard1 = screen.getByTestId('product-card-2');
    const productCard2 = screen.getByTestId('product-card-3');

    expect(backButton).toBeInTheDocument();
    expect(productCard1).toBeInTheDocument();
    expect(productCard2).toBeInTheDocument();
  });

  test('calls addProduct when a product card is clicked', () => {
    render(<MenuList addProduct={mockAddProduct} products={mockProducts} />);

    const categoryCard2 = screen.getByTestId('category-card-2');
    fireEvent.click(categoryCard2);

    const productCard1 = screen.getByTestId('product-card-2');
    const productCard2 = screen.getByTestId('product-card-3');
    fireEvent.click(productCard1);
    fireEvent.click(productCard2);

    expect(mockAddProduct).toHaveBeenCalledTimes(2);
    expect(mockAddProduct).toHaveBeenCalledWith('2');
    expect(mockAddProduct).toHaveBeenCalledWith('3');
  });
});
