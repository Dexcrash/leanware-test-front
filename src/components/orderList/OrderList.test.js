/* eslint-disable jest/no-conditional-expect */
/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderList from './OrderList';

describe('OrderList', () => {
  const selectedCustomerId = 2;
  const customers = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];

  const onCustomerClickMock = jest.fn();
  const addCustomerMock = jest.fn();

  beforeEach(() => {
    render(
      <OrderList
        selectedCustomerId={selectedCustomerId}
        onCustomerClick={onCustomerClickMock}
        customers={customers}
        addCustomer={addCustomerMock}
      />
    );
  });

  test('renders the add chair button', () => {
    const addChairButton = screen.getByTestId('add-chair-button');
    expect(addChairButton).toBeInTheDocument();
  });

  test('calls addCustomer when add chair button is clicked', () => {
    const addChairButton = screen.getByTestId('add-chair-button');
    fireEvent.click(addChairButton);

    expect(addCustomerMock).toHaveBeenCalledTimes(1);
  });

  test('renders the customers correctly', () => {
    const orderCards = screen.getAllByTestId(/^order-\d+$/i);

    expect(orderCards).toHaveLength(customers.length);

    orderCards.forEach((orderCard, index) => {
      expect(orderCard).toBeInTheDocument();

      if (index === selectedCustomerId - 1) {
        expect(orderCard).toHaveClass('selected');
      } else {
        expect(orderCard).toHaveClass('normal');
      }
    });
  });

  test('calls onCustomerClick with the correct customer ID when a customer card is clicked', () => {
    const orderCard = screen.getByTestId('order-2');
    fireEvent.click(orderCard);

    expect(onCustomerClickMock).toHaveBeenCalledWith(2);
  });
});
