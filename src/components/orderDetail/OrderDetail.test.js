import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderDetail from './OrderDetail';

describe('OrderDetail', () => {
  const selectedProducts = [
    { id: 1, name: 'Product 1', img: 'product1.jpg', description: 'Product 1 description', quantity: 2 },
    { id: 2, name: 'Product 2', img: 'product2.jpg', description: 'Product 2 description', quantity: 3 },
    { id: 3, name: 'Product 3', img: 'product3.jpg', description: 'Product 3 description', quantity: 1 },
  ];

  test('renders OrderDetail component with selected products', () => {
    render(<OrderDetail selectedProducts={selectedProducts} updateQuantity={jest.fn()} />);

    selectedProducts.forEach((product) => {
      const productCard = screen.getByTestId(`product-card-${product.id}`);
      expect(productCard).toBeInTheDocument();

      const productName = screen.getByText(product.name);
      expect(productName).toBeInTheDocument();

      const productDescription = screen.getByText(product.description);
      expect(productDescription).toBeInTheDocument();

      const productImage = screen.getByAltText(product.name);
      expect(productImage).toHaveAttribute('src', product.img);

      const productQuantityDisplay = screen.getByTestId(`quantity-display-${product.id}`);
      expect(productQuantityDisplay).toHaveValue(product.quantity.toString());
    });
  });

  test('increments quantity when increment button is clicked', () => {
    const updateQuantityMock = jest.fn();
    render(<OrderDetail selectedProducts={selectedProducts} updateQuantity={updateQuantityMock} />);

    const incrementButtons = screen.getAllByTestId(/increment-button-\d+/);

    incrementButtons.forEach((button, index) => {
      fireEvent.click(button);

      expect(updateQuantityMock).toHaveBeenCalledTimes(index + 1);
      expect(updateQuantityMock).toHaveBeenCalledWith(selectedProducts[index].id, selectedProducts[index].quantity + 1);
    });
  });

  test('decrements quantity when decrement button is clicked', () => {
    const updateQuantityMock = jest.fn();
    render(<OrderDetail selectedProducts={selectedProducts} updateQuantity={updateQuantityMock} />);

    const decrementButtons = screen.getAllByTestId(/decrement-button-\d+/);

    decrementButtons.forEach((button, index) => {
      fireEvent.click(button);

      expect(updateQuantityMock).toHaveBeenCalledTimes(index + 1);
      expect(updateQuantityMock).toHaveBeenCalledWith(selectedProducts[index].id, selectedProducts[index].quantity - 1);
    });
  });
});
