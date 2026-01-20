import { Router, Request, Response } from 'express';
import { countriesService } from '../services/countriesService.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const countries = countriesService.getAllCountries();

  // Set cache headers for 24 hours
  res.set('Cache-Control', 'public, max-age=86400');

  res.json({
    countries,
    total: countries.length,
  });
});

router.get('/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const country = countriesService.getCountryByCode(code);

  if (!country) {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: `Country with code "${code.toUpperCase()}" not found`,
      details: [],
    });
    return;
  }

  res.set('Cache-Control', 'public, max-age=86400');
  res.json(country);
});

export default router;
