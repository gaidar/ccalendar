import { z } from 'zod';
import { countriesService } from '../services/countriesService.js';

export const countryCodeSchema = z
  .string()
  .length(2)
  .transform(code => code.toUpperCase())
  .refine(code => countriesService.isValidCountryCode(code), {
    message: 'Invalid country code',
  });

export const travelRecordSchema = z.object({
  countryCode: countryCodeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type CountryCode = z.infer<typeof countryCodeSchema>;
export type TravelRecordInput = z.infer<typeof travelRecordSchema>;
