import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flag, preloadFlags } from './Flag';

describe('Flag', () => {
  it('renders an img element with correct src', () => {
    render(<Flag countryCode="US" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/flags/us.svg');
    expect(img).toHaveAttribute('alt', 'US flag');
  });

  it('converts country code to lowercase for URL', () => {
    render(<Flag countryCode="GB" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/flags/gb.svg');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Flag countryCode="US" size="xs" />);
    expect(screen.getByRole('img')).toHaveClass('w-3', 'h-2.5');

    rerender(<Flag countryCode="US" size="sm" />);
    expect(screen.getByRole('img')).toHaveClass('w-4', 'h-3');

    rerender(<Flag countryCode="US" size="md" />);
    expect(screen.getByRole('img')).toHaveClass('w-5', 'h-4');

    rerender(<Flag countryCode="US" size="lg" />);
    expect(screen.getByRole('img')).toHaveClass('w-6', 'h-5');
  });

  it('renders fallback dot on image error', () => {
    render(<Flag countryCode="XX" fallbackColor="#ff0000" />);
    const img = screen.getByRole('img');

    // Simulate error
    fireEvent.error(img);

    // Should now render a span (fallback)
    const fallback = screen.queryByRole('img');
    expect(fallback).toBeNull();

    // Check for the fallback span with color
    const dot = document.querySelector('span');
    expect(dot).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('applies custom className', () => {
    render(<Flag countryCode="US" className="custom-class" />);
    expect(screen.getByRole('img')).toHaveClass('custom-class');
  });

  it('uses lazy loading', () => {
    render(<Flag countryCode="US" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });
});

describe('preloadFlags', () => {
  it('creates prefetch links for each country code', () => {
    const originalAppendChild = document.head.appendChild;
    const appendedElements: HTMLElement[] = [];
    document.head.appendChild = vi.fn((element: Node) => {
      appendedElements.push(element as HTMLElement);
      return element;
    });

    preloadFlags(['US', 'GB', 'FR']);

    expect(appendedElements).toHaveLength(3);
    expect(appendedElements[0]).toHaveAttribute('href', '/flags/us.svg');
    expect(appendedElements[1]).toHaveAttribute('href', '/flags/gb.svg');
    expect(appendedElements[2]).toHaveAttribute('href', '/flags/fr.svg');

    document.head.appendChild = originalAppendChild;
  });
});
