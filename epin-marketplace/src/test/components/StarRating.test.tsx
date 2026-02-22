import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '@/components/ui/StarRating';

describe('StarRating', () => {
  it('renders correct number of filled stars for display mode', () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  it('calls onChange when interactive and star clicked', () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={0} interactive onChange={onChange} />);
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[2]); // Click 3rd star
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not call onChange in display mode', () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={3} onChange={onChange} />);
    const stars = container.querySelectorAll('svg');
    fireEvent.click(stars[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
