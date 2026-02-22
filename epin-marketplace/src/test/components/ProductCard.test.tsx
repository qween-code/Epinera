import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ui/ProductCard';

// Mock WishlistButton
vi.mock('@/components/ui/WishlistButton', () => ({
  default: () => <button data-testid="wishlist-btn">Wishlist</button>,
}));

vi.mock('@/lib/constants/games', () => ({
  PRODUCT_PLACEHOLDER: '/placeholder.png',
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    slug: 'test-product',
    title: 'Test Product',
    lowest_price: 29.99,
    currency: 'TRY',
    image_url: '/test.png',
  };

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders price when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('29.99')).toBeInTheDocument();
    expect(screen.getByText('TRY')).toBeInTheDocument();
  });

  it('renders fallback text when no price', () => {
    render(<ProductCard product={{ ...mockProduct, lowest_price: undefined }} />);
    expect(screen.getByText('Fiyatlar icin tiklayin')).toBeInTheDocument();
  });

  it('links to product page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/test-product');
  });

  it('renders wishlist button', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId('wishlist-btn')).toBeInTheDocument();
  });

  it('renders star rating when available', () => {
    render(<ProductCard product={{ ...mockProduct, average_rating: 4.5, review_count: 10 }} />);
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });
});
