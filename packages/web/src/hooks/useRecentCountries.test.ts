import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentCountries } from './useRecentCountries';

describe('useRecentCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  it('returns empty array when no recent countries stored', () => {
    const { result } = renderHook(() => useRecentCountries());
    expect(result.current.recentCountries).toEqual([]);
  });

  it('loads recent countries from localStorage on mount', () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.stringify(['US', 'CA', 'MX'])
    );

    const { result } = renderHook(() => useRecentCountries());
    expect(result.current.recentCountries).toEqual(['US', 'CA', 'MX']);
  });

  it('addRecentCountry adds a country to the beginning', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountry('US');
    });

    expect(result.current.recentCountries).toEqual(['US']);
  });

  it('addRecentCountry normalizes country code to uppercase', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountry('us');
    });

    expect(result.current.recentCountries).toEqual(['US']);
  });

  it('addRecentCountry moves existing country to beginning', () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.stringify(['US', 'CA', 'MX'])
    );

    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountry('MX');
    });

    expect(result.current.recentCountries[0]).toBe('MX');
    // Verify MX only appears once (at index 0)
    expect(result.current.recentCountries.filter(c => c === 'MX')).toHaveLength(1);
  });

  it('addRecentCountry limits to maximum 8 countries', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      // Add 10 countries
      for (let i = 0; i < 10; i++) {
        result.current.addRecentCountry(`C${i}`);
      }
    });

    expect(result.current.recentCountries.length).toBeLessThanOrEqual(8);
  });

  it('addRecentCountry saves to localStorage', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountry('US');
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'recent-countries',
      expect.any(String)
    );
  });

  it('addRecentCountries adds multiple countries', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountries(['US', 'CA', 'MX']);
    });

    expect(result.current.recentCountries).toContain('US');
    expect(result.current.recentCountries).toContain('CA');
    expect(result.current.recentCountries).toContain('MX');
  });

  it('addRecentCountries normalizes all codes to uppercase', () => {
    const { result } = renderHook(() => useRecentCountries());

    act(() => {
      result.current.addRecentCountries(['us', 'ca']);
    });

    expect(result.current.recentCountries).toContain('US');
    expect(result.current.recentCountries).toContain('CA');
  });

  it('handles localStorage errors gracefully', () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Storage error');
    });

    // Should not throw
    const { result } = renderHook(() => useRecentCountries());
    expect(result.current.recentCountries).toEqual([]);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid json');

    // Should not throw
    const { result } = renderHook(() => useRecentCountries());
    expect(result.current.recentCountries).toEqual([]);
  });
});
