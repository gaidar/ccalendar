import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

export interface Country {
  code: string;
  name: string;
  color: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CountriesService {
  private countries: Country[] = [];
  private countriesByCode: Map<string, Country> = new Map();

  constructor() {
    this.loadCountries();
  }

  private loadCountries(): void {
    try {
      const dataPath = join(__dirname, '../../data/countries.json');
      const data = readFileSync(dataPath, 'utf-8');
      this.countries = JSON.parse(data) as Country[];

      // Build lookup map
      this.countries.forEach(country => {
        this.countriesByCode.set(country.code.toUpperCase(), country);
      });

      logger.info(`Loaded ${this.countries.length} countries`);
    } catch (error) {
      logger.error('Failed to load countries data:', error);
      throw new Error('Failed to load countries data');
    }
  }

  getAllCountries(): Country[] {
    return this.countries;
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countriesByCode.get(code.toUpperCase());
  }

  isValidCountryCode(code: string): boolean {
    return this.countriesByCode.has(code.toUpperCase());
  }

  getCountryCount(): number {
    return this.countries.length;
  }
}

export const countriesService = new CountriesService();
