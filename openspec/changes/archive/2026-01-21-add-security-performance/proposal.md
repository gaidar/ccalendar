# Proposal: Security & Performance

## Summary

Add comprehensive security measures and performance optimizations including Helmet.js security headers, CORS configuration, input sanitization, request logging with Winston, error tracking with Sentry, database indexes, Redis caching, and frontend code splitting.

## Motivation

Security and performance are critical for a production-ready application. Proper security headers protect against common web vulnerabilities, rate limiting prevents abuse, logging enables debugging and auditing, and performance optimizations ensure a responsive user experience.

## Scope

### In Scope

- Helmet.js security headers (CSP, HSTS, X-Frame-Options, etc.)
- CORS configuration for frontend origin
- Input sanitization for all user inputs
- Request logging with Winston
- Error tracking with Sentry
- Database indexes for performance
- Redis caching for countries list and token blacklist
- Frontend code splitting and lazy loading

### Out of Scope

- Web Application Firewall (WAF)
- DDoS protection (handled by hosting provider)
- Penetration testing
- Security audit
- Advanced caching strategies

## Design

### Security Headers

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.countrycalendar.app"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

### Rate Limiting Configuration

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| Global | 100 requests | 15 minutes | General protection |
| POST /auth/register | 3 requests | 1 hour | Prevent spam accounts |
| POST /auth/login | 5 requests | 1 minute | Brute force protection |
| POST /auth/reset-password | 3 requests | 1 hour | Email flood protection |
| GET /auth/oauth/* | 10 requests | 1 minute | OAuth abuse prevention |
| POST /travel-records | 60 requests | 1 minute | API abuse prevention |
| GET /reports/export | 5 requests | 1 hour | Export abuse prevention |

### Logging Strategy

- Winston for application logging
- Log levels: error, warn, info, debug
- Separate files for errors and combined logs
- JSON format for machine parsing
- Request/response logging in development
- Sentry for error tracking in production

### Database Indexes

- `users.email` - unique index for login lookups
- `travel_records(userId, date)` - compound index for date queries
- `travel_records(userId, date, countryCode)` - unique constraint
- `oauth_accounts(provider, providerId)` - unique constraint
- `support_tickets.referenceId` - unique index for lookups

### Frontend Performance

- Route-based code splitting with React.lazy
- Suspense boundaries for loading states
- Countries list caching in Redis
- Optimistic UI updates
- Memoization of expensive computations

## Technical Considerations

- Redis required for rate limiting store and caching
- Sentry DSN from environment variable
- Log rotation for file transports
- CSP may need adjustment for OAuth providers
- Test rate limits in staging before production
