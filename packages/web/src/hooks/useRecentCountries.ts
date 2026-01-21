import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recent-countries';
const MAX_RECENT = 8;

export function useRecentCountries() {
  const [recentCountries, setRecentCountries] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentCountries(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const addRecentCountry = useCallback((countryCode: string) => {
    setRecentCountries(prev => {
      const code = countryCode.toUpperCase();
      const filtered = prev.filter(c => c !== code);
      const updated = [code, ...filtered].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  const addRecentCountries = useCallback((countryCodes: string[]) => {
    setRecentCountries(prev => {
      const codes = countryCodes.map(c => c.toUpperCase());
      const filtered = prev.filter(c => !codes.includes(c));
      const updated = [...codes, ...filtered].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  return {
    recentCountries,
    addRecentCountry,
    addRecentCountries,
  };
}
