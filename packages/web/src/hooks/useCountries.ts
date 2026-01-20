import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { api } from '@/lib/api';

export interface Country {
  code: string;
  name: string;
  color: string;
}

interface CountriesResponse {
  countries: Country[];
  total: number;
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => api.get<CountriesResponse>('/countries'),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useCountrySearch(countries: Country[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const fuse = useMemo(() => {
    if (!countries) return null;
    return new Fuse(countries, {
      keys: ['name', 'code'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [countries]);

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    if (!searchTerm.trim()) return countries;
    if (!fuse) return countries;

    return fuse.search(searchTerm).map(result => result.item);
  }, [countries, searchTerm, fuse]);

  return {
    searchTerm,
    setSearchTerm,
    filteredCountries,
  };
}

export function useCountryByCode(code: string | undefined) {
  const { data } = useCountries();

  return useMemo(() => {
    if (!data?.countries || !code) return undefined;
    return data.countries.find(c => c.code.toUpperCase() === code.toUpperCase());
  }, [data?.countries, code]);
}
