import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BillSummary from './BillSummary';

describe('BillSummary', () => {
  const selectedProducts = [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 },
  ];

  const handleTipMock = jest.fn();
  const order = {
    total_check: 40,
    percentage_tip: 10,
    total_tip: 4,
  };

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <BillSummary
        selectedProducts={selectedProducts}
        handleTip={handleTipMock}
        order={order}
      />
    );
  });

  test('renders the subtotal', () => {
    const subTotalElement = screen.getByText(/Subtotal:/);
    expect(subTotalElement).toBeInTheDocument();
    expect(subTotalElement).toHaveTextContent('Subtotal: 40');
  });

  test('renders the IPC', () => {
    const ipcElement = screen.getByText(/IPC\(8%\):/);
    expect(ipcElement).toBeInTheDocument();
    expect(ipcElement).toHaveTextContent('IPC(8%): 3.2');
  });

  test('renders the tip', () => {
    const tipElement = screen.getByText(/Tip\(10%\):/);
    expect(tipElement).toBeInTheDocument();
    expect(tipElement).toHaveTextContent('Tip(10%): 4');
  });

  test('renders the total', () => {
    const totalElement = screen.getByText(/Total:/);
    expect(totalElement).toBeInTheDocument();
    expect(totalElement).toHaveTextContent('Total: 44');
  });

  test('calls handleTip when tip button is clicked', () => {
    const tipButton = screen.getByText('10%');
    fireEvent.click(tipButton);
    expect(handleTipMock).toHaveBeenCalledWith(40, 4, 10);
  });
});
