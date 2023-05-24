import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => {
  const mockNavigateMock = jest.fn();
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigateMock,
  };
});

describe('App', () => {
  it('renders the app correctly', () => {
    render(
      <App />
    );

    // Assert the presence of specific elements in the app
    expect(screen.getByText(/Waiter's App/i)).toBeInTheDocument();
  });
});
